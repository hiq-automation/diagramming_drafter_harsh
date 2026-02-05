import React, { useRef, useEffect, useState } from 'react';
import { DiagramData } from '../types';
import { DiagramNodeItem } from './DiagramNode';
import { DiagramEdgeItem } from './DiagramEdge';

interface Props {
  data: DiagramData;
  onSelectNode: (id: string | null) => void;
  selectedId: string | null;
}

export const DiagramCanvas: React.FC<Props> = ({ data, onSelectNode, selectedId }) => {
  return (
    <div className="flex-1 bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 relative">
      <svg className="w-full h-full" onClick={() => onSelectNode(null)}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="65" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
          </marker>
        </defs>
        
        {data.edges.map(edge => {
          const s = data.nodes.find(n => n.id === edge.source);
          const t = data.nodes.find(n => n.id === edge.target);
          if (!s || !t) return null;
          return <DiagramEdgeItem key={edge.id} edge={edge} source={s} target={t} />;
        })}

        {data.nodes.map(node => (
          <DiagramNodeItem 
            key={node.id} 
            node={node} 
            isSelected={selectedId === node.id}
            onSelect={onSelectNode}
          />
        ))}
      </svg>
      
      {!data.nodes.length && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
          <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A2 2 0 013 15.485V5.515a2 2 0 011.553-1.943L9 2l5.447 2.724A2 2 0 0116 6.666v9.967a2 2 0 01-1.553 1.943L9 20z" />
          </svg>
          <p className="text-sm">Describe a messaging system to begin visualization</p>
        </div>
      )}
    </div>
  );
};