import React from 'react';
import { User } from '../../../types';
import { SunIcon, MoonIcon } from '../../../components/icons';

interface HeaderProps {
    user: User | null;
    workspaceUrl: string;
    signOutUrl: string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, workspaceUrl, signOutUrl, theme, toggleTheme }) => {
    return (
        <header className="flex-shrink-0 relative z-20 w-full p-4 px-6 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <img 
                    src="https://www.humanizeiq.ai/home/images/HumanizeIQ_Logo_updated.png" 
                    alt="HumanizeIQ Logo" 
                    className="h-8 sm:h-10 w-auto" 
                />
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 hidden xs:block">Aura Craft Studio</h1>
            </div>
            
            <nav className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                {user && (
                    <>
                        <a href={workspaceUrl} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hidden md:block">My Workspace</a>
                        <span className="bg-slate-900/5 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-md text-slate-900 dark:text-slate-100 max-w-[120px] truncate">
                            {user.name}
                        </span>
                        <a href={signOutUrl} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">Sign out</a>
                    </>
                )}
                <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" 
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>
            </nav>
        </header>
    );
};

export default Header;