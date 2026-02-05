import React from 'react';
import { DiagramNode } from '../types';

const COLORS: Record<string, string> = {
  PRODUCER: '#3b82f6',
  BROKER: '#a855f7',
  CONSUMER: '#10b981',
  DATABASE: '#f59e0b',
  EXTERNAL_API: '#ec4899',
  CACHE: '#06b6d4',
  TOPIC: '#64748b'
};

interface Props {
  node: DiagramNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const DiagramNodeItem: React.FC<Props> = ({ node, isSelected, onSelect }) => {
  const color = COLORS[node.type] || '#ccc';
  
  return (
    <g 
      transform={`translate(${node.x || 0}, ${node.y || 0})`}
      className="cursor-pointer group"
      onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
    >
      <rect
        x="-60" y="-30" width="120" height="60" rx="8"
        fill="#1e293b"
        stroke={isSelected ? '#fff' : color}
        strokeWidth={isSelected ? 3 : 2}
        className="transition-all duration-200"
      />
      <text
        y="-5" textAnchor="middle"
        className="fill-slate-100 font-bold text-xs pointer-events-none select-none"
      >
        {node.label}
      </text>
      <text
        y="12" textAnchor="middle"
        className="fill-slate-400 text-[10px] pointer-events-none select-none uppercase tracking-wider"
      >
        {node.type}
      </text>
    </g>
  );
};