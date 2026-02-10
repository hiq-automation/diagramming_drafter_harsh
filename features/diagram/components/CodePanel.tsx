
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
        <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CommandLineIcon className="w-5 h-5 text-purple-500" />
                    Source Code
                </h2>
                <button 
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    title="Copy code"
                >
                    <ClipboardIcon className="w-4 h-4" />
                </button>
            </div>

            <textarea
                value={code}
                readOnly
                spellCheck={false}
                className="flex-1 w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-green-400 font-mono text-xs leading-relaxed outline-none resize-none cursor-default"
            />
            
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">View Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct manual editing is disabled. Use the AI Assistant to refine and update the architecture.
                </p>
            </div>
        </div>
    );
};

export default CodePanel;
