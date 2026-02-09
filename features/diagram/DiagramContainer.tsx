
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import MainContainer from '../../containers/MainContainer';
import DiagramView from './DiagramView';
import { getAi } from '../../services/geminiService';

const DiagramContainer: React.FC = () => {
    const { authState, user, workspaceUrl, signOutUrl } = useAuth();
    const [prompt, setPrompt] = useState('');
    const [mermaidCode, setMermaidCode] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<string[]>([
        'add a server',
        'create a database',
        'connect App to DB',
        'add an API Gateway'
    ]);
    const [error, setError] = useState<string | null>(null);

    const generateDiagram = async () => {
        setError(null);
        if (!prompt.trim()) return;

        // Strict refusal logic: only allow adding/modifying one component at a time
        const isForbiddenRequest = (p: string) => {
            const lower = p.toLowerCase().trim();
            
            // List of prefixes that indicate single-component or single-link actions
            const allowedPrefixes = ['add ', 'create ', 'connect ', 'link ', 'draw ', 'make '];
            const startsWithAllowedAction = allowedPrefixes.some(pre => lower.startsWith(pre));

            // Keywords indicating entire systems or complex requests
            const complexKeywords = ['system', 'architecture', 'diagram', 'infrastructure', 'complex', 'entire', 'full', 'all'];
            const containsComplexKeyword = complexKeywords.some(kw => lower.includes(kw));

            // Check for multiple actions using 'and' or commas
            const containsMultipleActions = lower.includes(' and ') || lower.includes(',');

            // If it's not a simple incremental action, or it mentions a system/complex design, or it's multiple parts: refuse.
            if (!startsWithAllowedAction || (containsComplexKeyword && !lower.includes('label')) || containsMultipleActions) {
                return true;
            }
            
            return false;
        };

        if (isForbiddenRequest(prompt)) {
            setError("This action is against my rules. I only allow adding one component or link at a time (e.g., 'add server' or 'connect A to B'). Please break down your request.");
            return;
        }

        setIsLoading(true);
        try {
            const ai = await getAi();
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `CURRENT STATE:
${mermaidCode || 'No diagram yet.'}

USER ACTION:
${prompt}`,
                config: {
                    thinkingConfig: { thinkingBudget: 15000 },
                    temperature: 0.1,
                    systemInstruction: `You are a strict technical illustrator. You ONLY evolve the flowchart by adding EXACTLY ONE node or ONE link at a time.

DIRECTIONS:
1. Maintain existing nodes and relationships.
2. If USER ACTION asks to create a box, add it: e.g. NodeID[Label].
3. If USER ACTION asks to connect nodes, add a link: e.g. NodeA --> NodeB.
4. DO NOT generate more than 1 new node or 1 new link in a single turn.
5. If the request is too broad, add only the most basic starting node.
6. Start the diagram with "flowchart TD" if no diagram exists.

OUTPUT:
- Return ONLY valid Mermaid flowchart TD code.
- No markdown, no explanations.`
                }
            });

            const rawText = response.text || '';
            const cleanedCode = rawText
                .replace(/```mermaid/g, '')
                .replace(/```/g, '')
                .split('\n')
                .filter(line => {
                    const l = line.trim();
                    return l.startsWith('flowchart') || l.startsWith('graph') || l.includes('[') || l.includes('-->') || l.includes('subgraph') || l.includes('end') || l.includes('style');
                })
                .join('\n')
                .trim();
                
            if (cleanedCode && (cleanedCode.startsWith('flowchart') || cleanedCode.startsWith('graph'))) {
                setMermaidCode(cleanedCode);
                setHistory(prev => [prompt, ...prev.filter(h => h !== prompt)].slice(0, 15));
                setPrompt('');
            }
        } catch (error) {
            console.error("Diagram evolution failed:", error);
            setError("Failed to process the diagram request. Try a simpler command.");
        } finally {
            setIsLoading(false);
        }
    };

    if (authState === 'checking') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <MainContainer user={user} workspaceUrl={workspaceUrl} signOutUrl={signOutUrl}>
            <DiagramView 
                prompt={prompt}
                setPrompt={(val) => { setPrompt(val); setError(null); }}
                mermaidCode={mermaidCode}
                onGenerate={generateDiagram}
                isLoading={isLoading}
                history={history}
                error={error}
            />
        </MainContainer>
    );
};

export default DiagramContainer;
