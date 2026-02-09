import React from 'react';
import DiagramContainer from './features/diagram/DiagramContainer';

/**
 * App is the root-level entry point. 
 * It delegates to specific feature containers to maintain a clean top-level structure.
 */
const App: React.FC = () => {
    return <DiagramContainer />;
};

export default App;