
import type { Role, Permission } from '../../types';
import { getUrlWithStudioAuth, getFetchOptions } from '../apiUtils';
import { getAppBuilderApiBaseUrl } from './config';

/**
 * Retrieves the current user's roles and permissions from the RBAC endpoint.
 * @returns A promise that resolves with an object containing arrays of roles and permissions.
 */
export const getMyRbacDetails = async (): Promise<{ roles: Role[], permissions: Permission[] }> => {
    console.log('API: Fetching RBAC details (roles and permissions)');
    const baseUrl = `${getAppBuilderApiBaseUrl()}/rbac/me`;
    const url = await getUrlWithStudioAuth(baseUrl);
    const options = await getFetchOptions({ method: 'GET' });

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch RBAC details: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        return {
            roles: Array.isArray(data.roles) ? data.roles : [],
            permissions: Array.isArray(data.permissions) ? data.permissions : []
        };
    } catch (error: any) {
        console.error('Error fetching user RBAC details:', error);
        throw error;
    }
};
