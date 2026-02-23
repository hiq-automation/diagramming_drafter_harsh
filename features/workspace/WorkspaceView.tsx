import React from 'react';
import { User } from '../../types';
import DiagramContainer from '../diagram/DiagramContainer';

interface WorkspaceViewProps {
    user: User | null;
}

/**
 * WorkspaceView is the main view area of the application.
 * It now mounts the Diagram Drafting feature.
 */
const WorkspaceView: React.FC<WorkspaceViewProps> = ({ user }) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
            <DiagramContainer />
        </div>
    );
};

export default WorkspaceView;