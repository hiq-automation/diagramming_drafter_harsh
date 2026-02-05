import React, { useState } from 'react';
import DiagramView from './DiagramView';
import { DiagramData, DiagramNode } from './types';
import { generateDiagram, persistMessage } from './services/diagramAiService';

const DiagramContainer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<DiagramData>({ nodes: [], edges: [] });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    const userMsg = { id: Date.now().toString(), role: 'user' as const, content: prompt, timestamp: Date.now() };
    await persistMessage(userMsg);

    try {
      const result = await generateDiagram(prompt);
      setData(result);
      
      const modelMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'model' as const, 
        content: `Architecture visualization complete for: ${prompt.substring(0, 30)}...`, 
        timestamp: Date.now() 
      };
      await persistMessage(modelMsg);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Architectural synthesis failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadExample = () => {
    setPrompt("A secure distributed messaging system where a Mobile App (Producer) sends encrypted orders to a highly-available RabbitMQ Broker. Orders are consumed by an Inventory Service and a Payment Gateway, both persisting results to a shared PostgreSQL Database.");
  };

  const selectedNode = data.nodes.find(n => n.id === selectedNodeId) || null;

  return (
    <DiagramView
      prompt={prompt}
      setPrompt={setPrompt}
      onGenerate={handleGenerate}
      onLoadExample={handleLoadExample}
      isGenerating={isGenerating}
      data={data}
      selectedNode={selectedNode}
      onSelectNode={setSelectedNodeId}
    />
  );
};

export default DiagramContainer;