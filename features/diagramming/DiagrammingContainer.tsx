
import React, { useState } from 'react';
import DiagrammingView from './DiagrammingView';
import { GoogleGenAI } from "@google/genai";

interface ChatLog {
  role: 'user' | 'ai';
  text: string;
}

const DiagrammingContainer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [mermaidCode, setMermaidCode] = useState('graph TD');
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateDiagram = async () => {
    if (!prompt.trim()) return;
    
    const userMsg = prompt.trim();
    setChatLogs(prev => [...prev, { role: 'user', text: userMsg }]);
    setPrompt('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const systemInstruction = `You are a Mermaid.js diagram expert. 
      CRITICAL RULE: You only process small, incremental tasks (one or two boxes/connections). 
      If the user's request is a large design (e.g., "design a messaging system", "build a full architecture"), 
      you MUST respond EXACTLY with this string and nothing else: 
      "I am designed to draft small tasks one or two at a time so please enter small inputs like 'Add a web server'."
      Otherwise, return ONLY the updated full Mermaid.js code that incorporates the new request into the existing diagram. 
      No markdown, no backticks, no text. Just the Mermaid code.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Current Mermaid Code:\n${mermaidCode}\n\nNew instruction: ${userMsg}`,
        config: { systemInstruction }
      });
      
      const resultText = response.text?.trim() || '';
      
      if (resultText.includes("I am designed to draft small tasks")) {
        setChatLogs(prev => [...prev, { role: 'ai', text: resultText }]);
      } else {
        const cleanedCode = resultText.replace(/```mermaid\n?|```/g, '').trim();
        if (cleanedCode.startsWith('graph') || cleanedCode.startsWith('sequenceDiagram') || cleanedCode.startsWith('classDiagram')) {
          setMermaidCode(cleanedCode);
          setChatLogs(prev => [...prev, { role: 'ai', text: `Successfully processed: "${userMsg}"` }]);
        } else {
           setChatLogs(prev => [...prev, { role: 'ai', text: "Error: Could not parse diagram update." }]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setChatLogs(prev => [...prev, { role: 'ai', text: "Service error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DiagrammingView
      prompt={prompt}
      setPrompt={setPrompt}
      mermaidCode={mermaidCode}
      setMermaidCode={setMermaidCode}
      chatLogs={chatLogs}
      isLoading={isLoading}
      onGenerate={generateDiagram}
    />
  );
};

export default DiagrammingContainer;
