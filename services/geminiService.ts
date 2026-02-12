

import { GoogleGenAI, Type } from "@google/genai";
import { getSystemPrompts } from './appBuilderService';
import { fetchStudioCookie } from './apiUtils'
import { AppMetadata } from '../types';

/**
 * Returns a configured GoogleGenAI instance.
 * Per @google/genai guidelines, it strictly uses process.env.API_KEY.
 * This is kept as a named export because llmService.ts also uses it.
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

/**
 * Retrieves a specific system instruction by key.
 * This function is an internal helper for the geminiService methods.
 */
const getInternalSystemInstruction = async (key: string): Promise<string> => {
    if (!systemPromptsCache) {
        systemPromptsCache = await getSystemPrompts();
    }
    return systemPromptsCache[key] || '';
};

export const geminiService = {
    /**
     * Generates a contextual greeting for the app based on its metadata.
     * Uses 'app_greeting_instruction' system prompt.
     */
    getAppContextualGreeting: async (metadata: AppMetadata): Promise<string> => {
        const ai = await getAi(); // Use the exported getAi
        const systemInstruction = await getInternalSystemInstruction('app_greeting_instruction');

        const prompt = `Generate a concise and engaging welcome message or greeting for an application.
        The application is named "${metadata.name}" and its description is: "${metadata.description}".
        The greeting should be less than 50 words, friendly, and hint at the app's purpose without being overly detailed.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview', // Default model for basic text tasks
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction || 'You are a helpful assistant for app development.',
                    maxOutputTokens: 100, // Limit token output to ensure conciseness
                    // Add thinking budget to prevent empty responses if maxOutputTokens is hit during thinking
                    thinkingConfig: { thinkingBudget: 25 },
                },
            });
            return response.text || `Welcome to ${metadata.name}!`;
        } catch (error) {
            console.error("Error generating app contextual greeting:", error);
            // Fallback message
            return `Welcome to ${metadata.name}!`;
        }
    },

    /**
     * Generates smart feature ideas for the app based on its metadata.
     * Uses 'app_feature_ideas_instruction' system prompt and expects JSON output.
     */
    getSmartFeatureIdeas: async (metadata: AppMetadata): Promise<string[]> => {
        const ai = await getAi(); // Use the exported getAi
        const systemInstruction = await getInternalSystemInstruction('app_feature_ideas_instruction');

        const prompt = `Based on the following application metadata, suggest 3-5 concise, unique, and compelling smart feature ideas.
        The application is named "${metadata.name}" and its description is: "${metadata.description}".
        Return the features as a JSON array of strings, for example: ["Feature 1", "Feature 2", "Feature 3"].
        Each feature description should be a single sentence, limited to 15 words.`;

        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview', // Default model for basic text tasks
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction || 'You are a creative assistant for brainstorming app features.',
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY, // Use Type enum for responseSchema
                        items: {
                            type: Type.STRING, // Use Type enum for responseSchema
                        },
                    },
                    maxOutputTokens: 200, // Reasonable limit for a list of features
                    thinkingConfig: { thinkingBudget: 50 },
                },
            });
            const jsonStr = response.text?.trim();
            if (jsonStr) {
                try {
                    const parsed = JSON.parse(jsonStr);
                    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                        return parsed;
                    }
                } catch (parseError) {
                    console.error("Failed to parse JSON response for feature ideas:", parseError);
                }
            }
            // Fallback features if API fails or response is malformed
            return ["Enhanced Analytics", "User Feedback Integration", "AI-powered Suggestions"];
        } catch (error) {
            console.error("Error generating smart feature ideas:", error);
            // Fallback features on API error
            return ["Enhanced Analytics", "User Feedback Integration", "AI-powered Suggestions"];
        }
    }
};
