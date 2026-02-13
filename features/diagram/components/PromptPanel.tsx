import React from 'react';
import { SparklesIcon, PaperAirplaneIcon, XMarkIcon, ListBulletIcon, CommandLineIcon } from '../../../components/icons';
import { CommandLogEntry } from '../DiagramContainer';

interface PromptPanelProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  history: CommandLogEntry[];
}

/**
 * PromptPanel provides a dedicated input section on the left.
 * Features a multi-line text area and a persistent command log for history.
 */
const PromptPanel: React.FC<PromptPanelProps> = ({ prompt, setPrompt, onGenerate, isGenerating, history }) => {
  const handleClear = () => setPrompt('');

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-10">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Diagram Architect</h3>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
          <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
          Engine Ready
        </div>
      </div>
      
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <ListBulletIcon className="w-3 h-3" />
              Architecture Description
            </label>
            {prompt && (
              <button 
                onClick={handleClear}
                className="text-[10px] font-medium text-slate-400 hover:text-red-500 flex items-center gap-0.5 transition-all"
                title="Clear prompt"
              >
                <XMarkIcon className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          
          <div className="relative group">
            <textarea
              id="diagram-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the system flow..."
              className="w-full h-48 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all resize-none text-sm text-slate-700 dark:text-slate-200 leading-relaxed placeholder:text-slate-400 shadow-inner"
            />
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full group relative flex items-center justify-center gap-2 py-3.5 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] overflow-hidden"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>GENERATING...</span>
            </div>
          ) : (
            <>
              <PaperAirplaneIcon className="w-4 h-4 -rotate-45" />
              <span>Generate Diagram</span>
            </>
          )}
        </button>

        {/* Persistent Command Log Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            <CommandLineIcon className="w-3 h-3" />
            Command Log
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {history.length > 0 ? (
              history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setPrompt(entry.text)}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-900/50 hover:bg-white dark:hover:bg-slate-800/40 transition-all group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-500">{entry.timestamp}</span>
                    <span className="text-[9px] text-slate-400 group-hover:text-cyan-500 transition-colors uppercase font-bold tracking-tighter">Restore</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-tight">
                    {entry.text}
                  </p>
                </button>
              ))
            ) : (
              <div className="py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800/50 rounded-2xl">
                <p className="text-[11px] text-slate-400 italic">No history yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 mt-auto bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          LLM: gemini-3-flash-preview
        </div>
      </div>
    </div>
  );
};

export default PromptPanel;