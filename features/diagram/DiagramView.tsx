import React, { useState } from 'react';
import PromptPanel from './components/PromptPanel';
import CanvasPanel from './components/CanvasPanel';
import CodePanel from './components/CodePanel';
import { CommandLogEntry } from './DiagramContainer';
import { ChevronLeftIcon, ChevronRightIcon } from '../../components/icons';

interface DiagramViewProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  diagramCode: string;
  nodes: string[];
  history: CommandLogEntry[];
  error?: string | null;
}

const DiagramView: React.FC<DiagramViewProps> = (props) => {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex-1 flex w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Left Panel (Input) */}
      <div className={`relative flex transition-all duration-300 ease-in-out ${leftOpen ? 'w-1/4 min-w-[300px]' : 'w-12 overflow-hidden'}`}>
        <div className="flex-1 h-full">
          <PromptPanel
            prompt={props.prompt}
            setPrompt={props.setPrompt}
            onGenerate={props.onGenerate}
            isGenerating={props.isGenerating}
            history={props.history}
          />
        </div>
        <button 
          onClick={() => setLeftOpen(!leftOpen)}
          className="absolute top-1/2 -right-3 z-30 flex items-center justify-center w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md text-slate-500 hover:text-cyan-500 transition-all transform -translate-y-1/2"
          aria-label={leftOpen ? "Collapse Prompt" : "Expand Prompt"}
        >
          {leftOpen ? <ChevronLeftIcon className="w-3.5 h-3.5" /> : <ChevronRightIcon className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Center Panel (Visualization) */}
      <div className="flex-1 h-full transition-all duration-300 border-x border-slate-200 dark:border-slate-800 shadow-inner">
        <CanvasPanel
          isLoading={props.isGenerating}
          diagramCode={props.diagramCode}
          nodes={props.nodes}
          error={props.error}
        />
      </div>

      {/* Right Panel (Technical) */}
      <div className={`relative flex transition-all duration-300 ease-in-out ${rightOpen ? 'w-1/4 min-w-[300px]' : 'w-12 overflow-hidden'}`}>
        <button 
          onClick={() => setRightOpen(!rightOpen)}
          className="absolute top-1/2 -left-3 z-30 flex items-center justify-center w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md text-slate-500 hover:text-cyan-500 transition-all transform -translate-y-1/2"
          aria-label={rightOpen ? "Collapse Code" : "Expand Code"}
        >
          {rightOpen ? <ChevronRightIcon className="w-3.5 h-3.5" /> : <ChevronLeftIcon className="w-3.5 h-3.5" />}
        </button>
        <div className="flex-1 h-full">
          <CodePanel code={props.diagramCode} />
        </div>
      </div>
    </div>
  );
};

export default DiagramView;