import React from 'react';
import { User } from '../../types';
import DiagramContainer from '../diagramming/DiagramContainer';

interface WorkspaceViewProps {
    user: User | null;
}

const WorkspaceView: React.FC<WorkspaceViewProps> = ({ user }) => {
    return (
        <div className="flex-1 flex flex-col h-full bg-slate-950">
            <div className="px-8 pt-8 pb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656l-1.172 1.172" />
                  </svg>
                </span>
                Messaging System Architect
              </h2>
              <p className="text-slate-400 text-sm mt-1">Design complex distributed messaging architectures with Gemini AI.</p>
            </div>
            
            <div className="flex-1 overflow-hidden">
                <DiagramContainer />
            </div>
        </div>
    );
};

export default WorkspaceView;