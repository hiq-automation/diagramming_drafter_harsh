
import { GoogleGenAI, Type } from "@google/genai";
import { getSystemPrompts } from './appBuilderService';
import { fetchStudioCookie } from './apiUtils'
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

/**
 * geminiService providing contextual AI helper functions for the dashboard.
 */
export const geminiService = {
    /**
     * Generates a contextual greeting based on app metadata.
     */
    getAppContextualGreeting: async (metadata: AppMetadata): Promise<string> => {
        try {
            const ai = await getAi();
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Generate a short, friendly, and professional one-sentence greeting for an app named "${metadata.name}" which is described as: "${metadata.description}". The greeting should welcome the user to the platform.`,
            });
            return response.text?.trim() || `Welcome to ${metadata.name}`;
        } catch (error) {
            console.error("Error generating greeting:", error);
            return `Welcome to ${metadata.name}`;
        }
    },

    /**
     * Suggests smart feature ideas based on app metadata using structured JSON output.
     */
    getSmartFeatureIdeas: async (metadata: AppMetadata): Promise<string[]> => {
        try {
            const ai = await getAi();
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Based on the app name "${metadata.name}" and description "${metadata.description}", suggest 3-5 unique and innovative feature ideas that would fit this app. Return them as a JSON array of strings.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            });
            
            const text = response.text?.trim();
            if (!text) return [];
            
            const features = JSON.parse(text);
            return Array.isArray(features) ? features : [];
        } catch (error) {
            console.error("Error generating feature ideas:", error);
            // Fallback features if AI generation fails
            return [
                "AI-Powered Collaboration",
                "Intelligent Workflow Automation",
                "Predictive Project Insights"
            ];
        }
    }
};
