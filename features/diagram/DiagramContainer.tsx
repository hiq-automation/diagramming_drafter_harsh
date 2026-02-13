
import React, { useState, useEffect, useCallback } from 'react';
import DiagramView from './DiagramView';
import { generateResponse } from '../../services/llmService';

export interface CommandLogEntry {
  id: string;
  text: string;
  timestamp: string;
}

interface Edge {
  from: string;
  to: string;
}

const DiagramContainer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagramCode, setDiagramCode] = useState('');
  const [nodes, setNodes] = useState<string[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [history, setHistory] = useState<CommandLogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Complexity Guardrails: Rejects prompts that attempt to create multiple 
   * nodes or complex patterns in one go.
   */
  const isTooComplex = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    // Keywords indicating multiple operations or complex patterns
    const multipleOpsKeywords = [' and ', ' then ', ' also ', ',', ';', ' followed by '];
    const tooManyWords = text.split(/\s+/).length > 15;
    
    return multipleOpsKeywords.some(keyword => lowerText.includes(keyword)) || tooManyWords;
  };

  /**
   * Rebuilds the Mermaid diagram string based on persistent nodes and edges.
   */
  const updateMermaidCode = (currentNodes: string[], currentEdges: Edge[]) => {
    if (currentNodes.length === 0) {
      setDiagramCode(''); // Requirement 4381: Empty canvas initialization
      return;
    }

    const codeLines = ['graph TD'];
    
    // Define nodes with safe IDs and label normalization
    currentNodes.forEach((node, idx) => {
      const safeId = `n${idx}`;
      // Sanitize node name for mermaid compatibility
      const sanitizedName = node.replace(/"/g, "'");
      codeLines.push(`  ${safeId}["${sanitizedName}"]`);
    });

    // Define edges
    currentEdges.forEach((edge) => {
      const fromIdx = currentNodes.indexOf(edge.from);
      const toIdx = currentNodes.indexOf(edge.to);
      if (fromIdx !== -1 && toIdx !== -1) {
        codeLines.push(`  n${fromIdx} --> n${toIdx}`);
      }
    });

    setDiagramCode(codeLines.join('\n'));
  };

  const handleGenerate = useCallback(
    async (textToGenerate: string) => {
      const trimmedText = textToGenerate.trim();
      if (!trimmedText) return;

      // Rule 4 & 5: Complexity check
      if (isTooComplex(trimmedText)) {
        setErrorMessage('I am currently limited to incremental additions. Please add components one by one (e.g., "Add a Load Balancer").');
        return;
      }

      setIsGenerating(true);
      setErrorMessage(null);

      try {
        const systemInstruction = `
          You are a System Architecture Assistant. Your goal is to extract a single component or a single connection from the user's prompt.
          
          Existing components in the diagram: [${nodes.join(', ')}]

          Rules:
          1. If the user wants to add a single component (e.g., "add a queue"), return JSON: {"type": "node", "name": "Message Queue"}.
          2. If the user wants to connect components (e.g., "connect client to gateway"), return JSON: {"type": "connection", "from": "Client", "to": "Gateway"}.
          3. If the user refers to an existing component by a similar name, resolve it to the exact existing name.
          4. Only return valid JSON. No conversational text.
          5. If the request involves multiple steps, return: {"error": "complex"}.
        `;

        const responseText = await generateResponse(
          { provider: 'google', model: 'gemini-3-flash-preview', systemInstruction },
          [{ role: 'user', content: trimmedText }]
        );

        let result;
        try {
          // Robust JSON extraction
          const cleanJson = responseText.substring(
            responseText.indexOf('{'),
            responseText.lastIndexOf('}') + 1
          );
          result = JSON.parse(cleanJson);
        } catch (e) {
          throw new Error("Failed to parse architecture instructions.");
        }

        if (result.error === 'complex') {
          setErrorMessage('Please provide one instruction at a time to maintain architecture clarity.');
          setIsGenerating(false);
          return;
        }

        let updatedNodes = [...nodes];
        let updatedEdges = [...edges];

        if (result.type === 'node') {
          if (!updatedNodes.some(n => n.toLowerCase() === result.name.toLowerCase())) {
            updatedNodes.push(result.name);
          }
        } else if (result.type === 'connection') {
          if (!updatedNodes.some(n => n.toLowerCase() === result.from.toLowerCase())) {
            updatedNodes.push(result.from);
          }
          if (!updatedNodes.some(n => n.toLowerCase() === result.to.toLowerCase())) {
            updatedNodes.push(result.to);
          }
          
          // Re-find normalized names
          const finalFrom = updatedNodes.find(n => n.toLowerCase() === result.from.toLowerCase()) || result.from;
          const finalTo = updatedNodes.find(n => n.toLowerCase() === result.to.toLowerCase()) || result.to;

          const edgeExists = updatedEdges.some(e => 
            e.from.toLowerCase() === finalFrom.toLowerCase() && 
            e.to.toLowerCase() === finalTo.toLowerCase()
          );
          
          if (!edgeExists) {
            updatedEdges.push({ from: finalFrom, to: finalTo });
          }
        }

        setNodes(updatedNodes);
        setEdges(updatedEdges);
        updateMermaidCode(updatedNodes, updatedEdges);

        const newEntry: CommandLogEntry = {
          id: Date.now().toString(),
          text: trimmedText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setHistory(prev => [newEntry, ...prev.slice(0, 9)]);
        setPrompt('');

      } catch (error) {
        console.error('Generation failed:', error);
        setErrorMessage('Failed to synthesize architecture. Try a simpler description.');
      } finally {
        setIsGenerating(false);
      }
    },
    [nodes, edges]
  );

  useEffect(() => {
    updateMermaidCode(nodes, edges);
  }, [nodes, edges]);

  return (
    <DiagramView
      prompt={prompt}
      setPrompt={setPrompt}
      onGenerate={() => handleGenerate(prompt)}
      isGenerating={isGenerating}
      diagramCode={diagramCode}
      nodes={nodes}
      history={history}
      error={errorMessage}
    />
  );
};

export default DiagramContainer;
