import React, { useState } from 'react';
import { ClipboardIcon, CheckCircleIcon } from '../../../components/icons';

interface CodeOutputDisplayProps {
    code: string;
}

export const CodeOutputDisplay: React.FC<CodeOutputDisplayProps> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy code: ', err);
            // Optionally, show a toast notification for copy failure
        });
    };

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Code Output</h3>
            <pre className="flex-1 w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 overflow-auto text-sm">
                <code aria-label="Generated code output">
                    {code || '// Generated code will appear here'}
                </code>
            </pre>
            <button
                onClick={handleCopy}
                className={`mt-4 px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors flex items-center justify-center gap-2 ${
                    copied
                        ? 'bg-green-600 text-white focus:ring-green-500'
                        : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
                }`}
                aria-label={copied ? 'Code Copied' : 'Copy Code'}
            >
                {copied ? (
                    <>
                        <CheckCircleIcon className="w-5 h-5" /> Copied!
                    </>
                ) : (
                    <>
                        <ClipboardIcon className="w-5 h-5" /> Copy Code
                    </>
                )}
            </button>
        </div>
    );
};
