import React from 'react';
import { CommandLineIcon, ClipboardIcon } from '../../../components/icons';

interface CodePanelProps {
    code: string;
    setCode: (v: string) => void;
}

const CodePanel: React.FC<CodePanelProps> = ({ code }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
    };

    return (
        <div className="h-full flex flex-col p-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CommandLineIcon className="w-4 h-4 text-purple-500" />
                    Mermaid Syntax
                </h2>
                <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider transition-all"
                    title="Copy code"
                >
                    <ClipboardIcon className="w-3.5 h-3.5" />
                    Copy
                </button>
            </div>

            <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <textarea
                    value={code}
                    readOnly
                    spellCheck={false}
                    className="relative z-10 h-full w-full p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-green-400 font-mono text-xs leading-relaxed outline-none resize-none cursor-default shadow-2xl"
                />
            </div>
            
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold mb-1 tracking-widest">Read-Only Buffer</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Direct modifications are locked to preserve architectural integrity. Continue prompting the AI Assistant to expand or refine the system components.
                </p>
            </div>
        </div>
    );
};

export default CodePanel;