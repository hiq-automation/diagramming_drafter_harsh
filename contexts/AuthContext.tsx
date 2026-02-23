import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, Permission } from '../types';
import { useAuthSession } from '../hooks/useAuthSession';

interface AuthContextType {
    authState: 'checking' | 'authorized' | 'unauthorized';
    user: User | null;
    roles: Role[];
    permissions: Permission[];
    workspaceUrl: string;
    signOutUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { authState, user, roles, permissions } = useAuthSession();
    const [workspaceUrl, setWorkspaceUrl] = useState('/home/workspace');
    const [signOutUrl, setSignOutUrl] = useState('/home/confirm-signout');

    useEffect(() => {
        const hostname = window.location.hostname;
        if (hostname.startsWith('tools.')) {
            const newHost = hostname.replace('tools.', 'www.');
            const protocol = window.location.protocol;
            setWorkspaceUrl(`${protocol}//${newHost}/home/workspace`);
            setSignOutUrl(`${protocol}//${newHost}/home/confirm-signout`);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ 
            authState, 
            user, 
            roles, 
            permissions, 
            workspaceUrl, 
            signOutUrl 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};