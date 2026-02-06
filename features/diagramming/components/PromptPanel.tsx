
import React, { useEffect, useRef } from 'react';
import { SparklesIcon } from '../../../components/icons';

interface ChatLog {
  role: 'user' | 'ai';
  text: string;
}

interface PromptPanelProps {
  prompt: string;
  setPrompt: (v: string) => void;
  chatLogs: ChatLog[];
  isLoading: boolean;
  onGenerate: () => void;
}

const PromptPanel: React.FC<PromptPanelProps> = ({ prompt, setPrompt, chatLogs, isLoading, onGenerate }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Prompt & Logs</h3>
      
      {/* Chat Log Area */}
      <div className="flex-1 overflow-y-auto mb-4 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
        {chatLogs.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-10">
            Start by adding components. Try "Add a web server".
          </p>
        )}
        {chatLogs.map((log, i) => (
          <div key={i} className={`flex flex-col ${log.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] px-3 py-2 rounded-2xl text-xs ${
              log.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
            }`}>
              {log.text}
            </div>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea
          className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all pr-12"
          placeholder="Add a box or connection..."
          rows={2}
          value={prompt}
          onKeyDown={handleKeyPress}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={onGenerate}
          disabled={isLoading || !prompt.trim()}
          className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors shadow-lg"
          aria-label="Send prompt"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
          ) : (
            <SparklesIcon className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="mt-2 text-[10px] text-slate-400 text-center">
        Draft small tasks one at a time.
      </p>
    </div>
  );
};

export default PromptPanel;
