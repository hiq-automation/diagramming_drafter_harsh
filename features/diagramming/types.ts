export type SystemNodeType = 'PRODUCER' | 'BROKER' | 'CONSUMER' | 'DATABASE' | 'EXTERNAL_API' | 'CACHE' | 'TOPIC';

export interface DiagramNode {
  id: string;
  type: SystemNodeType;
  label: string;
  description?: string;
  x?: number;
  y?: number;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface DiagramData {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  title?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
