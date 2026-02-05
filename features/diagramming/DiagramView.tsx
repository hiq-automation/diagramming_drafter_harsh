import React from 'react';
import { DiagramData, DiagramNode } from './types';
import { DiagramCanvas } from './components/DiagramCanvas';
import { SparklesIcon } from '../../components/icons';

interface Props {
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  onLoadExample: () => void;
  isGenerating: boolean;
  data: DiagramData;
  selectedNode: DiagramNode | null;
  onSelectNode: (id: string | null) => void;
}

const DiagramView: React.FC<Props> = ({ 
  prompt, setPrompt, onGenerate, onLoadExample, isGenerating, data, selectedNode, onSelectNode 
}) => {
  return (
    <div className="flex h-full w-full gap-6 p-6 overflow-hidden bg-slate-950">
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Architect Prompter</h3>
            <button 
              onClick={onLoadExample}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase transition-colors"
            >
              Load Example
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all resize-none mb-4"
            placeholder="Describe your messaging system flow..."
          />
          <button
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Architecting...
              </span>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                Generate Diagram
              </>
            )}
          </button>
        </div>

        {selectedNode && (
          <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">
                {selectedNode.type}
               </span>
            </div>
            <h5 className="text-lg font-bold text-white mb-2">{selectedNode.label}</h5>
            <p className="text-sm text-slate-400 leading-relaxed">{selectedNode.description || "No specific architectural details provided for this node."}</p>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Producers</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /> Brokers</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Consumers</span>
          </div>
          {data.nodes.length > 0 && (
            <span className="text-[10px] text-slate-600 font-mono uppercase tracking-tighter">System Health: Operational</span>
          )}
        </div>
        <DiagramCanvas 
          data={data} 
          onSelectNode={onSelectNode} 
          selectedId={selectedNode?.id || null} 
        />
      </div>
    </div>
  );
};

export default DiagramView;