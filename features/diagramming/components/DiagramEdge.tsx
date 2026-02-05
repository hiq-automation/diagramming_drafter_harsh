import React from 'react';
import { DiagramNode, DiagramEdge } from '../types';

interface Props {
  edge: DiagramEdge;
  source: DiagramNode;
  target: DiagramNode;
}

export const DiagramEdgeItem: React.FC<Props> = ({ edge, source, target }) => {
  const sx = source.x || 0;
  const sy = source.y || 0;
  const tx = target.x || 0;
  const ty = target.y || 0;

  const path = `M ${sx} ${sy} L ${tx} ${ty}`;

  return (
    <g className="pointer-events-none">
      <path
        d={path}
        stroke="#475569"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
      />
      <circle r="3" fill="#3b82f6">
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={path}
        />
      </circle>
      {edge.label && (
        <text
          x={(sx + tx) / 2}
          y={(sy + ty) / 2 - 10}
          textAnchor="middle"
          className="fill-slate-500 text-[9px] font-medium"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
};