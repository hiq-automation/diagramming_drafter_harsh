import React, { useState, useCallback, useEffect } from 'react';
import { generateResponse } from '../../services/llmService';
import DiagramView from './DiagramView';
import { ChatMessage } from '../../types';
import { getUserDoc, deleteFile, saveUserDoc, updateFile } from '../../services/apiService';

const INITIAL_CODE = `graph TD`;

const DiagramContainer: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [mermaidCode, setMermaidCode] = useState(INITIAL_CODE);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [diagrams, setDiagrams] = useState<any[]>([]);
    const [isLoadingDiagrams, setIsLoadingDiagrams] = useState(false);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello! I'm your Diagram Architect. I've started with a clean canvas. What component or system should we begin with?" }
    ]);

    const fetchDiagrams = useCallback(async () => {
        setIsLoadingDiagrams(true);
        try {
            const res = await getUserDoc('HarshDiagrams');
            if (res.success && Array.isArray(res.files)) {
                setDiagrams(res.files);
            }
        } catch (err) {
            console.error("Failed to fetch diagrams:", err);
        } finally {
            setIsLoadingDiagrams(false);
        }
    }, []);

    useEffect(() => {
        fetchDiagrams();
    }, [fetchDiagrams]);

    const handleSelectDiagram = useCallback((diagram: any) => {
        const code = diagram.metadata?.mermaidCode || INITIAL_CODE;
        setMermaidCode(code);
        setActiveFileId(diagram.fileId);
        setChatMessages([{ role: 'model', content: `Loaded diagram: ${diagram.metadata?.displayName || diagram.fileName}.` }]);
        setIsSidebarOpen(false);
    }, []);

    const handleDeleteDiagram = useCallback(async (fileId: string) => {
        try {
            await deleteFile(fileId, false);
            if (activeFileId === fileId) setActiveFileId(null);
            setChatMessages(prev => [...prev, { role: 'model', content: "Diagram deleted successfully from Cloud storage." }]);
            fetchDiagrams();
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete diagram from cloud.");
        }
    }, [fetchDiagrams, activeFileId]);

    const handleSaveDiagram = useCallback(async () => {
        const blob = new Blob([JSON.stringify({ 
            mermaidCode, 
            version: '1.0', 
            timestamp: new Date().toISOString() 
        })], { type: 'application/json' });
        
        const metadata = { mermaidCode };
        
        if (activeFileId) {
            const file = new File([blob], `diagram-${Date.now()}.json`, { type: 'application/json' });
            await updateFile(file, activeFileId, false, metadata);
        } else {
            const res = await saveUserDoc(blob, 'HarshDiagrams', 'DiagramAssistant', metadata);
            if (res?.path) {
                // If the API returns the new file path/id, we should ideally track it
                // but for now we refresh to sync state.
                fetchDiagrams();
            }
        }
        await fetchDiagrams();
    }, [mermaidCode, activeFileId, fetchDiagrams]);

    const handleRenameDiagram = useCallback(async (fileId: string, newName: string) => {
        const diagram = diagrams.find(d => d.fileId === fileId);
        if (!diagram) return;
        if ((diagram.metadata?.displayName || diagram.fileName.split('-')[0]) === newName) return;

        try {
            const blob = new Blob([JSON.stringify({ 
                mermaidCode: diagram.metadata?.mermaidCode || mermaidCode,
                version: '1.0', 
                timestamp: new Date().toISOString() 
            })], { type: 'application/json' });
            
            const res = await saveUserDoc(blob, 'HarshDiagrams', 'DiagramAssistant', { 
                ...diagram.metadata, 
                displayName: newName 
            });

            await deleteFile(fileId, false);
            if (activeFileId === fileId && res?.fileId) {
                setActiveFileId(res.fileId);
            } else if (activeFileId === fileId) {
                setActiveFileId(null);
            }
            
            setChatMessages(prev => [...prev, { role: 'model', content: `Diagram migrated and renamed to "${newName}".` }]);
            fetchDiagrams();
        } catch (err) {
            console.error("Migration error:", err);
            setError("Failed to synchronize renaming with Cloud storage.");
        }
    }, [diagrams, fetchDiagrams, mermaidCode, activeFileId]);

    const handleGenerate = useCallback(async (overridingPrompt?: string) => {
        const inputPrompt = overridingPrompt || prompt;
        if (!inputPrompt.trim()) return;
        
        const newUserMsg: ChatMessage = { role: 'user', content: inputPrompt };
        setChatMessages(prev => [...prev, newUserMsg]);
        if (!overridingPrompt) setPrompt('');
        
        setIsGenerating(true);
        setError(null);
        
        try {
            const systemInstruction = `You are an AI Diagram Architect specializing in Mermaid.js.
            Your task is to update the current diagram based on user requests.
            
            Current Mermaid Syntax:
            ${mermaidCode}

            STRICT CONSTRAINTS:
            1. You are NOT ALLOWED to generate abstract, high-level complex system architectures from a single broad term (e.g., 'messaging system', 'e-commerce', 'social network').
            2. You ARE ALLOWED to process sequential, step-by-step instructions that explicitly define individual entities and their relationships (e.g., 'add a user communicating with a web server talking with a database d1 inside a Cloudflare container').
            3. If the user asks for a broad 'system' or 'architecture' without specific step-by-step entities, you MUST respond ONLY with the following JSON:
               { "reply": "I am not allowed to generate complex diagrams start slow with small diagram like create a web server", "mermaidCode": "${mermaidCode.replace(/"/g, '\\"')}" }
            4. For valid requests, respond with:
               { "reply": "A brief confirmation of the changes made", "mermaidCode": "The full updated mermaid code" }

            RULES:
            - Respond with JSON ONLY. No markdown backticks.
            - Process each sequential detail (nodes, relationships, containers like 'subgraph') mentioned in the prompt.
            - Preserve existing nodes unless asked to modify or replace them.`;

            const response = await generateResponse(
                { provider: 'google', model: 'gemini-3-flash-preview', systemInstruction },
                [...chatMessages, newUserMsg]
            );

            let parsed: { reply: string; mermaidCode: string };
            try {
                const cleanedResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
                parsed = JSON.parse(cleanedResponse);
            } catch (e) {
                const replyMatch = response.match(/"reply":\s*"([^"]+)"/);
                const codeMatch = response.match(/"mermaidCode":\s*"([^"]+)"/);
                parsed = {
                    reply: replyMatch ? replyMatch[1] : "I've processed your request.",
                    mermaidCode: codeMatch ? codeMatch[1].replace(/\\n/g, '\n') : mermaidCode
                };
            }

            if (parsed.mermaidCode) setMermaidCode(parsed.mermaidCode);
            setChatMessages(prev => [...prev, { role: 'model', content: parsed.reply }]);
        } catch (err: any) {
            console.error("Generation error:", err);
            setError('Failed to update diagram.');
            setChatMessages(prev => [...prev, { role: 'model', content: 'I encountered an error while updating the diagram.' }]);
        } finally {
            setIsGenerating(false);
        }
    }, [prompt, mermaidCode, chatMessages]);

    const handleClearHistory = useCallback(() => {
        setChatMessages([
            { role: 'model', content: 'History cleared. Workspace reset to an empty canvas.' }
        ]);
        setMermaidCode(INITIAL_CODE);
        setActiveFileId(null);
    }, []);

    return (
        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
            <DiagramView
                prompt={prompt}
                setPrompt={setPrompt}
                mermaidCode={mermaidCode}
                setMermaidCode={setMermaidCode}
                onGenerate={handleGenerate}
                onClearHistory={handleClearHistory}
                isGenerating={isGenerating}
                error={error}
                chatMessages={chatMessages}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                diagrams={diagrams}
                isLoadingDiagrams={isLoadingDiagrams}
                onSelectDiagram={handleSelectDiagram}
                onRefreshDiagrams={fetchDiagrams}
                onDeleteDiagram={handleDeleteDiagram}
                onRenameDiagram={handleRenameDiagram}
                onSaveDiagram={handleSaveDiagram}
                activeFileId={activeFileId}
            />
        </div>
    );
};

export default DiagramContainer;