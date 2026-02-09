
import { GoogleGenAI, Type } from "@google/genai";
import { getSystemPrompts } from './appBuilderService';
import { fetchStudioCookie } from './apiUtils';
import { AppMetadata } from '../types';

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

// FIX: Implement missing AI functions for Dashboard contextual features
export const getAppContextualGreeting = async (metadata: AppMetadata): Promise<string> => {
    const ai = await getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short, friendly, and professional welcome message for an app named "${metadata.name}" which is described as: "${metadata.description}". The greeting should be one sentence and suitable for a dashboard.`,
    });
    return response.text || `Welcome to ${metadata.name}`;
};

export const getSmartFeatureIdeas = async (metadata: AppMetadata): Promise<string[]> => {
    const ai = await getAi();
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on the app named "${metadata.name}" and its description: "${metadata.description}", suggest 3-5 unique and innovative feature ideas that use AI to improve user experience. Return the response as a JSON array of strings.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                }
            },
        },
    });
    try {
        const jsonStr = response.text?.trim() || '[]';
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse AI features", e);
        return [];
    }
};

// FIX: Export geminiService object to satisfy named import in Dashboard.tsx
export const geminiService = {
    getAppContextualGreeting,
    getSmartFeatureIdeas
};
