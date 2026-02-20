import React, { useCallback } from 'react';
import DiagramView from './DiagramView';
import { useDiagramManager } from './hooks/useDiagramManager';

const DiagramContainer: React.FC = () => {
    const manager = useDiagramManager();

    const handleSelectWithSidebarClose = useCallback((diagram: any, closeSidebar: () => void) => {
        manager.handleSelectDiagram(diagram);
        closeSidebar();
    }, [manager.handleSelectDiagram]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
            <DiagramView
                prompt={manager.prompt}
                setPrompt={manager.setPrompt}
                mermaidCode={manager.mermaidCode}
                setMermaidCode={manager.setMermaidCode}
                onGenerate={manager.handleGenerate}
                onClearHistory={manager.handleClearHistory}
                isGenerating={manager.isGenerating}
                error={manager.error}
                chatMessages={manager.chatMessages}
                diagrams={manager.diagrams}
                isLoadingDiagrams={manager.isLoadingDiagrams}
                onSelectDiagram={handleSelectWithSidebarClose}
                onRefreshDiagrams={manager.fetchDiagrams}
                onDeleteDiagram={manager.handleDeleteDiagram}
                onRenameDiagram={manager.handleRenameDiagram}
                onSaveDiagram={manager.handleSaveDiagram}
                activeFileId={manager.activeFileId}
            />
        </div>
    );
};

export default DiagramContainer;
