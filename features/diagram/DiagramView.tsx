import React, { useState } from 'react';
import PromptPanel from './components/PromptPanel';
import CanvasPanel from './components/CanvasPanel';
import CodePanel from './components/CodePanel';
import { ChatMessage } from '../../types';
import { DownloadIcon } from '../../components/icons';

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
}

const DiagramView: React.FC<DiagramViewProps> = ({
    prompt, setPrompt, mermaidCode, setMermaidCode, onGenerate, onClearHistory, isGenerating, error, chatMessages
}) => {
    const [zoom, setZoom] = useState(1);
    const [viewMode, setViewMode] = useState<'canvas' | 'code'>('canvas');

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.2));
    const handleZoomReset = () => setZoom(1);

    const getSerializedSvg = () => {
        const svgElement = document.querySelector('.mermaid-container svg') as SVGSVGElement;
        if (!svgElement) return null;
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgElement);
        if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
            source = source.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        return source;
    };

    const handleExportPNG = () => {
        const source = getSerializedSvg();
        if (!source) return;
        const canvas = document.createElement('canvas');
        const svgElement = document.querySelector('.mermaid-container svg') as SVGSVGElement;
        const bbox = svgElement.getBBox();
        const padding = 40;
        const width = svgElement.width.baseVal.value || bbox.width || 800;
        const height = svgElement.height.baseVal.value || bbox.height || 600;
        canvas.width = width + padding * 2;
        canvas.height = height + padding * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const url = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(source)))}`;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                ctx.drawImage(img, padding, padding);
                const pngUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = pngUrl;
                link.download = `diagram-${Date.now()}.png`;
                link.click();
            } catch (err) { alert("Security Error: Diagram contains restricted resources."); }
        };
        img.src = url;
    };

    const handleExportSVG = () => {
        const source = getSerializedSvg();
        if (!source) return;
        const preface = '<?xml version="1.0" standalone="no"?>\r\n';
        const blob = new Blob([preface, source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `diagram-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900 overflow-hidden text-sm">
            <div className="w-96 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 flex flex-col">
                <PromptPanel {...{ prompt, setPrompt, onGenerate, onClearHistory, isGenerating, error, chatMessages }} />
            </div>
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
                <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 flex justify-between items-center px-6 h-16">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">Workspace</h3>
                        </div>
                        <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-44">
                            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 transition-all duration-300 ${viewMode === 'code' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}`} />
                            <button onClick={() => setViewMode('canvas')} className={`relative z-10 flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest ${viewMode === 'canvas' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Canvas</button>
                            <button onClick={() => setViewMode('code')} className={`relative z-10 flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest ${viewMode === 'code' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Code</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {viewMode === 'canvas' && (
                            <>
                                <button onClick={handleExportSVG} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-all"><DownloadIcon className="w-3.5 h-3.5" /> SVG</button>
                                <button onClick={handleExportPNG} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-all"><DownloadIcon className="w-3.5 h-3.5" /> PNG</button>
                                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <button onClick={handleZoomOut} className="px-2 py-0.5 hover:text-blue-500 text-slate-500 dark:text-slate-400 font-bold">−</button>
                                    <span className="text-[10px] w-12 text-center font-mono text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
                                    <button onClick={handleZoomIn} className="px-2 py-0.5 hover:text-blue-500 text-slate-500 dark:text-slate-400 font-bold">+</button>
                                    <button onClick={handleZoomReset} className="px-2 py-0.5 border-l border-slate-200 dark:border-slate-700 hover:text-red-500 text-slate-400 transition-colors">⟲</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    {viewMode === 'canvas' ? (
                        <div className="h-full w-full overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
                            <div className="min-w-full min-h-full p-12 flex items-center justify-center">
                                <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }} className="transition-transform duration-200"><CanvasPanel code={mermaidCode} /></div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full bg-white dark:bg-slate-900 animate-in slide-in-from-right-4 duration-300"><CodePanel code={mermaidCode} setCode={setMermaidCode} /></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiagramView;