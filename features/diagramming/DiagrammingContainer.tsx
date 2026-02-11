
import React, { useState, useEffect } from 'react';
import DiagrammingView from './DiagrammingView';
import { GoogleGenAI, Type } from "@google/genai";

const DiagrammingContainer: React.FC = () => {
    const [prompt, setPrompt] = useState('Create the diagram of a messaging system');
    const [diagramCode, setDiagramCode] = useState('');
    const [explanation, setExplanation] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    /**
     * Checks if the user's request is considered too complex or likely to result
     * in more than one node, as per safety constraints.
     */
    const isTooComplex = (input: string): boolean => {
        const p = input.toLowerCase();
        
        // Explicitly allow "web server" as it is the suggested starting point
        const isSimpleWebServer = p.includes("web server") && !p.includes("and") && p.split(' ').length < 10;
        if (isSimpleWebServer) return false;
        
        // Rejection keywords for "complex" or "multi-node" systems
        const complexKeywords = [
            'system', 'messaging', 'architecture', 'distributed', 'microservices', 
            'and', 'network', 'flow', 'process', 'sequence', 'database', 'cache',
            'broker', 'queue', 'cluster', 'load balancer'
        ];
        
        // Detect "messaging system" specifically or general complexity indicators
        const isMessagingRequest = p.includes('messaging system');
        const hasComplexityMarkers = complexKeywords.some(k => p.includes(k)) || input.split(' ').length > 4;
        
        return isMessagingRequest || hasComplexityMarkers;
    };

    const handleGenerate = async (targetPrompt?: string) => {
        const currentPrompt = targetPrompt || prompt;
        if (!currentPrompt.trim()) return;

        // Requirement: Reject requests for complex diagrams or diagrams with two or more nodes.
        if (isTooComplex(currentPrompt)) {
            setExplanation("I am not allowed to generate complex diagrams start slow with small diagram like create a web server");
            setDiagramCode("");
            return;
        }
        
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: `Analyze and architect a system for the following request: "${currentPrompt}". 
                Respond with a JSON object containing:
                1. "explanation": A concise, friendly textual overview of how the system works.
                2. "mermaidCode": Valid Mermaid.js code representing the core components and their interactions. Use flowchart (graph TD) or sequenceDiagram as appropriate for the request. Ensure the code is strictly valid mermaid syntax.`,
                config: {
                    temperature: 0.4,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            explanation: { 
                                type: Type.STRING, 
                                description: "Textual overview of the system architecture." 
                            },
                            mermaidCode: { 
                                type: Type.STRING, 
                                description: "The Mermaid.js code block for a diagram." 
                            }
                        },
                        required: ["explanation", "mermaidCode"]
                    }
                }
            });
            
            const result = JSON.parse(response.text || '{}');
            
            setExplanation(result.explanation || '');
            setDiagramCode(result.mermaidCode || '');
            
            setHistory(prev => {
                const filtered = prev.filter(p => p !== currentPrompt);
                return [currentPrompt, ...filtered].slice(0, 10);
            });
        } catch (error) {
            console.error("Failed to generate diagram:", error);
            setDiagramCode("Error: Failed to generate diagram. Check API connection.");
            setExplanation("I encountered an error while trying to architect the system. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const selectFromHistory = (item: string) => {
        setPrompt(item);
        handleGenerate(item);
    };

    useEffect(() => {
        handleGenerate();
    }, []);

    return (
        <DiagrammingView 
            prompt={prompt}
            setPrompt={setPrompt}
            diagramCode={diagramCode}
            explanation={explanation}
            history={history}
            isGenerating={isGenerating}
            onGenerate={() => handleGenerate()}
            onSelectHistory={selectFromHistory}
        />
    );
};

export default DiagrammingContainer;
