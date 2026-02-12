import React from 'react';
import DiagramDraftingContainer from './features/diagram-drafting/DiagramDraftingContainer';
import { DashboardContainer } from './containers/DashboardContainer';

/**
 * App is the root-level entry point. 
 * It delegates to specific feature containers to maintain a clean top-level structure.
 */
const App: React.FC = () => {
    // Render the DiagramDraftingContainer by default as the main application interface,
    // as per the user's request to "Create the diagram of a messaging system".
    return <DiagramDraftingContainer />;
};

export default App;