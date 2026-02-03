
import { GoogleGenAI } from "@google/genai";
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
