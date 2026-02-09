
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
        'connect Order Processor to Idempotency Cache',
        'add a Stock Manager subscriber to Inventory Queue',
        'add an Order Processor subscriber to Orders Queue',
        'connect Topic Exchange to Orders and Inventory Queues',
        'add a Topic Exchange',
        'create a box labelled Publisher Service'
    ]);
    const [error, setError] = useState<string | null>(null);

    const generateDiagram = async () => {
        setError(null);
        if (!prompt.trim()) return;

        // Strict refusal logic for complex system/architecture requests
        const isForbiddenRequest = (p: string) => {
            const lower = p.toLowerCase().trim();
            const forbiddenKeywords = ['system', 'architecture', 'design any', 'complex', 'infrastructure'];
            
            // Check if it's a generic "messaging system" or "complex" request
            if (lower.includes('messaging system') || lower.includes('complex design')) return true;
            
            // If it contains forbidden architecture keywords and isn't a simple incremental command
            const isIncremental = (lower.startsWith('add ') || lower.startsWith('create a ') || lower.includes('connect ') || lower.includes('link ')) && !lower.includes('system') && !lower.includes('architecture');
            
            if (forbiddenKeywords.some(kw => lower.includes(kw)) && !isIncremental) return true;
            
            return false;
        };

        if (isForbiddenRequest(prompt)) {
            setError("I'm not allowed to generate complex designs or architecture, not even anything that will include creation of 3-4 nodes at a time. Please focus on creating small things like a box labelled web server, or connecting them with arrows.");
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
                    systemInstruction: `You are a strict technical illustrator. You ONLY evolve the flowchart by adding ONE node or ONE link at a time.

DIRECTIONS:
1. Maintain existing nodes and relationships.
2. If USER ACTION asks to create a box, add it: e.g. NodeID[Label].
3. If USER ACTION asks to connect nodes, add a link: e.g. NodeA --> NodeB.
4. DO NOT generate more than 1-2 new nodes in a single turn.
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
