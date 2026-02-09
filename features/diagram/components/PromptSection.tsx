
import React from 'react';
import { SparklesIcon, ListBulletIcon, ChatBubbleLeftIcon, CommandLineIcon, XMarkIcon } from '../../../components/icons';

interface PromptSectionProps {
    prompt: string;
    setPrompt: (val: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    history: string[];
    error: string | null;
}

const PromptSection: React.FC<PromptSectionProps> = ({ prompt, setPrompt, onGenerate, isLoading, history, error }) => {
    return (
        <div className="p-6 space-y-6 flex flex-col min-h-full bg-slate-50 dark:bg-slate-900/50">
            {/* AI Architect Header */}
            <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                    <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[10px] tracking-[0.2em]">Architectural AI</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Incremental Designer</p>
                </div>
            </div>
            
            {/* Prompt Input Section */}
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2 group">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Command Input</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="For eg :  Create a web server"
                        className={`w-full min-h-[140px] p-4 text-sm rounded-2xl border ${error ? 'border-red-500 dark:border-red-500 ring-4 ring-red-500/10' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 focus:ring-4 ${error ? 'focus:ring-red-500/10' : 'focus:ring-blue-500/10'} outline-none transition-all resize-none text-slate-700 dark:text-slate-200 shadow-sm leading-relaxed placeholder:text-slate-400`}
                    />
                    
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-2">
                                <XMarkIcon className="w-3.5 h-3.5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-red-700 dark:text-red-300 leading-relaxed font-medium">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center justify-center gap-3 active:scale-[0.97]"
                >
                    {isLoading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>Validating...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-4 h-4" />
                            <span>Build Component</span>
                        </>
                    )}
                </button>
            </div>

            {/* Command Log / History */}
            <div className="flex-1 flex flex-col min-h-[150px]">
                <div className="flex items-center gap-2 mb-3">
                    <CommandLineIcon className="w-4 h-4 text-slate-400" />
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">History</h4>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 max-h-[250px] pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {history.length > 0 ? (
                        history.map((h, i) => (
                            <button 
                                key={i}
                                onClick={() => setPrompt(h)}
                                className="w-full text-left p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group"
                            >
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {h}
                                </p>
                            </button>
                        ))
                    ) : (
                        <div className="h-16 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            <p className="text-[10px] text-slate-400 font-medium italic">Ready for input</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Constraints Info */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                    <ListBulletIcon className="w-4 h-4 text-slate-400" />
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Guidelines</h4>
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                        • Build systems incrementally.<br/>
                        • Use specific commands like "Add a box" or "Connect A to B".<br/>
                        • Complex end-to-end designs are restricted.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PromptSection;
