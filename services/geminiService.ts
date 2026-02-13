
import { GoogleGenAI, Type } from "@google/genai";
import { getSystemPrompts } from './appBuilderService';
import { fetchStudioCookie } from './apiUtils'

/**
 * Returns a configured GoogleGenAI instance.
 * Per @google/genai guidelines, it strictly uses process.env.API_KEY.
 */
export const getAi = async () => {
    // The API key must be obtained exclusively from process.env.API_KEY
    const apiKey = process.env.API_KEY || 'NOT_FOUND';
    
    const href = window.location.href;
    const hostname = window.location.hostname;
    const isStudioMode = href.includes('.goog');
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    
    /**
     * HumanizeIQ specific: Non-studio modes (deployed apps) route through a proxy
     * for unified access control.
     */
    let baseUrl='https://www.playtest.humanizeiq.ai/api-proxy'
    if (!isStudioMode) {
        baseUrl = `${window.location.origin}/api-proxy`;
    }
    const headers: Record<string, string> = {
        'User-Agent': 'DraftingStudio'
    };
    if (isStudioMode) {
        const cookie = await fetchStudioCookie();
        if (cookie) {
            headers['X-Studio-Cookie'] = cookie;
        }
    }
   
    return new GoogleGenAI({ 
        apiKey: apiKey,
        httpOptions: { 
            baseUrl: baseUrl,
            headers: headers
        }
    });
};

// Cache for system prompts to avoid repeated fetches
let systemPromptsCache: Record<string, string> | null = null;

export const getSystemInstruction = async (key: string): Promise<string> => {
    if (!systemPromptsCache) {
        systemPromptsCache = await getSystemPrompts();
    }
    return systemPromptsCache[key] || '';
};

// FIX: Exported geminiService object containing methods used by Dashboard.tsx
export const geminiService = {
    /**
     * Generates a short contextual greeting based on app metadata.
     */
    getAppContextualGreeting: async (metadata: { name: string; description: string }): Promise<string> => {
        const ai = await getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a short, friendly, one-sentence welcome greeting for an application called "${metadata.name}". App description: ${metadata.description}`,
        });
        return response.text?.trim() || `Welcome to ${metadata.name}`;
    },

    /**
     * Generates smart feature ideas based on app metadata.
     */
    getSmartFeatureIdeas: async (metadata: { name: string; description: string }): Promise<string[]> => {
        const ai = await getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Based on the app name "${metadata.name}" and description "${metadata.description}", suggest 3 innovative smart feature ideas. Return as a JSON array of strings.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });
        try {
            const jsonStr = response.text?.trim() || "[]";
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Error parsing feature ideas:", error);
            return ["Smart Analytics", "Automated Workflows", "Intelligent Predictions"];
        }
    }
};
