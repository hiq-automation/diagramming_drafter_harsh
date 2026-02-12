
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import mermaid from 'mermaid';
import { BookOpenIcon } from '../../../components/icons';

export interface DiagramCanvasExportAPI {
    exportSVG: () => void;
    exportPNG: () => void;
}

interface DiagramCanvasProps {
    mermaidCode: string;
    canvasScale?: number; // Numeric scale from 0 to 100
}

export const DiagramCanvas = forwardRef<DiagramCanvasExportAPI, DiagramCanvasProps>(({ mermaidCode, canvasScale = 100 }, ref) => {
    const diagramRef = useRef<HTMLDivElement>(null);

    const downloadFile = (dataUrl: string, filename: string, _mimeType: string) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(dataUrl);
    };

    const exportSVG = () => {
        if (!diagramRef.current || !mermaidCode) return;
        const svgElement = diagramRef.current.querySelector('svg');
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        downloadFile(svgUrl, 'diagram.svg', 'image/svg+xml');
    };

    const exportPNG = () => {
        if (!diagramRef.current || !mermaidCode) return;
        const svgElement = diagramRef.current.querySelector('svg');
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            URL.revokeObjectURL(svgUrl);

            canvas.toBlob((blob) => {
                if (blob) {
                    const pngUrl = URL.createObjectURL(blob);
                    downloadFile(pngUrl, 'diagram.png', 'image/png');
                }
            }, 'image/png');
        };
        img.src = svgUrl;
    };

    useImperativeHandle(ref, () => ({
        exportSVG,
        exportPNG,
    }));

    useEffect(() => {
        if (diagramRef.current && mermaidCode) {
            try {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
                    securityLevel: 'loose',
                    flowchart: {
                        htmlLabels: true,
                        curve: 'basis',
                    }
                });

                diagramRef.current.innerHTML = '';
                
                mermaid.render('mermaidDiagram', mermaidCode)
                    .then(({ svg }) => {
                        if (diagramRef.current) {
                            diagramRef.current.innerHTML = svg;
                        }
                    })
                    .catch((error) => {
                        if (diagramRef.current) {
                            diagramRef.current.innerHTML = `<div class="text-red-500">Error rendering: ${error.message}</div>`;
                        }
                    });
            } catch (error) {
                if (diagramRef.current) {
                    diagramRef.current.innerHTML = `<div class="text-red-500">Failed to initialize: ${error.message}</div>`;
                }
            }
        }
    }, [mermaidCode]);

    // Interpret 0 as 'Auto' or 100% for user experience
    const effectiveScale = canvasScale === 0 ? 100 : canvasScale;

    return (
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            {mermaidCode ? (
                <div 
                    className="flex items-center justify-center transition-all duration-300 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 p-4"
                    style={{ 
                        width: `${effectiveScale}%`, 
                        height: 'auto',
                        minWidth: '200px',
                        minHeight: '200px',
                        aspectRatio: '16/9'
                    }}
                >
                    <div ref={diagramRef} className="mermaid w-full h-full flex items-center justify-center overflow-auto">
                        {/* Mermaid diagram rendered here */}
                    </div>
                </div>
            ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 text-lg">
                    <BookOpenIcon className="w-12 h-12 mx-auto mb-4" />
                    <p>Your diagram will appear here.</p>
                </div>
            )}
        </div>
    );
});
