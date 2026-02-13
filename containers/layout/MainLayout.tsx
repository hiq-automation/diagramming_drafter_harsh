import React from 'react';
import { User } from '../../types';
import Header from './components/Header';
import Footer from './components/Footer';

interface MainLayoutProps {
    user: User | null;
    workspaceUrl: string;
    signOutUrl: string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    version: string | null;
    children?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
    user, 
    workspaceUrl, 
    signOutUrl, 
    theme, 
    toggleTheme, 
    version, 
    children 
}) => {
    return (
        <div className="relative h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-hidden text-sm sm:text-base">
            <Header 
                user={user} 
                workspaceUrl={workspaceUrl} 
                signOutUrl={signOutUrl} 
                theme={theme} 
                toggleTheme={toggleTheme} 
            />

            <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
            
            <Footer version={version} />
        </div>
    );
};

export default MainLayout;