
import type { ComponentPrompt } from '../../types';
import { getUrlWithStudioAuth, getFetchOptions } from '../apiUtils';
import { getAppBuilderApiBaseUrl } from './config';
import { getSelfComponentId } from './componentService';

/**
 * Retrieves prompts for a specific component.
 * @param componentId The ID of the component.
 */
export const getComponentPrompts = async (componentId: number): Promise<ComponentPrompt[]> => {
    console.log(`API: Fetching prompts for componentId ${componentId}`);
    const baseUrl = `${getAppBuilderApiBaseUrl()}/app-builder/component-prompts`;
    
    const urlWithParams = new URL(baseUrl, window.location.origin);
    urlWithParams.searchParams.append('componentId', componentId.toString());
    const finalUrl = baseUrl.startsWith('http') ? urlWithParams.href : `${urlWithParams.pathname}${urlWithParams.search}`;
    
    const url = await getUrlWithStudioAuth(finalUrl);
    const options = await getFetchOptions({ method: 'GET' });

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            const error: any = new Error(`API call failed with status ${response.status}: ${errorText}`);
            error.status = response.status;
            try { error.body = JSON.parse(errorText); } catch (e) { error.body = errorText; }
            throw error;
        }
        return await response.json();
    } catch (error: any) {
        console.error(`Error fetching prompts for component ${componentId}:`, error);
        throw error;
    }
};

/**
 * Helper to convert prompt array to record map
 */
const convertPromptsToMap = (prompts: ComponentPrompt[]): Record<string, string> => {
    const map: Record<string, string> = {};
    if (Array.isArray(prompts)) {
        prompts.forEach(p => {
            if (p && p.title) {
                map[p.title] = p.content;
            }
        });
    }
    return map;
};

/**
 * Retrieves prompts for a specific component as a key-value map.
 * This is useful for easy lookup by prompt title.
 */
export const getPrompts = async (componentId: number): Promise<Record<string, string>> => {
    try {
        const prompts = await getComponentPrompts(componentId);
        return convertPromptsToMap(prompts);
    } catch (e) {
        console.error(`Failed to get prompts for component ${componentId}`, e);
        return {};
    }
}

/**
 * Retrieves system prompts for the current application (Self Component).
 * Returns a map of prompt title to prompt content.
 */
export const getSystemPrompts = async (): Promise<Record<string, string>> => {
    try {
        const selfId = await getSelfComponentId();
        if (!selfId) {
            console.warn("getSystemPrompts: No self component ID found.");
            return {};
        }
        const prompts = await getComponentPrompts(selfId);
        return convertPromptsToMap(prompts);
    } catch (e) {
        console.error("Failed to get system prompts", e);
        return {};
    }
}
