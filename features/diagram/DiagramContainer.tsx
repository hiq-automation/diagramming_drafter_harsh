import React, { useState, useCallback, useEffect } from 'react';
import { generateResponse } from '../../services/llmService';
import DiagramView from './DiagramView';
import { ChatMessage } from '../../types';
import { getUserDoc, deleteFile, saveUserDoc } from '../../services/apiService';

const INITIAL_CODE = `graph TD`;

const DiagramContainer: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [mermaidCode, setMermaidCode] = useState(INITIAL_CODE);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [diagrams, setDiagrams] = useState<any[]>([]);
    const [isLoadingDiagrams, setIsLoadingDiagrams] = useState(false);
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
        setChatMessages([{ role: 'model', content: `Loaded diagram: ${diagram.metadata?.displayName || diagram.fileName}.` }]);
        setIsSidebarOpen(false);
    }, []);

    const handleDeleteDiagram = useCallback(async (fileId: string) => {
        try {
            await deleteFile(fileId, false);
            setChatMessages(prev => [...prev, { role: 'model', content: "Diagram deleted successfully from Cloud storage." }]);
            fetchDiagrams();
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete diagram from cloud.");
        }
    }, [fetchDiagrams]);

    const handleRenameDiagram = useCallback(async (fileId: string, newName: string) => {
        const diagram = diagrams.find(d => d.fileId === fileId);
        if (!diagram) return;

        // Skip if name is identical
        if ((diagram.metadata?.displayName || diagram.fileName.split('-')[0]) === newName) return;

        try {
            // To migrate the R2 object key (since names are timestamp-based in saveUserDoc),
            // we create a fresh document and remove the legacy one.
            const blob = new Blob([JSON.stringify({ 
                mermaidCode: diagram.metadata?.mermaidCode || mermaidCode,
                version: '1.0', 
                timestamp: new Date().toISOString() 
            })], { type: 'application/json' });
            
            // Step 1: Create the new record with updated metadata label
            await saveUserDoc(blob, 'HarshDiagrams', 'DiagramAssistant', { 
                ...diagram.metadata, 
                displayName: newName 
            });

            // Step 2: Delete the old record to complete migration
            await deleteFile(fileId, false);
            
            setChatMessages(prev => [...prev, { role: 'model', content: `Diagram migrated and renamed to "${newName}".` }]);
            fetchDiagrams();
        } catch (err) {
            console.error("Migration error:", err);
            setError("Failed to synchronize renaming with Cloud storage.");
        }
    }, [diagrams, fetchDiagrams, mermaidCode]);

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
            1. You are NOT ALLOWED to generate complex diagrams (e.g., "messaging system", "e-commerce", "social network") or add more than ONE node/component at a time.
            2. If the user's request is complex or asks for a full system at once, you MUST respond ONLY with the following JSON:
               { "reply": "I am not allowed to generate complex diagrams start slow with small diagram like create a web server", "mermaidCode": "${mermaidCode.replace(/"/g, '\\"')}" }
            3. For simple, valid requests (adding one node or one link), respond with:
               { "reply": "A brief confirmation", "mermaidCode": "The full updated mermaid code" }

            RULES:
            - Respond with JSON ONLY. No markdown backticks.
            - Do not generate complex designs at once.
            - Preserve existing nodes unless asked to modify one.`;

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
    }, []);

    return (
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
        />
    );
};

export default DiagramContainer;