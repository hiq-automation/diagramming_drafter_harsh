import React, { useState } from 'react';
import DiagramView from './DiagramView';
import { DiagramData } from './types';
import { generateDiagram, persistMessage } from './services/diagramAiService';

const DiagramContainer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<DiagramData>({ mermaidCode: '' });
  const [history, setHistory] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<{prompt: string, timestamp: number}[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setLastError(null);
    const timestamp = Date.now();
    const userMsg = { id: timestamp.toString(), role: 'user' as const, content: prompt, timestamp };
    
    // Track command history for session logging
    setCommandHistory(prev => [...prev, { prompt, timestamp }]);
    await persistMessage(userMsg);

    try {
      const response = await generateDiagram(prompt, data);
      
      if (response.startsWith("Please add one component")) {
        setLastError(response);
      } else {
        // Clean response from any markdown artifacts if AI hallucinates them
        const cleanResponse = response
          .replace(/```mermaid/g, '')
          .replace(/```/g, '')
          .trim();
        
        // Only update if it looks like a graph
        if (cleanResponse.includes('graph')) {
          if (data.mermaidCode) {
            setHistory(prev => [...prev, data.mermaidCode]);
          }
          setData({ mermaidCode: cleanResponse });
        } else {
          // Fallback mechanism: if the AI only returned a snippet despite instructions
          const fallbackCode = !data.mermaidCode 
            ? `graph TB\n  ${cleanResponse}` 
            : `${data.mermaidCode}\n  ${cleanResponse}`;
          
          if (data.mermaidCode) {
            setHistory(prev => [...prev, data.mermaidCode]);
          }
          setData({ mermaidCode: fallbackCode });
        }
      }
      
      await persistMessage({ 
        id: (Date.now() + 1).toString(), 
        role: 'model' as const, 
        content: response, 
        timestamp: Date.now() 
      });
    } catch (error) {
      console.error("Architectural synthesis failed", error);
      setLastError("Synthesis failed. Please try a simpler component name.");
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setData({ mermaidCode: prev });
      setHistory(prevHistory => prevHistory.slice(0, -1));
    }
  };

  const handleLoadExample = () => {
    setPrompt("Add a Producer named 'Mobile App'");
  };

  return (
    <DiagramView
      prompt={prompt}
      setPrompt={setPrompt}
      onGenerate={handleGenerate}
      onLoadExample={handleLoadExample}
      isGenerating={isGenerating}
      data={data}
      onSelectNode={() => {}}
      errorMessage={lastError}
      historyCount={history.length}
      onUndo={handleUndo}
      commandHistory={commandHistory}
    />
  );
};

export default DiagramContainer;