import React from 'react';
import { CommandLineIcon, ClipboardIcon } from '../../../components/icons';

interface CodePanelProps {
  code: string;
}

/**
 * CodePanel displays the generated Mermaid source code.
 * Per REQ-4381, this code is read-only and immutable by the user.
 */
const CodePanel: React.FC<CodePanelProps> = ({ code }) => {
  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 dark:bg-black border-l border-slate-200 dark:border-slate-800">
      <div className="p-4 border-b border-slate-700 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <CommandLineIcon className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-sm">Mermaid Source</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border border-slate-700">
            Read Only
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-slate-800 rounded-md text-slate-500 transition-colors group"
          title="Copy to clipboard"
        >
          <ClipboardIcon className="w-4 h-4 group-active:text-emerald-500 transition-colors" />
        </button>
      </div>
      <div className="flex-1 p-4 font-mono text-xs overflow-auto text-emerald-400/90 selection:bg-emerald-500/20">
        {code ? (
          <pre 
            className="whitespace-pre-wrap leading-relaxed select-text cursor-text"
            aria-readonly="true"
          >
            {code}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-600 italic">
            Waiting for generator...
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePanel;