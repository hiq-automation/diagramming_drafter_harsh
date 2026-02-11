import React from 'react';
import { PaperAirplaneIcon, CommandLineIcon, SparklesIcon, CodeIcon, XMarkIcon, ListBulletIcon, ChevronRightIcon, ChatBubbleLeftIcon } from '../../components/icons';
import MermaidRenderer from './components/MermaidRenderer';

interface DiagrammingViewProps {
    prompt: string;
    setPrompt: (val: string) => void;
    diagramCode: string;
    explanation: string;
    history: string[];
    isGenerating: boolean;
    onGenerate: () => void;
    onSelectHistory: (val: string) => void;
}

const DiagrammingView: React.FC<DiagrammingViewProps> = ({
    prompt,
    setPrompt,
    diagramCode,
    explanation,
    history,
    isGenerating,
    onGenerate,
    onSelectHistory
}) => {
    const handleClear = () => setPrompt('');

    return (
        <div className="flex flex-1 w-full h-full overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
            {/* Section 1: Command Panel (Left) */}
            <aside className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 bg-slate-50/50 dark:bg-slate-900/50 shadow-sm z-10">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <SparklesIcon className="w-5 h-5 text-blue-500 animate-pulse" />
                        <h2 className="font-bold text-xs uppercase tracking-widest">Architect Prompt</h2>
                    </div>
                    {prompt && (
                        <button 
                            onClick={handleClear}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-all active:scale-95"
                            title="Clear command"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                <div className="flex flex-col gap-4 overflow-hidden h-full">
                    <div className="flex-[2] flex flex-col relative group">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your system architecture..."
                            className="flex-1 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all shadow-inner leading-relaxed text-slate-700 dark:text-slate-300"
                        />
                    </div>
                    
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className="flex items-center justify-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-[0.97]"
                    >
                        {isGenerating ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <PaperAirplaneIcon className="w-4 h-4" />
                        )}
                        {isGenerating ? 'Building...' : 'Execute Command'}
                    </button>

                    <div className="flex-1 flex flex-col mt-2 overflow-hidden border-t border-slate-200 dark:border-slate-800 pt-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
                            <ListBulletIcon className="w-4 h-4" />
                            <h3 className="text-[10px] font-bold uppercase tracking-wider">Previous Commands</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {history.length > 0 ? (
                                history.map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => onSelectHistory(item)}
                                        className="w-full text-left p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all group flex items-start gap-2 shadow-sm"
                                    >
                                        <ChevronRightIcon className="w-3 h-3 text-slate-300 mt-1" />
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-snug">
                                            {item}
                                        </p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-[10px] text-slate-400 italic text-center py-4">History empty</p>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Section 2: Visual Canvas (Middle) */}
            <main className="flex-1 flex flex-col p-6 overflow-hidden relative">
                <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">
                    <CommandLineIcon className="w-5 h-5 text-indigo-500" />
                    <h2 className="font-bold text-sm uppercase tracking-wider">Canvas Workspace</h2>
                </div>
                
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {explanation && !isGenerating && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                            <ChatBubbleLeftIcon className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                {explanation}
                            </p>
                        </div>
                    )}

                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700/50 flex items-center justify-center overflow-auto p-4 relative">
                        {isGenerating ? (
                            <div className="flex flex-col items-center gap-4 animate-pulse">
                                <SparklesIcon className="w-12 h-12 text-blue-400" />
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Synthesizing Architecture...</p>
                            </div>
                        ) : diagramCode ? (
                            <MermaidRenderer chart={diagramCode} />
                        ) : (
                            <div className="text-center text-slate-300 dark:text-slate-600 flex flex-col items-center">
                                <SparklesIcon className="w-20 h-20 mb-6 opacity-10 animate-pulse" />
                                <p className="font-black text-2xl mb-1 opacity-20 uppercase tracking-tighter">Ready for Architecture</p>
                                <p className="text-xs opacity-30 italic">Input a command to see the design come to life</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Section 3: Code Output (Right) */}
            <aside className="w-96 border-l border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                        <CodeIcon className="w-5 h-5 text-emerald-500" />
                        <h2 className="font-bold text-sm uppercase tracking-wider">Mermaid Protocol</h2>
                    </div>
                </div>
                <div className="flex-1 p-5 overflow-hidden">
                    <div className="h-full bg-slate-950 rounded-2xl overflow-auto p-6 font-mono text-[11px] leading-relaxed text-emerald-400 border border-slate-800/50 shadow-2xl">
                        {diagramCode ? (
                            <pre className="whitespace-pre-wrap selection:bg-emerald-500/20">{diagramCode}</pre>
                        ) : (
                            <div className="flex flex-col gap-4 opacity-10">
                                <div className="w-full h-2 bg-emerald-900 rounded-full" />
                                <div className="w-4/5 h-2 bg-emerald-900 rounded-full" />
                                <div className="w-2/3 h-2 bg-emerald-900 rounded-full" />
                                <div className="w-full h-2 bg-emerald-900 rounded-full mt-4" />
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default DiagrammingView;