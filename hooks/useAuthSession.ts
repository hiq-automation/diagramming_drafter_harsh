import { useState, useEffect } from 'react';
import { User, Role, Permission } from '../types';
import * as appBuilderService from '../services/appBuilderService';

export const useAuthSession = () => {
    const [authState, setAuthState] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    useEffect(() => {
        const checkAuth = async () => {
            const isGoogDomain = window.location.href.includes('.goog');
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            // Configure Gemini API Key globally for compatibility
            (window as any).GEMINI_API_KEY = isGoogDomain 
                ? ((window as any).process?.env?.API_KEY || 'NOTFOUND') 
                : 'NOT_SET';

            if (isLocal) {
                setUser({ name: 'Local Dev User', company_name: 'HumanizeIQ', uid: 'local-dev-uid' });
                setAuthState('authorized');
                setRoles(['Admin']);
                setPermissions(['all:access']);
                return;
            }

            const authUrl = isGoogDomain ? 'https://www.playtest.humanizeiq.ai/auth/ai_studio' : '/auth/ai_studio';

            try {
                const fetchOptions: RequestInit = { credentials: 'include' };
                if (isGoogDomain) {
                    const cookieResponse = await fetch('./local_cookie.json');
                    if (cookieResponse.ok) {
                        const cookieData = await cookieResponse.json();
                        if (cookieData?.cookie) {
                            fetchOptions.headers = new Headers();
                            fetchOptions.headers.set('X-API-Studio', cookieData.cookie);
                        } else {
                            setAuthState('unauthorized'); return;
                        }
                    } else {
                        setAuthState('unauthorized'); return;
                    }
                }
                
                const response = await fetch(authUrl, fetchOptions);
                if (response.status === 200) {
                    const result = await response.json();
                    if (result.data?.firstname) {
                        setUser({ 
                            name: `${result.data.firstname} ${result.data.lastname}`,
                            company_name: result.data.company_name,
                            auth_cookie: result.data.auth_cookie_base64,
                            uid: result.data.uid
                        });
                        setAuthState('authorized');
                        const rbacData = await appBuilderService.getMyRbacDetails().catch(() => ({ roles: [], permissions: [] }));
                        setRoles(rbacData.roles);
                        setPermissions(rbacData.permissions);
                    } else {
                        setAuthState('unauthorized');
                    }
                } else {
                    setAuthState('unauthorized');
                }
            } catch (error) {
                setAuthState('unauthorized');
            }
        };
        checkAuth();
    }, []);

    return { authState, user, roles, permissions };
};