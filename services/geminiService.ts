
import { GoogleGenAI } from "@google/genai";
import { getSystemPrompts } from './appBuilderService';
import { fetchStudioCookie } from './apiUtils'
// FIX: Import AppMetadata to resolve type error in Dashboard
import { AppMetadata } from '../types';

/**
 * Returns a configured GoogleGenAI instance.
 * Per @google/genai guidelines, it strictly uses process.env.API_KEY.
 */
export const getAi = async () => {
    // The API key must be obtained exclusively from process.env.API_KEY
    const apiKey = process.env.API_KEY as string;
    
    const href = window.location.href;
    const hostname = window.location.hostname;
    const isStudioMode = href.includes('.goog');
    
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

/**
 * geminiService provides high-level AI capabilities for the application.
 */
export const geminiService = {
    /**
     * Generates a short welcome greeting based on app metadata.
     */
    getAppContextualGreeting: async (metadata: AppMetadata): Promise<string> => {
        const ai = await getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate a short, friendly, and professional welcome greeting for a user of an app called "${metadata.name}". The app description is: "${metadata.description}". Keep it under 20 words.`,
        });
        return response.text?.trim() || `Welcome to ${metadata.name}!`;
    },

    /**
     * Suggests 3 smart features based on app name and description.
     */
    getSmartFeatureIdeas: async (metadata: AppMetadata): Promise<string[]> => {
        const ai = await getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Based on the app name "${metadata.name}" and description "${metadata.description}", suggest 3 creative smart feature ideas. Return them as a simple comma-separated list of just the feature names.`,
        });
        const text = response.text || '';
        return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
};
