
import { getUrlWithStudioAuth, getFetchOptions } from './apiUtils';

const getApiBaseUrl = (): string => {
    const isStudioMode = window.location.href.includes('.goog');

    if (isStudioMode) {
        // In Studio Mode, use the absolute URL for the dev environment.
        return 'https://www.playtest.humanizeiq.ai/api/r2-explorer';
    }
    
    // In deployed environments (dev, prod, local), use a relative URL.
    return '/api/r2-explorer';
};

export async function uploadFile(file: File, metadata: object): Promise<any> {
    const baseUrl = `${getApiBaseUrl()}/upload`;
    const url = await getUrlWithStudioAuth(baseUrl);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const options = await getFetchOptions({
        method: 'POST',
        body: formData,
    });

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            const error: any = new Error(`File upload failed with status ${response.status}: ${errorText}`);
            try {
                error.body = JSON.parse(errorText);
            } catch (e) {
                error.body = { error: errorText };
            }
            throw error;
        }
        return await response.json();
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

export async function updateFile(file: File, fileIdOrPath: string, isPath: boolean = false, metadata?: object): Promise<any> {
    const baseUrl = `${getApiBaseUrl()}/update-file`;
    const url = await getUrlWithStudioAuth(baseUrl);
    
    // Construct query params carefully to preserve existing auth params
    const separator = url.includes('?') ? '&' : '?';
    const paramName = isPath ? 'path' : 'fileId';
    const fetchUrl = `${url}${separator}${paramName}=${encodeURIComponent(fileIdOrPath)}`;

    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
    }

    const options = await getFetchOptions({
        method: 'PUT',
        body: formData,
    });

    try {
        const response = await fetch(fetchUrl, options);
        if (!response.ok) {
            const errorText = await response.text();
            const error: any = new Error(`File update failed with status ${response.status}: ${errorText}`);
            try {
                error.body = JSON.parse(errorText);
            } catch (e) {
                error.body = { error: errorText };
            }
            throw error;
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating file:', error);
        throw error;
    }
}

export async function listFiles(category?: string): Promise<any> {
    const baseUrl = `${getApiBaseUrl()}/files`;
    let url = await getUrlWithStudioAuth(baseUrl);
    
    if (category) {
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}category=${encodeURIComponent(category)}`;
    }

    const options = await getFetchOptions({ method: 'GET' });
    const response = await fetch(url, options);
    if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Failed to list files: ${response.status} ${errorText}`);
    }
    return await response.json();
}

export async function listFilesByMetadata(metadata: any): Promise<any> {
    const baseUrl = `${getApiBaseUrl()}/files-by-metadata`;
    const url = await getUrlWithStudioAuth(baseUrl);

    const options = await getFetchOptions({
        method: 'POST',
        body: JSON.stringify({ metadata })
    });

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to list files by metadata: ${response.status} ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error listing files by metadata:', error);
        throw error;
    }
}

export async function downloadFile(pathOrId: string, isPath: boolean = true): Promise<any> {
    const baseUrl = `${getApiBaseUrl()}/download-file`;
    let url = await getUrlWithStudioAuth(baseUrl);
    
    const separator = url.includes('?') ? '&' : '?';
    const param = isPath ? 'path' : 'fileId';
    url = `${url}${separator}${param}=${encodeURIComponent(pathOrId)}`;

    const options = await getFetchOptions({ method: 'GET' });
    const response = await fetch(url, options);
    if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Failed to download file: ${response.status} ${errorText}`);
    }
    // Return JSON directly as we are storing JSON files
    return await response.json();
}

export async function deleteFile(pathOrId: string, isPath: boolean = true): Promise<any> {
    const baseUrl = `${getApiBaseUrl()}/delete-file`;
    let url = await getUrlWithStudioAuth(baseUrl);
    
    const separator = url.includes('?') ? '&' : '?';
    const param = isPath ? 'path' : 'fileId';
    url = `${url}${separator}${param}=${encodeURIComponent(pathOrId)}`;

    const options = await getFetchOptions({ method: 'DELETE' });
    const response = await fetch(url, options);
    if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Failed to delete file: ${response.status} ${errorText}`);
    }
    return await response.json();
}
