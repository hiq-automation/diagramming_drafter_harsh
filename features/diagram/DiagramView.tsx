import React, { useState } from 'react';
import PromptPanel from './components/PromptPanel';
import CanvasPanel from './components/CanvasPanel';
import CodePanel from './components/CodePanel';
import { ChatMessage } from '../../types';

interface DiagramViewProps {
    prompt: string;
    setPrompt: (val: string) => void;
    mermaidCode: string;
    setMermaidCode: (val: string) => void;
    onGenerate: (overridingPrompt?: string) => void;
    onClearHistory: () => void;
    isGenerating: boolean;
    error: string | null;
    chatMessages: ChatMessage[];
}

const DiagramView: React.FC<DiagramViewProps> = ({
    prompt,
    setPrompt,
    mermaidCode,
    setMermaidCode,
    onGenerate,
    onClearHistory,
    isGenerating,
    error,
    chatMessages
}) => {
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.2));
    const handleZoomReset = () => setZoom(1);

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900 overflow-hidden text-sm">
            {/* Left Section: Chat Prompt */}
            <div className="w-96 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 flex flex-col">
                <PromptPanel 
                    prompt={prompt} 
                    setPrompt={setPrompt} 
                    onGenerate={onGenerate} 
                    onClearHistory={onClearHistory}
                    isGenerating={isGenerating} 
                    error={error}
                    chatMessages={chatMessages}
                />
            </div>

            {/* Middle Section: Canvas */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-6">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">System Diagram Canvas</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <button 
                                onClick={handleZoomOut} 
                                className="px-2 py-0.5 hover:text-blue-500 text-slate-500 dark:text-slate-400 font-bold transition-colors"
                                title="Zoom Out"
                            >
                                −
                            </button>
                            <span className="text-[10px] w-12 text-center font-mono text-slate-600 dark:text-slate-300">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button 
                                onClick={handleZoomIn} 
                                className="px-2 py-0.5 hover:text-blue-500 text-slate-500 dark:text-slate-400 font-bold transition-colors"
                                title="Zoom In"
                            >
                                +
                            </button>
                            <button 
                                onClick={handleZoomReset} 
                                className="px-2 py-0.5 border-l border-slate-200 dark:border-slate-700 hover:text-red-500 text-slate-400 dark:text-slate-500 transition-colors"
                                title="Reset Zoom"
                            >
                                ⟲
                            </button>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-800 px-2 py-1 rounded">Live Draft</div>
                    </div>
                </div>
                
                {/* Visual Canvas with Grid Background */}
                <div className="flex-1 overflow-auto relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
                    <div className="min-w-full min-h-full p-12 flex items-center justify-center">
                        <div 
                            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                            className="transition-transform duration-200 ease-out"
                        >
                            <CanvasPanel code={mermaidCode} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Code Output */}
            <div className="w-80 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl flex flex-col">
                <CodePanel code={mermaidCode} setCode={setMermaidCode} />
            </div>
        </div>
    );
};

export default DiagramView;