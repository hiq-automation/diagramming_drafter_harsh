import React, { useEffect, useRef } from 'react';
import { EyeIcon, SparklesIcon, XMarkIcon } from '../../../components/icons';

interface CanvasPanelProps {
  isLoading: boolean;
  diagramCode: string;
  nodes: string[];
  error?: string | null;
}

declare global {
  interface Window {
    mermaid: any;
  }
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ isLoading, diagramCode, nodes, error }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.mermaid && diagramCode && !isLoading) {
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      window.mermaid.initialize({
        startOnLoad: false,
        theme: isDarkMode ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
      });
      
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = '';
        const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        
        try {
           window.mermaid.render(id, diagramCode).then(({ svg }: { svg: string }) => {
            if (mermaidRef.current) {
              mermaidRef.current.innerHTML = svg;
            }
          }).catch((err: any) => {
            console.error("Mermaid Render Error:", err);
          });
        } catch (e) {
          console.error("Mermaid Syntax Error:", e);
        }
      }
    }
  }, [diagramCode, isLoading]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeIcon className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">Live Architecture Canvas</h3>
        </div>
        {nodes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{nodes.length} Entities Detected</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <SparklesIcon className="w-8 h-8 text-cyan-500 animate-pulse" />
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-tight">Synthesizing Blueprint...</p>
          </div>
        ) : error ? (
          <div className="text-center space-y-4 max-w-md animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto border border-red-200 dark:border-red-800 shadow-lg shadow-red-500/10 text-red-500">
              <XMarkIcon className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-800 dark:text-slate-200 font-bold text-lg leading-tight px-4">Complexity Restriction</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm italic px-6">
                {error}
              </p>
            </div>
          </div>
        ) : diagramCode ? (
          <div 
            ref={mermaidRef} 
            className="mermaid-wrapper transition-all duration-500 w-full flex justify-center p-4 bg-white/40 dark:bg-slate-900/40 rounded-3xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 shadow-2xl"
          >
            {/* Mermaid SVG will be rendered here */}
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-slate-200 dark:border-slate-800">
              <EyeIcon className="w-10 h-10 text-slate-300 dark:text-slate-700" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-800 dark:text-slate-200 font-bold text-lg">Empty Workspace</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                Enter a system command on the left panel to begin drafting your architecture.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-center">
        <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Vector Rendering
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            Entity Mapping
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Live Sync
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasPanel;