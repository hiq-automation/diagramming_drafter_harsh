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
                {children || (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Framework Ready</h2>
                        <p className="text-slate-500 max-w-md">The skeleton is successfully initialized.</p>
                    </div>
                )}
            </main>
            
            <Footer version={version} />
        </div>
    );
};

export default MainLayout;