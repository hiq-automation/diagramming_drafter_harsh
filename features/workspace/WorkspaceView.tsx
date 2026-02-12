import React from 'react';
import { User } from '../../types';
import StatusGrid from './components/StatusGrid';

interface WorkspaceViewProps {
    user: User | null;
}

/**
 * WorkspaceView is a 'Dumb' component:
 * - It only receives data via props.
 * - It defines the visual layout and style.
 */
const WorkspaceView: React.FC<WorkspaceViewProps> = ({ user }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                Workspace Ready
            </h2>
            
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-8">
                The HumanizeIQ shared framework is initialized. Your authentication context and AI connection layer are fully wired up.
            </p>

            <StatusGrid user={user} />
        </div>
    );
};

export default WorkspaceView;