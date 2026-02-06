
import React, { useEffect, useRef } from 'react';
import { DiagramData } from '../types';

declare const mermaid: any;

interface Props {
  data: DiagramData;
  onSelectNode: (id: string | null) => void;
  selectedId: string | null;
}

export const DiagramCanvas: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && data.mermaidCode) {
      // Clear previous
      containerRef.current.innerHTML = `<div class="mermaid">${data.mermaidCode}</div>`;
      try {
        if (typeof mermaid !== 'undefined') {
          mermaid.contentLoaded();
        }
      } catch (e) {
        console.error("Mermaid rendering failed", e);
      }
    }
  }, [data.mermaidCode]);

  return (
    <div className="flex-1 bg-slate-900/50 rounded-2xl overflow-auto p-8 border border-slate-800 relative flex items-center justify-center">
      <div ref={containerRef} className="w-full flex justify-center" />
      
      {!data.mermaidCode && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
          <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A2 2 0 013 15.485V5.515a2 2 0 011.553-1.943L9 2l5.447 2.724A2 2 0 0116 6.666v9.967a2 2 0 01-1.553 1.943L9 20z" />
          </svg>
          <p className="text-sm">Start by adding a single component (e.g., "Add a web server")</p>
        </div>
      )}
    </div>
  );
};
