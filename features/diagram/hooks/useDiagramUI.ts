import { useState, useCallback } from 'react';

export const useDiagramUI = () => {
    const [zoom, setZoom] = useState(1);
    const [viewMode, setViewMode] = useState<'canvas' | 'code'>('canvas');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.2));
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);

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
            } catch (err) { 
                alert("Security Error: Diagram contains restricted resources."); 
            }
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

    const triggerSaveSuccess = (isUpdate: boolean) => {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
    };

    return {
        zoom, setZoom, viewMode, setViewMode, isSaving, setIsSaving, saveSuccess, setSaveSuccess,
        isSidebarOpen, setIsSidebarOpen, handleZoomIn, handleZoomOut, toggleSidebar, closeSidebar,
        handleExportPNG, handleExportSVG, triggerSaveSuccess
    };
};
