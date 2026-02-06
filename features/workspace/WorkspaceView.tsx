import React from 'react';
import { User } from '../../types';
import DiagrammingContainer from '../diagramming/DiagrammingContainer';

interface WorkspaceViewProps {
    user: User | null;
}

/**
 * WorkspaceView is a 'Dumb' component:
 * - It now renders the Diagramming Drafter feature as the primary content.
 */
const WorkspaceView: React.FC<WorkspaceViewProps> = ({ user }) => {
    return (
        <div className="flex-1 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  Diagramming Drafter
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                  AI-powered design studio for real-time Mermaid.js diagrams.
              </p>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <DiagrammingContainer />
            </div>
        </div>
    );
};

export default WorkspaceView;