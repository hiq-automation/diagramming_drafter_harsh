import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface CanvasSectionProps {
    mermaidCode: string;
    isLoading: boolean;
}

const CanvasSection: React.FC<CanvasSectionProps> = ({ mermaidCode, isLoading }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (mermaidCode && !isLoading && (window as any).mermaid) {
            const renderDiagram = async () => {
                try {
                    const mermaid = (window as any).mermaid;
                    mermaid.initialize({ 
                        startOnLoad: false,
                        theme: theme === 'dark' ? 'dark' : 'default',
                        securityLevel: 'loose',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        flowchart: {
                            useMaxWidth: true,
                            htmlLabels: true,
                            curve: 'basis'
                        }
                    });
                    
                    if (canvasRef.current) {
                        canvasRef.current.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;
                        await mermaid.run({
                            nodes: canvasRef.current.querySelectorAll('.mermaid'),
                        });
                    }
                } catch (err) {
                    console.error("Mermaid Render Error:", err);
                    if (canvasRef.current) {
                        canvasRef.current.innerHTML = `
                            <div class="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs">
                                <p class="font-bold mb-1">Render Error</p>
                                <p>The generated Mermaid code contains syntax errors. Try refining your prompt.</p>
                            </div>`;
                    }
                }
            };
            renderDiagram();
        }
    }, [mermaidCode, isLoading, theme]);

    return (
        <div className="flex-1 flex flex-col p-6 overflow-hidden bg-slate-50 dark:bg-slate-900 relative">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            Architecture Workspace
                        </h2>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">Canvas V1.0</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            Design Mode
                         </span>
                    </div>
                </div>

                <div className="flex-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 flex items-center justify-center min-h-0 relative overflow-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-5 transition-all">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-500/10 rounded-full"></div>
                                <div className="absolute top-0 w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-bold tracking-tight animate-pulse">Constructing System Nodes...</p>
                        </div>
                    )}
                    
                    {!mermaidCode && !isLoading && (
                        <div className="text-slate-400 dark:text-slate-500 text-center max-w-sm animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                </svg>
                            </div>
                            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-2">Ready for Instruction</h3>
                            <p className="text-xs leading-relaxed opacity-60">Input a system description in the sidebar to visualize the architecture in real-time.</p>
                        </div>
                    )}

                    <div ref={canvasRef} className="w-full h-full flex items-center justify-center transition-all duration-700 ease-out" />
                </div>
            </div>
        </div>
    );
};

export default CanvasSection;