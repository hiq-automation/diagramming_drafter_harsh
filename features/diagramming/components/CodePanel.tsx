import React from 'react';

interface CodePanelProps {
  mermaidCode: string;
  setMermaidCode: (v: string) => void;
}

const CodePanel: React.FC<CodePanelProps> = ({ mermaidCode, setMermaidCode }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Mermaid Code</h3>
      <textarea
        className="flex-1 w-full p-3 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-green-400 focus:ring-2 focus:ring-green-500 outline-none resize-none transition-all"
        placeholder="Mermaid code..."
        value={mermaidCode}
        onChange={(e) => setMermaidCode(e.target.value)}
      />
      <p className="mt-2 text-[10px] text-slate-400 italic">
        Edit code directly to update the canvas in real-time.
      </p>
    </div>
  );
};

export default CodePanel;