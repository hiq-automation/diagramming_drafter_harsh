import { useState, useCallback, useEffect } from 'react';
import { generateResponse } from '../../../services/llmService';
import { getUserDoc, deleteFile, saveUserDoc, updateFile } from '../../../services/apiService';
import { ChatMessage } from '../../../types';
import { INITIAL_CODE, DIAGRAM_CATEGORY, AGENT_NAME } from '../constants';
import { getComponentPrompts } from '../../../services/appBuilder/promptService';
import { getComponentByTitle } from '../../../services/appBuilder/componentService';

const DIAGRAM_PROMPT_TITLE = 'HARSH_DIAGRAM_PROMPT';


export const useDiagramManager = () => {
    const [prompt, setPrompt] = useState('');
    const [mermaidCode, setMermaidCode] = useState(INITIAL_CODE);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [diagrams, setDiagrams] = useState<any[]>([]);
    const [isLoadingDiagrams, setIsLoadingDiagrams] = useState(false);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello! I'm your Diagram Architect. I've started with a clean canvas. What component or system should we begin with?" }
    ]);
    const [systemPromptTemplate, setSystemPromptTemplate] = useState<string | null>(null);

    const fetchSystemPrompt = useCallback(async () => {
        try {
            console.log(`useDiagramManager: Fetching component ID for '${DIAGRAM_PROMPT_TITLE}'...`);
            const component = await getComponentByTitle(DIAGRAM_PROMPT_TITLE);

            if (!component) {
                console.warn(`useDiagramManager: Could not resolve component ID for '${DIAGRAM_PROMPT_TITLE}'. Falling back.`);
                return;
            }

            console.log(`useDiagramManager: Fetching prompts for component ID ${component.id}...`);
            const prompts = await getComponentPrompts(component.id);
            const harshPrompt = prompts.find(p => p.title === DIAGRAM_PROMPT_TITLE);

            if (harshPrompt) {
                console.log(`useDiagramManager: Dynamic prompt '${DIAGRAM_PROMPT_TITLE}' fetched successfully.`);
                setSystemPromptTemplate(harshPrompt.content);
            } else {
                console.warn(`useDiagramManager: Prompt '${DIAGRAM_PROMPT_TITLE}' not found in component ${component.id}.`);
            }
        } catch (err) {
            console.error("useDiagramManager: Failed to fetch system prompt:", err);
        }
    }, []);

    useEffect(() => {
        fetchSystemPrompt();
    }, [fetchSystemPrompt]);


    const fetchDiagrams = useCallback(async () => {
        setIsLoadingDiagrams(true);
        try {
            const res = await getUserDoc(DIAGRAM_CATEGORY);
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
            const res = await saveUserDoc(blob, DIAGRAM_CATEGORY, AGENT_NAME, metadata);
            if (res?.path) {
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

            const res = await saveUserDoc(blob, DIAGRAM_CATEGORY, AGENT_NAME, {
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
            let systemInstruction: string;
            if (!systemPromptTemplate) {
                setError("System prompt is still loading or could not be fetched.");
                setIsGenerating(false);
                return;
            }

            // Replace simple ${mermaidCode}
            systemInstruction = systemPromptTemplate.replace(/\${mermaidCode}/g, mermaidCode);
            // Handle the escaped version if present: ${mermaidCode.replace(/"/g, '\\"')} or similar
            // The API content has: ${mermaidCode.replace(/"/g, '\\\\\"')}
            const escapedMermaidCode = mermaidCode.replace(/"/g, '\\"');
            systemInstruction = systemInstruction.replace(/\${mermaidCode\.replace\(\/\"\/g,\s*'.*?'\)\}/g, escapedMermaidCode);

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

    return {
        prompt, setPrompt, mermaidCode, setMermaidCode, isGenerating, error, diagrams,
        isLoadingDiagrams, activeFileId, chatMessages, fetchDiagrams, handleSelectDiagram,
        handleDeleteDiagram, handleSaveDiagram, handleRenameDiagram, handleGenerate, handleClearHistory
    };
};
