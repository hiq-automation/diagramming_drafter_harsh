import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { User } from '../types';
import MainLayout from './layout/MainLayout';

interface MainContainerProps {
    user: User | null;
    workspaceUrl: string;
    signOutUrl: string;
    children?: React.ReactNode;
}

/**
 * MainContainer handles layout logic:
 * - Theme state access
 * - App version fetching
 */
const MainContainer: React.FC<MainContainerProps> = (props) => {
    const { theme, toggleTheme } = useTheme();
    const [version, setVersion] = useState<string | null>(null);

    useEffect(() => {
        fetch('./version.json')
            .then(response => {
                if (response.ok) return response.json();
                return null;
            })
            .then(data => {
                if (data && data.version) setVersion(data.version);
            })
            .catch(() => {});
    }, []);
    
    return (
        <MainLayout 
            {...props} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            version={version} 
        />
    );
};

export default MainContainer;