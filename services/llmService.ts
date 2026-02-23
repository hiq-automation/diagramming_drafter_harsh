

import { getAi } from './geminiService';
import { isStudioMode, fetchStudioCookie } from './apiUtils';
import OpenAI from 'openai';
import type { ChatMessage, ModelProvider, LLMConfig } from '../types';

export const MODELS: Record<ModelProvider, string[]> = {
    openai: ['chatgpt-latest'],
    // Use the latest recommended model for basic text tasks
    google: ['gemini-3-flash-preview']
};

export const generateResponse = async (
    config: LLMConfig,
    messages: ChatMessage[]
): Promise<string> => {
    // Prepare headers for authentication (needed for proxy in Studio Mode)
    const headers: Record<string, string> = {};
    if (isStudioMode()) {
        const cookie = await fetchStudioCookie();
        if (cookie) {
            headers['X-Studio-Cookie'] = cookie;
        }
    }

    if (config.provider === 'google') {
        const ai = await getAi();
        const history = messages.slice(0, -1).map(m => ({
            role: m.role,
            parts: [{ text: m.context || m.content }]
        }));
        
        const lastMessage = messages[messages.length - 1];
        const content = lastMessage.context || lastMessage.content;

        const chatConfig: any = {
            model: config.model,
            history: history,
        };

        if (config.systemInstruction) {
            chatConfig.config = {
                systemInstruction: config.systemInstruction
            };
        }

        const chat = ai.chats.create(chatConfig);

        const response = await chat.sendMessage({ message: content });
        // Correct usage of .text property
        return response.text || "No response text.";

    } else if (config.provider === 'openai') {
        // API Key handled by proxy
        const apiKey = config.apiKey || 'managed-by-proxy';
        
        const baseURL = 'https://www.playtest.humanizeiq.ai/api-proxy/openai/v1';
        
        const openai = new OpenAI({ 
            apiKey: apiKey, 
            baseURL: baseURL,
            dangerouslyAllowBrowser: true,
            defaultHeaders: headers
        });

        let openAiMessages = messages.map(m => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.context || m.content
        })) as any[];

        if (config.systemInstruction) {
            openAiMessages = [
                { role: 'system', content: config.systemInstruction },
                ...openAiMessages
            ];
        }

        const completion = await openai.chat.completions.create({
            messages: openAiMessages,
            model: config.model,
        });

        return completion.choices[0]?.message?.content || "No response text.";

    }

    throw new Error(`Unsupported provider: ${config.provider}`);
};
