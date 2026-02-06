import React from 'react';
import { DiagramData } from './types';
import { DiagramCanvas } from './components/DiagramCanvas';
import { SparklesIcon, CodeIcon, ClipboardIcon } from '../../components/icons';

interface Props {
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  onLoadExample: () => void;
  isGenerating: boolean;
  data: DiagramData;
  onSelectNode: (id: string | null) => void;
  errorMessage?: string | null;
  historyCount: number;
  onUndo: () => void;
  commandHistory: {prompt: string, timestamp: number}[];
}

const DiagramView: React.FC<Props> = ({ 
  prompt, setPrompt, onGenerate, onLoadExample, isGenerating, data, onSelectNode, errorMessage,
  historyCount, onUndo, commandHistory
}) => {
  return (
    <div className="flex h-full w-full gap-6 p-6 overflow-hidden bg-transparent">
      <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide flex-shrink-0">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Architectural Drafter</h3>
            <button 
              onClick={onLoadExample}
              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold uppercase transition-colors"
            >
              Start Small
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none mb-4"
            placeholder='e.g., "Add a web server"'
          />
          <div className="flex gap-2">
            <button
              onClick={onGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Drawing...
                </span>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  Execute
                </>
              )}
            </button>
            {historyCount > 0 && (
              <button
                onClick={onUndo}
                className="px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-700 text-[10px] uppercase tracking-wider"
              >
                Undo
              </button>
            )}
          </div>
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-600 dark:text-red-400 font-medium">
              {errorMessage}
            </div>
          )}
        </div>

        {commandHistory.length > 0 && (
          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Command History</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {commandHistory.map((cmd, i) => (
                <div key={i} className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30 p-2 rounded-lg border border-slate-100 dark:border-slate-800/50">
                  {cmd.prompt}
                </div>
              )).reverse()}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 flex gap-4 overflow-hidden">
          <div className="flex-[2] relative">
            <DiagramCanvas 
              data={data} 
              onSelectNode={onSelectNode} 
              selectedId={null} 
            />
          </div>
          
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-sm">
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-2 text-slate-500">
                <CodeIcon className="w-3 h-3 text-blue-600 dark:text-blue-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Mermaid Source</span>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(data.mermaidCode)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <ClipboardIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-700 dark:text-blue-400 bg-white dark:bg-slate-950/50">
              <pre className="whitespace-pre-wrap">{data.mermaidCode || '// No components drafted yet'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramView;