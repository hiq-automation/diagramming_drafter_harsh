import React, { useEffect, useRef } from 'react';

interface CanvasPanelProps {
    code: string;
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ code }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!containerRef.current || !(window as any).mermaid) return;

            const mermaid = (window as any).mermaid;
            const id = `mermaid-svg-${Math.round(Math.random() * 1000000)}`;
            
            try {
                // Clear and render fresh
                containerRef.current.innerHTML = '<div class="flex items-center justify-center p-8 text-slate-400">Rendering...</div>';
                
                // If the version is modern, use mermaid.run or mermaid.render
                if (typeof mermaid.render === 'function') {
                    const { svg } = await mermaid.render(id, code);
                    containerRef.current.innerHTML = svg;
                } else {
                    // Fallback for older script inclusion
                    containerRef.current.innerHTML = `<div class="mermaid">${code}</div>`;
                    mermaid.contentLoaded();
                }
            } catch (e) {
                console.error('Mermaid render error:', e);
                containerRef.current.innerHTML = `
                    <div class="max-w-md p-6 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            Syntax Warning
                        </div>
                        <p class="text-xs text-red-500/80 dark:text-red-400/80 leading-relaxed">
                            The current diagram code has structural errors. The AI is still refining the system architecture. Try asking for a "Flowchart TD" or check the code panel for manual fixes.
                        </p>
                    </div>
                `;
            }
        };

        renderDiagram();
    }, [code]);

    return (
        <div 
            ref={containerRef} 
            className="w-full flex items-center justify-center transition-all duration-500 ease-in-out"
        />
    );
};

export default CanvasPanel;