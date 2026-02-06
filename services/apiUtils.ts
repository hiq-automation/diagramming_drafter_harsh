
/**
 * Shared utility functions for making authenticated API calls.
 * Handles logic for both Studio Mode and Deployed Mode.
 */

export const isStudioMode = (): boolean => {
    const hostname = window.location.href;
    return hostname.includes('.goog');
};


// --- Studio Mode Cookie Loading (Async) ---
// This promise ensures the cookie is fetched only once per session.
let studioCookiePromise: Promise<string | null> | null = null;

export const fetchStudioCookie = (): Promise<string | null> => {
    if (!isStudioMode()) {
        return Promise.resolve(null);
    }
    if (studioCookiePromise) {
        return studioCookiePromise;
    }
    studioCookiePromise = (async () => {
        try {
            // Fetch from the application's relative path
            const response = await fetch('./local_cookie.json');
            if (!response.ok) {
                console.error(`Failed to fetch local_cookie.json: ${response.statusText}`);
                return null;
            }
            const data = await response.json();
            if (data && typeof data.cookie === 'string') {
                return data.cookie;
            }
            console.error("Invalid format for local_cookie.json. Expected { \"cookie\": \"...\" }");
            return null;
        } catch (error) {
            console.error("Error fetching or parsing local_cookie.json:", error);
            return null;
        }
    })();
    return studioCookiePromise;
};
// --- End Studio Mode Cookie Loading ---

/**
 * Appends the Studio Mode authentication cookie as a query parameter to a URL if needed.
 * @param baseUrl The base URL for the API call.
 * @returns The URL with the auth parameter if in Studio Mode.
 */
export const getUrlWithStudioAuth = async (baseUrl: string): Promise<string> => {
    if (!isStudioMode()) {
        return baseUrl;
    }
    const cookie = await fetchStudioCookie();
    if (!cookie) {
        return baseUrl;
    }
    const param = `X-Studio-Cookie=${encodeURIComponent(cookie)}`;
    if (baseUrl.includes('?')) {
        return `${baseUrl}&${param}`;
    } else {
        return `${baseUrl}?${param}`;
    }
}

/**
 * Creates the options object for a fetch call, including credentials and headers.
 * @param options Initial RequestInit options.
 * @returns A complete RequestInit object for the fetch call.
 */
export const getFetchOptions = async (options: RequestInit = {}): Promise<RequestInit> => {
    const headers = new Headers(options.headers);

    // For FormData, let the browser set the Content-Type with the correct boundary.
    // For other POST/PUT/PATCH requests, default to application/json if not set.
    if (!(options.body instanceof FormData) && options.method && ['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase()) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // Studio auth is handled via query parameter, but 'credentials: include' is still needed for deployed mode cookies.
    return {
        ...options,
        credentials: 'include',
        headers: headers,
    };
};
