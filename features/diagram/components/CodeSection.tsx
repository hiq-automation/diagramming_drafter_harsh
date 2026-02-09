
import React, { useState } from 'react';
import { CommandLineIcon, ClipboardIcon, CheckCircleIcon } from '../../../components/icons';

interface CodeSectionProps {
    code: string;
}

const CodeSection: React.FC<CodeSectionProps> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Simple pseudo-syntax highlighting for Mermaid
    const renderHighlightedCode = (text: string) => {
        if (!text) return null;
        
        return text.split('\n').map((line, i) => {
            // Highlight reserved words and symbols
            const highlightedLine = line
                .replace(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|journey|C4Context|mindmap|timeline)/g, '<span class="text-pink-400 font-bold">$1</span>')
                .replace(/\b(TD|LR|BT|RL)\b/g, '<span class="text-orange-400">$1</span>')
                .replace(/(-->|---|==>|-.->)/g, '<span class="text-cyan-400 font-bold">$1</span>')
                .replace(/\[(.*?)\]/g, '[<span class="text-green-300">$1</span>]')
                .replace(/\((.*?)\)/g, '(<span class="text-yellow-200">$1</span>)')
                .replace(/\{(.*?)\}/g, '{<span class="text-purple-300">$1</span>}')
                .replace(/:/g, '<span class="text-slate-500">:</span>');

            return (
                <div key={i} className="flex group/line">
                    <span className="w-8 flex-shrink-0 text-slate-700 group-hover/line:text-slate-500 select-none text-right pr-4 border-r border-slate-800/50 mr-4 transition-colors">
                        {i + 1}
                    </span>
                    <span className="whitespace-pre" dangerouslySetInnerHTML={{ __html: highlightedLine }} />
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-slate-950">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800/80 rounded-xl border border-slate-700/50 shadow-inner">
                        <CommandLineIcon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-100 uppercase text-[10px] tracking-[0.2em]">Syntax Source</h3>
                        <p className="text-[9px] text-slate-500 font-medium tracking-tight">Mermaid Engine v11.4</p>
                    </div>
                </div>
                
                <button 
                    onClick={copyToClipboard}
                    disabled={!code}
                    title="Copy source code"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold transition-all duration-300 border ${
                        copied 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400 scale-95 shadow-lg shadow-green-500/10' 
                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 active:scale-95'
                    } disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
                >
                    {copied ? (
                        <>
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            <span className="tracking-widest">COPIED</span>
                        </>
                    ) : (
                        <>
                            <ClipboardIcon className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                            <span className="tracking-widest">COPY CODE</span>
                        </>
                    )}
                </button>
            </div>
            
            {/* Code Body */}
            <div className="flex-1 overflow-auto p-6 font-mono text-[11px] leading-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {code ? (
                    <div className="text-slate-300 selection:bg-blue-500/30 selection:text-white">
                        {renderHighlightedCode(code)}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-4 animate-pulse">
                        <CommandLineIcon className="w-10 h-10 opacity-10" />
                        <p className="italic text-xs tracking-widest uppercase opacity-40">Ready for generation...</p>
                    </div>
                )}
            </div>

            {/* Footer Metadata */}
            <div className="flex-shrink-0 p-4 bg-slate-900/60 border-t border-slate-800/80 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">Compiler</span>
                            <span className="text-[10px] text-slate-400 font-bold">Standard-v1.0</span>
                        </div>
                        <div className="w-[1px] h-6 bg-slate-800"></div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-slate-600 uppercase font-black tracking-tighter">Connection</span>
                            <span className={`text-[10px] font-bold flex items-center gap-1.5 ${code ? 'text-green-500' : 'text-slate-600'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${code ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
                                {code ? 'Stream Active' : 'Idle'}
                            </span>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <span className="text-[9px] font-black text-blue-500/80 uppercase tracking-[0.2em]">Source View</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeSection;
