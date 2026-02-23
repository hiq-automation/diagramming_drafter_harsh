import React from 'react';
import WorkspaceContainer from './features/workspace/WorkspaceContainer';

/**
 * App is the root-level entry point. 
 * It delegates to specific feature containers to maintain a clean top-level structure.
 */
const App: React.FC = () => {
    return <WorkspaceContainer />;
};

export default App;