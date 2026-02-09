
import React from 'react';
import PromptSection from './components/PromptSection';
import CanvasSection from './components/CanvasSection';
import CodeSection from './components/CodeSection';

interface DiagramViewProps {
    prompt: string;
    setPrompt: (val: string) => void;
    mermaidCode: string;
    onGenerate: () => void;
    isLoading: boolean;
    history: string[];
    error: string | null;
}

const DiagramView: React.FC<DiagramViewProps> = ({ 
    prompt, 
    setPrompt, 
    mermaidCode, 
    onGenerate, 
    isLoading,
    history,
    error
}) => {
    return (
        <div className="flex flex-1 overflow-hidden h-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            {/* Left: Prompt Section & History Log */}
            <div className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-y-auto">
                <PromptSection 
                    prompt={prompt} 
                    setPrompt={setPrompt} 
                    onGenerate={onGenerate} 
                    isLoading={isLoading}
                    history={history}
                    error={error}
                />
            </div>

            {/* Middle: Canvas Section */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <CanvasSection mermaidCode={mermaidCode} isLoading={isLoading} />
            </div>

            {/* Right: Code Output Section */}
            <div className="w-96 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-y-auto">
                <CodeSection code={mermaidCode} />
            </div>
        </div>
    );
};

export default DiagramView;
