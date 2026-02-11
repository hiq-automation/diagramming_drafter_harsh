import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../../../contexts/ThemeContext';

interface MermaidRendererProps {
    chart: string;
}

/**
 * MermaidRenderer handles the actual SVG generation from Mermaid code strings.
 * It re-initializes and re-runs whenever the chart code or theme changes.
 */
const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? 'dark' : 'neutral',
            securityLevel: 'loose',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
            sequence: { useMaxWidth: true, showSequenceNumbers: true },
        });
    }, [theme]);

    useEffect(() => {
        const renderChart = async () => {
            if (containerRef.current && chart) {
                try {
                    // Clean previous content
                    containerRef.current.innerHTML = `<div class="mermaid-target">${chart}</div>`;
                    const target = containerRef.current.querySelector('.mermaid-target') as HTMLElement;
                    
                    if (target) {
                        await mermaid.run({
                            nodes: [target],
                        });
                    }
                } catch (err) {
                    console.error("Mermaid rendering failed:", err);
                    if (containerRef.current) {
                        containerRef.current.innerHTML = `
                            <div class="flex flex-col items-center justify-center p-8 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/50">
                                <p class="font-bold text-sm mb-1 uppercase tracking-wider">Syntax Error</p>
                                <p class="text-xs opacity-70">Check the code output panel for details</p>
                            </div>
                        `;
                    }
                }
            }
        };

        renderChart();
    }, [chart]);

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div ref={containerRef} className="mermaid-container w-full max-w-full overflow-hidden transition-all duration-500" />
        </div>
    );
};

export default MermaidRenderer;