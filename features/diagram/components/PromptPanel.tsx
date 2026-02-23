import React, { useRef, useEffect } from 'react';
import { SparklesIcon, ArrowPathIcon, PaperAirplaneIcon } from '../../../components/icons';
import { ChatMessage } from '../../../types';
import { SUGGESTIONS } from '../constants';

interface PromptPanelProps {
    prompt: string;
    setPrompt: (v: string) => void;
    onGenerate: (overridingPrompt?: string) => void;
    onClearHistory: () => void;
    isGenerating: boolean;
    error: string | null;
    chatMessages: ChatMessage[];
}

const PromptPanel: React.FC<PromptPanelProps> = ({ 
    prompt, 
    setPrompt, 
    onGenerate, 
    onClearHistory,
    isGenerating, 
    error,
    chatMessages
}) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onGenerate();
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-blue-500" />
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white">Draft Assistant</h2>
                </div>
                <button 
                    onClick={onClearHistory}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                    title="Reset Conversation"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatMessages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                        <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-[13px] leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isGenerating && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-4 mb-2 p-2 text-[10px] text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                    {error}
                </div>
            )}

            {/* Quick Actions */}
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => onGenerate(suggestion)}
                        disabled={isGenerating}
                        className="text-[10px] px-2 py-1 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-white dark:bg-slate-900 disabled:opacity-50"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="relative flex items-center gap-2">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask to update diagram..."
                        rows={1}
                        className="flex-1 p-3 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none text-xs resize-none max-h-32 transition-all shadow-inner"
                    />
                    <button
                        onClick={() => onGenerate()}
                        disabled={isGenerating || !prompt.trim()}
                        className={`p-2.5 rounded-xl transition-all ${
                            isGenerating || !prompt.trim()
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-300'
                            : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:scale-110 active:scale-95'
                        }`}
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptPanel;
