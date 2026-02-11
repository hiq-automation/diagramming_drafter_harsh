
import React from 'react';
import { User } from '../../types';
import DiagrammingContainer from '../diagramming/DiagrammingContainer';

interface WorkspaceViewProps {
    user: User | null;
}

/**
 * WorkspaceView now hosts the three-pane diagramming tool.
 */
const WorkspaceView: React.FC<WorkspaceViewProps> = ({ user }) => {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <DiagrammingContainer />
        </div>
    );
};

export default WorkspaceView;
