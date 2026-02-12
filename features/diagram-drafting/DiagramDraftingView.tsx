
import React, { useState, useRef } from 'react';
import { ChatMessage } from '../../types';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInput } from './components/ChatInput';
import { DiagramCanvas, DiagramCanvasExportAPI } from './components/DiagramCanvas';
import { CodeOutputDisplay } from './components/CodeOutputDisplay';
import { TrashIcon, DownloadIcon, Cog6ToothIcon } from '../../components/icons';

interface DiagramDraftingViewProps {
    chatMessages: ChatMessage[];
    currentMermaidCode: string;
    isLoading: boolean;
    onSendMessage: (message: string) => Promise<void>;
    onClearChat: () => void;
}

/**
 * DiagramDraftingView defines the visual layout of the diagram drafting application.
 * It includes a prompt section and a combined canvas/code output section with size management.
 */
const DiagramDraftingView: React.FC<DiagramDraftingViewProps> = ({ 
    chatMessages, 
    currentMermaidCode, 
    isLoading,
    onSendMessage,
    onClearChat,
}) => {
    const [showDiagram, setShowDiagram] = useState(true);
    const [canvasScale, setCanvasScale] = useState<number>(100);
    const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const diagramCanvasRef = useRef<DiagramCanvasExportAPI>(null);

    const handleExport = (format: 'svg' | 'png') => {
        if (!currentMermaidCode || isLoading) return;
        setIsExportDropdownOpen(false);
        if (diagramCanvasRef.current) {
            if (format === 'svg') {
                diagramCanvasRef.current.exportSVG();
            } else if (format === 'png') {
                diagramCanvasRef.current.exportPNG();
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row h-full w-full overflow-hidden p-4 gap-4">
            {/* Left Section: Interactive Prompt */}
            <section className="flex flex-col w-full md:w-1/4 p-4 rounded-lg shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Prompt</h3>
                    <button
                        onClick={onClearChat}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Clear Chat"
                        title="Clear Chat"
                        disabled={isLoading}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
                <ChatMessageList messages={chatMessages} isLoading={isLoading} />
                <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
            </section>

            {/* Middle Section: Combined Canvas/Code Output */}
            <section className="flex-1 flex flex-col p-4 rounded-lg shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {showDiagram ? 'Diagram Canvas' : 'Code Output'}
                    </h3>
                    <div className="flex items-center gap-2">
                        {showDiagram && (
                            <>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSettingsOpen(prev => !prev)}
                                        className="p-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                        title="Canvas Settings"
                                    >
                                        <Cog6ToothIcon className="w-5 h-5" />
                                    </button>
                                    {isSettingsOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-md shadow-lg p-4 z-40 ring-1 ring-black ring-opacity-5 border border-slate-200 dark:border-slate-700">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-xs font-bold uppercase text-slate-500">Canvas Size</p>
                                                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                                    {canvasScale}%
                                                </span>
                                            </div>
                                            <input 
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={canvasScale}
                                                onChange={(e) => setCanvasScale(parseInt(e.target.value, 10))}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                                                <span>0% (Auto)</span>
                                                <span>100% (Full)</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsExportDropdownOpen(prev => !prev)}
                                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                                        disabled={!currentMermaidCode || isLoading}
                                    >
                                        <DownloadIcon className="w-4 h-4" />
                                        Export
                                    </button>
                                    {isExportDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-30 ring-1 ring-black ring-opacity-5 border border-slate-200 dark:border-slate-700">
                                            <button
                                                onClick={() => handleExport('svg')}
                                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                                            >
                                                Download SVG
                                            </button>
                                            <button
                                                onClick={() => handleExport('png')}
                                                className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                                            >
                                                Download PNG
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <button
                            onClick={() => setShowDiagram(prev => !prev)}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {showDiagram ? 'Show Code' : 'Show Diagram'}
                        </button>
                    </div>
                </div>
                {showDiagram ? (
                    <DiagramCanvas 
                        ref={diagramCanvasRef} 
                        mermaidCode={currentMermaidCode} 
                        canvasScale={canvasScale}
                    />
                ) : (
                    <CodeOutputDisplay code={currentMermaidCode} />
                )}
            </section>
        </div>
    );
};

export default DiagramDraftingView;
