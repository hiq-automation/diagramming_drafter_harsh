
import React from 'react';
import PromptPanel from './components/PromptPanel';
import CanvasPanel from './components/CanvasPanel';
import CodePanel from './components/CodePanel';

interface ChatLog {
  role: 'user' | 'ai';
  text: string;
}

interface DiagrammingViewProps {
  prompt: string;
  setPrompt: (v: string) => void;
  mermaidCode: string;
  setMermaidCode: (v: string) => void;
  chatLogs: ChatLog[];
  isLoading: boolean;
  onGenerate: () => void;
}

const DiagrammingView: React.FC<DiagrammingViewProps> = ({
  prompt,
  setPrompt,
  mermaidCode,
  setMermaidCode,
  chatLogs,
  isLoading,
  onGenerate,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden p-4 gap-4">
        {/* Left: Prompt Area & Logs */}
        <div className="w-full md:w-1/4 h-full">
          <PromptPanel 
            prompt={prompt} 
            setPrompt={setPrompt} 
            chatLogs={chatLogs}
            isLoading={isLoading} 
            onGenerate={onGenerate} 
          />
        </div>

        {/* Middle: Canvas Area */}
        <div className="w-full md:w-2/4 h-full">
          <CanvasPanel mermaidCode={mermaidCode} />
        </div>

        {/* Right: Mermaid Code Area */}
        <div className="w-full md:w-1/4 h-full">
          <CodePanel 
            mermaidCode={mermaidCode} 
            setMermaidCode={setMermaidCode} 
          />
        </div>
      </div>
    </div>
  );
};

export default DiagrammingView;
