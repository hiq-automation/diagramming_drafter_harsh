
import { GoogleGenAI, Type } from '@google/genai';
import { getAi } from '../../../services/geminiService';
import { getSystemPrompts } from '../../../services/appBuilderService';
import { ChatMessage, DiagramGenerationOutput } from '../../../types';

// Cache for system prompts to avoid repeated fetches
let systemPromptsCache: Record<string, string> | null = null;

/**
 * Retrieves a specific system instruction by key.
 * This function is an internal helper for the diagramService methods.
 */
const getInternalSystemInstruction = async (key: string): Promise<string> => {
    if (!systemPromptsCache) {
        systemPromptsCache = await getSystemPrompts();
    }
    return systemPromptsCache[key] || '';
};

/**
 * Checks if a given prompt indicates a request for a complex diagram
 * or multiple components simultaneously.
 * @param prompt The user's input prompt.
 * @returns True if the prompt is deemed too complex, false otherwise.
 */
const checkPromptComplexity = (prompt: string): boolean => {
    const lowerCasePrompt = prompt.toLowerCase().trim();
    
    // 1. Keywords indicating complex or full system requests
    const complexKeywords = [
        "messaging system",
        "distributed system",
        "microservices",
        "full system",
        "complex diagram",
        "architecture",
        "system design",
        "entire diagram",
        "multiple components",
        "infrastructure",
        "flowchart of a system"
    ];

    if (complexKeywords.some(keyword => lowerCasePrompt.includes(keyword))) {
        return true;
    }

    // 2. Pattern: "create a ... diagram" or "create a ... system"
    // This catches patterns like "create a messaging system", "build a login system", etc.
    const createComplexPattern = /(create|generate|draw|make|build|show) (a|an|the)? .* (diagram|system|architecture|setup)/i;
    if (createComplexPattern.test(lowerCasePrompt)) {
        return true;
    }

    // 3. Pattern: "add ..., ..." (more than one item at a time) or "add ... and ..."
    // Regex checks for a verb followed by something, then a conjunction, then another thing.
    const addMultiplePattern = /(add|insert|put|create|generate) (a|an|the)? .+ (and|&|plus|,) (a|an|the)? .+/i;
    if (addMultiplePattern.test(lowerCasePrompt)) {
        return true;
    }

    // 4. Action-oriented with multiple markers (fallback)
    const isActionOriented = /add|create|generate|insert|build/i.test(lowerCasePrompt);
    const hasMultipleMarkers = / and | & | plus |,/i.test(lowerCasePrompt);
    if (isActionOriented && hasMultipleMarkers) {
        return true;
    }

    return false;
};

export const diagramService = {
    /**
     * Generates a chat reply and Mermaid code based on user prompt and conversation history.
     * It now also accepts `previousMermaidCode` to enable incremental diagram updates.
     */
    generateDiagramContent: async (
        prompt: string,
        history: ChatMessage[],
        previousMermaidCode: string, // New parameter for incremental updates
    ): Promise<DiagramGenerationOutput> => {
        // --- COMPLEXITY CHECK START ---
        // Requirement: Enforce Single Component Addition Constraint.
        // If a user attempts to generate an entire diagram or multiple components, refuse.
        if (checkPromptComplexity(prompt)) {
            return {
                reply: "This action is against the rules. I am only allowed to add one component at a time. Please start small, for example by saying 'add a web server'.",
                mermaidCode: previousMermaidCode, // Maintain current state, no update to canvas
            };
        }
        // --- COMPLEXITY CHECK END ---

        const ai = await getAi();
        const systemInstruction = await getInternalSystemInstruction('diagram_generation_instruction');

        const chatHistory = history.map(m => ({
            role: m.role === 'model' ? 'model' : 'user', // Map 'system' to 'user' for chat history
            parts: [{ text: m.content }]
        }));

        // Augment the prompt to include the previous Mermaid code for incremental updates
        const fullPrompt = previousMermaidCode && previousMermaidCode !== ''
            ? `The current diagram code is:\n\`\`\`mermaid\n${previousMermaidCode}\n\`\`\`\n\nBased on this, ${prompt}`
            : prompt;


        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [
                    ...chatHistory,
                    { role: 'user', parts: [{ text: fullPrompt }] }
                ],
                config: {
                    systemInstruction: systemInstruction || `You are a helpful AI assistant that specializes in generating concise Mermaid diagram code and friendly chat replies. When a user asks you to create or modify a diagram, you will:
1. If 'The current diagram code is:' is provided, you MUST update that existing diagram by adding new nodes or connections, or modifying existing ones, based on the new user request. Do NOT erase or restart the diagram from scratch unless explicitly asked to "start a new diagram" or "clear the canvas".
2. Provide a short, friendly chat reply confirming the action (e.g., "Okay, I've added a web server node.").
3. Generate the corresponding Mermaid.js code for the diagram.
4. Ensure the Mermaid code is valid and complete.
5. Keep the Mermaid code as simple as possible. For single entities like 'web server', generate a single node like 'graph TD\\nA[Web Server]'.
6. Combine your chat reply and Mermaid code into a JSON object with 'reply' and 'mermaidCode' keys.`,
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            reply: {
                                type: Type.STRING,
                                description: 'A friendly chat reply to the user.',
                            },
                            mermaidCode: {
                                type: Type.STRING,
                                description: 'The generated Mermaid.js code for the diagram.',
                            },
                        },
                        required: ['reply', 'mermaidCode'],
                        propertyOrdering: ['reply', 'mermaidCode'],
                    },
                    maxOutputTokens: 500,
                    thinkingConfig: { thinkingBudget: 100 },
                },
            });

            const jsonStr = response.text?.trim();
            if (jsonStr) {
                try {
                    const parsed = JSON.parse(jsonStr) as DiagramGenerationOutput;
                    if (parsed.reply && parsed.mermaidCode) {
                        return parsed;
                    }
                } catch (parseError) {
                    console.error("Failed to parse JSON response for diagram generation:", parseError);
                }
            }
            // Fallback if API fails or response is malformed
            return {
                reply: "Sorry, I couldn't generate the diagram or response.",
                mermaidCode: previousMermaidCode || 'graph TD\nA[Error generating diagram]',
            };
        } catch (error) {
            console.error("Error generating diagram content:", error);
            // Fallback on API error
            return {
                reply: "An error occurred while trying to generate the diagram. Please try again.",
                mermaidCode: previousMermaidCode || 'graph TD\nA[Error: API communication failed]',
            };
        }
    },
};
