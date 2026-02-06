import React, { useEffect, useRef } from 'react';

interface CanvasPanelProps {
  mermaidCode: string;
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ mermaidCode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !mermaidCode) return;
      
      try {
        // @ts-ignore
        if (window.mermaid) {
          // @ts-ignore
          window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
          containerRef.current.innerHTML = `<div class="mermaid">${mermaidCode}</div>`;
          // @ts-ignore
          await window.mermaid.run();
        }
      } catch (e) {
        console.error('Mermaid render error:', e);
        containerRef.current.innerHTML = `<div class="p-4 text-red-500 text-sm font-mono whitespace-pre-wrap">Mermaid Render Error: ${e}</div>`;
      }
    };

    renderDiagram();
  }, [mermaidCode]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 overflow-hidden">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Canvas Area</h3>
      <div 
        ref={containerRef} 
        className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center p-4 border border-slate-200 dark:border-slate-700"
      />
    </div>
  );
};

export default CanvasPanel;