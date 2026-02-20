import React from 'react';
import PromptPanel from './components/PromptPanel';
import CanvasPanel from './components/CanvasPanel';
import CodePanel from './components/CodePanel';
import DiagramSidebar from './components/DiagramSidebar';
import { ChatMessage } from '../../types';
import { DownloadIcon, UploadIcon, CheckCircleIcon } from '../../components/icons';
import { useDiagramUI } from './hooks/useDiagramUI';

interface DiagramViewProps {
    prompt: string;
    setPrompt: (val: string) => void;
    mermaidCode: string;
    setMermaidCode: (val: string) => void;
    onGenerate: (overridingPrompt?: string) => void;
    onClearHistory: () => void;
    isGenerating: boolean;
    error: string | null;
    chatMessages: ChatMessage[];
    diagrams: any[];
    isLoadingDiagrams: boolean;
    onSelectDiagram: (d: any, close: () => void) => void;
    onRefreshDiagrams: () => void;
    onDeleteDiagram?: (id: string) => void;
    onRenameDiagram?: (id: string, name: string) => void;
    onSaveDiagram?: () => Promise<void>;
    activeFileId: string | null;
}

const DiagramView: React.FC<DiagramViewProps> = (props) => {
    const ui = useDiagramUI();

    const handleSaveToR2 = async () => {
        if (!props.onSaveDiagram) return;
        ui.setIsSaving(true);
        try {
            await props.onSaveDiagram();
            ui.triggerSaveSuccess(!!props.activeFileId);
        } catch (err) { 
            console.error("Save error:", err); 
            alert("Error: Failed to save to Cloud storage."); 
        } finally { 
            ui.setIsSaving(false); 
        }
    };

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900 overflow-hidden text-sm">
            {ui.saveSuccess && (
                <div className="fixed top-20 right-8 z-[100] animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span className="font-bold tracking-wide">{props.activeFileId ? 'Changes updated' : 'Diagram saved to Cloud'}</span>
                    </div>
                </div>
            )}
            
            <DiagramSidebar 
                isOpen={ui.isSidebarOpen} 
                onToggle={ui.toggleSidebar}
                diagrams={props.diagrams}
                isLoading={props.isLoadingDiagrams}
                onSelect={(d) => props.onSelectDiagram(d, ui.closeSidebar)}
                onDelete={props.onDeleteDiagram}
                onRename={props.onRenameDiagram}
            />

            <div className="w-96 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 flex flex-col">
                <PromptPanel 
                    prompt={props.prompt} 
                    setPrompt={props.setPrompt} 
                    onGenerate={props.onGenerate} 
                    onClearHistory={props.onClearHistory} 
                    isGenerating={props.isGenerating} 
                    error={props.error} 
                    chatMessages={props.chatMessages} 
                />
            </div>

            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 flex justify-between items-center px-6 h-16">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${props.isGenerating ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">Workspace</h3>
                        </div>
                        <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-44">
                            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 transition-all duration-300 ${ui.viewMode === 'code' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} />
                            <button onClick={() => ui.setViewMode('canvas')} className={`relative z-10 flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest ${ui.viewMode === 'canvas' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Canvas</button>
                            <button onClick={() => ui.setViewMode('code')} className={`relative z-10 flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest ${ui.viewMode === 'code' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Code</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {ui.viewMode === 'canvas' && (
                            <>
                                <button onClick={handleSaveToR2} disabled={ui.isSaving} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${ui.isSaving ? 'bg-slate-50 border-slate-100 text-slate-300' : 'border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600'}`}>
                                    <UploadIcon className={`w-3.5 h-3.5 ${ui.isSaving ? 'animate-bounce' : ''}`} />
                                    {ui.isSaving ? 'Saving...' : props.activeFileId ? 'Overwrite' : 'Save'}
                                </button>
                                <button onClick={ui.handleExportSVG} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-all"><DownloadIcon className="w-3.5 h-3.5" /> SVG</button>
                                <button onClick={ui.handleExportPNG} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-all"><DownloadIcon className="w-3.5 h-3.5" /> PNG</button>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <button onClick={ui.handleZoomOut} className="px-2 py-0.5 hover:text-blue-500 text-slate-500 dark:text-slate-400 font-bold">−</button>
                                    <span className="text-[10px] w-12 text-center font-mono text-slate-600 dark:text-slate-300">{Math.round(ui.zoom * 100)}%</span>
                                    <button onClick={ui.handleZoomIn} className="px-2 py-0.5 hover:text-blue-500 text-slate-500 dark:text-slate-400 font-bold">+</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    {ui.viewMode === 'canvas' ? (
                        <div className="h-full w-full overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
                            <div className="min-w-full min-h-full p-12 flex items-center justify-center">
                                <div style={{ transform: `scale(${ui.zoom})`, transformOrigin: 'center' }} className="transition-transform duration-200"><CanvasPanel code={props.mermaidCode} /></div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full bg-white dark:bg-slate-900 animate-in slide-in-from-right-4 duration-300"><CodePanel code={props.mermaidCode} setCode={props.setMermaidCode} /></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiagramView;
