import React from 'react';
import { DiagramData, DiagramNode } from './types';
import { DiagramCanvas } from './components/DiagramCanvas';

interface Props {
  prompt: string;
  setPrompt: (p: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  data: DiagramData;
  selectedNode: DiagramNode | null;
  onSelectNode: (id: string | null) => void;
}

const DiagramView: React.FC<Props> = ({ 
  prompt, setPrompt, onGenerate, isGenerating, data, selectedNode, onSelectNode 
}) => {
  return (
    <div className="flex h-full w-full gap-6 p-6 overflow-hidden">
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Architect Prompter</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all resize-none mb-4"
            placeholder="e.g. A system where orders are published to Kafka, consumed by an inventory service and saved to Postgres."
          />
          <button
            onClick={onGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? "Architecting..." : "Generate Diagram"}
          </button>
        </div>

        {selectedNode && (
          <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 animate-in slide-in-from-left-4">
            <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">{selectedNode.type}</h4>
            <h5 className="text-lg font-bold mb-2">{selectedNode.label}</h5>
            <p className="text-sm text-slate-400 leading-relaxed">{selectedNode.description || "No description provided."}</p>
          </div>
        )}
      </div>

      <DiagramCanvas 
        data={data} 
        onSelectNode={onSelectNode} 
        selectedId={selectedNode?.id || null} 
      />
    </div>
  );
};

export default DiagramView;