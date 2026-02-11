

import { GoogleGenAI, Type } from "@google/genai";
import { getSystemPrompts } from './appBuilderService';
import { fetchStudioCookie } from './apiUtils'
import { AppMetadata } from '../types';

/**
 * Returns a configured GoogleGenAI instance.
 * Per @google/genai guidelines, it strictly uses process.env.API_KEY.
 */
export const getAi = async () => {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    const apiKey = process.env.API_KEY || 'NOT_FOUND';
    
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

// FIX: Export geminiService object with methods used in Dashboard.tsx
export const geminiService = {
  /**
   * Generates a friendly greeting based on the app's name and description.
   */
  getAppContextualGreeting: async (metadata: AppMetadata): Promise<string> => {
    try {
      const ai = await getAi();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful AI assistant for an app named "${metadata.name}". Description: "${metadata.description}". Write a very short, cheerful greeting for the user.`,
      });
      return response.text?.trim() || `Welcome to ${metadata.name}!`;
    } catch (error) {
      console.error("Error generating greeting:", error);
      return `Welcome to ${metadata.name}!`;
    }
  },

  /**
   * Generates smart feature ideas based on the app's name and description.
   */
  getSmartFeatureIdeas: async (metadata: AppMetadata): Promise<string[]> => {
    try {
      const ai = await getAi();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest 3 smart, AI-driven feature names for an app named "${metadata.name}" with description: "${metadata.description}". Return a simple JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      const text = response.text?.trim() || '[]';
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating feature ideas:", error);
      return ["AI Insights", "Smart Automation", "Predictive Search"];
    }
  }
};
