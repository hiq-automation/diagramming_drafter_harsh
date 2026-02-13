import React from 'react';
import { User } from '../../types';
import DiagramContainer from '../diagram/DiagramContainer';

interface WorkspaceViewProps {
    user: User | null;
}

/**
 * WorkspaceView is updated to host the Diagramming tool layout.
 */
const WorkspaceView: React.FC<WorkspaceViewProps> = ({ user }) => {
    return (
        <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700">
            <div className="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    System Architecture Drafter
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Draft, visualize, and generate technical specifications for messaging systems.
                </p>
            </div>
            
            <DiagramContainer />
        </div>
    );
};

export default WorkspaceView;