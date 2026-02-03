
import type { ProjectComponent } from '../../types';
import { isStudioMode, getUrlWithStudioAuth, getFetchOptions } from '../apiUtils';
import { getAppBuilderApiBaseUrl } from './config';

// Helper to resolve the App Builder's own component based on metadata.json
let selfComponentPromise: Promise<ProjectComponent | null> | null = null;

// Re-implementing simplified getOrganizations/getProjects/getComponents locally to avoid circular dependencies or importing unused modules
// purely for getSelfComponent resolution logic if needed, or we can assume metadata is correct.
// However, the original implementation relied on fetching from DB to confirm.
// We will keep minimal fetch logic for getSelfComponent resolution.

const fetchComponentsMinimal = async (projectId: number): Promise<ProjectComponent[]> => {
    const baseUrl = `${getAppBuilderApiBaseUrl()}/app-builder/components`;
    const urlWithParams = new URL(baseUrl, window.location.origin);
    urlWithParams.searchParams.append('projectId', projectId.toString());
    const finalUrl = baseUrl.startsWith('http') ? urlWithParams.href : `${urlWithParams.pathname}${urlWithParams.search}`;
    const url = await getUrlWithStudioAuth(finalUrl);
    const options = await getFetchOptions({ method: 'GET' });
    const response = await fetch(url, options);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data.map((c: any) => ({...c, projectId: c.projectId || c.project_id})) : [];
};

const fetchOrganizationsMinimal = async (): Promise<any[]> => {
    const baseUrl = `${getAppBuilderApiBaseUrl()}/app-builder/organizations`;
    const url = await getUrlWithStudioAuth(baseUrl);
    const options = await getFetchOptions({ method: 'GET' });
    const response = await fetch(url, options);
    return response.ok ? await response.json() : [];
};

const fetchProjectsMinimal = async (orgId: number): Promise<any[]> => {
    const baseUrl = `${getAppBuilderApiBaseUrl()}/app-builder/projects`;
    const urlWithParams = new URL(baseUrl, window.location.origin);
    urlWithParams.searchParams.append('organizationId', orgId.toString());
    const finalUrl = baseUrl.startsWith('http') ? urlWithParams.href : `${urlWithParams.pathname}${urlWithParams.search}`;
    const url = await getUrlWithStudioAuth(finalUrl);
    const options = await getFetchOptions({ method: 'GET' });
    const response = await fetch(url, options);
    return response.ok ? await response.json() : [];
};

export const getSelfComponent = async (): Promise<ProjectComponent | null> => {
    if (selfComponentPromise) return selfComponentPromise;

    selfComponentPromise = (async () => {
        try {
            console.log("getSelfComponent: Starting lookup...");
            let url: string;
            // Use document.baseURI to correctly locate metadata.json in both Studio and Deployed modes
            if (isStudioMode()) {
                const base = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
                url = new URL('metadata.json', base).href;
            } else {
                // Calculate base: Host + first path segment (ignoring index.html)
                const pathParts = window.location.pathname.split('/').filter(p => p && p !== 'index.html');
                const base = pathParts.length > 0 
                    ? `${window.location.origin}/${pathParts[0]}/` 
                    : `${window.location.origin}/`;
                url = new URL('metadata.json', base).href;
            }

            const metaRes = await fetch(url);

            if (!metaRes.ok) {
                console.warn(`getSelfComponent: Could not fetch metadata.json. Status: ${metaRes.status}`);
                return null;
            }
            const metadata = await metaRes.json();
            console.log("getSelfComponent: Metadata loaded:", metadata);
            
            const { organization, project, component } = metadata;

            if (!organization || !project || !component) {
                console.warn("getSelfComponent: metadata.json missing required fields (organization, project, component)");
                return null;
            }

            // 1. Find Org
            const orgs = await fetchOrganizationsMinimal();
            const orgObj = orgs.find(o => o.name === organization);
            if (!orgObj) {
                console.warn(`getSelfComponent: Organization '${organization}' not found in DB.`);
                return null;
            }

            // 2. Find Project
            const projects = await fetchProjectsMinimal(orgObj.id);
            const projObj = projects.find(p => p.name === project);
            if (!projObj) {
                console.warn(`getSelfComponent: Project '${project}' not found in org '${organization}'.`);
                return null;
            }

            // 3. Find Component
            const components = await fetchComponentsMinimal(projObj.id);
            // Match by name or title
            const compObj = components.find(c => c.name === component || c.title === component);
            if (!compObj) {
                console.warn(`getSelfComponent: Component '${component}' not found in project '${project}'.`);
                return null;
            }

            console.log(`getSelfComponent: Resolved Self Component: ${compObj.id} for ${organization}/${project}/${component}`);
            return compObj;

        } catch (e) {
            console.error("getSelfComponent: Failed to resolve self component", e);
            return null;
        }
    })();
    
    return selfComponentPromise;
};

export const getSelfComponentId = async (): Promise<number | null> => {
    const comp = await getSelfComponent();
    return comp ? comp.id : null;
};
