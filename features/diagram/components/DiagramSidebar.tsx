import React from 'react';
import { BookOpenIcon, ChevronRightIcon, DocumentTextIcon } from '../../../components/icons';

interface DiagramSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    diagrams: any[];
    isLoading: boolean;
    onSelect: (diagram: any) => void;
}

const DiagramSidebar: React.FC<DiagramSidebarProps> = ({ 
    isOpen, onToggle, diagrams, isLoading, onSelect 
}) => {
    return (
        <div className={`relative flex transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-14'} border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden`}>
            {/* Sidebar Content */}
            <div className="flex flex-col h-full w-full min-w-[256px]">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between h-16">
                    {isOpen && <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Library</h2>}
                    <button 
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                    >
                        <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {!isOpen ? (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <BookOpenIcon className="w-5 h-5 text-slate-400" />
                        </div>
                    ) : (
                        <>
                            {isLoading ? (
                                <div className="p-4 text-center text-xs text-slate-400">Loading history...</div>
                            ) : diagrams.length === 0 ? (
                                <div className="p-4 text-center text-xs text-slate-400 italic">No saved diagrams.</div>
                            ) : (
                                <div className="space-y-1">
                                    {diagrams.map((diagram) => (
                                        <button
                                            key={diagram.fileId}
                                            onClick={() => onSelect(diagram)}
                                            className="w-full text-left p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group flex items-start gap-3 border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                                        >
                                            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <DocumentTextIcon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                                                    {diagram.fileName.split('-')[0]}
                                                </p>
                                                <p className="text-[9px] text-slate-400 mt-0.5">
                                                    {new Date(diagram.uploadedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <ChevronRightIcon className="w-3 h-3 text-slate-300 group-hover:text-blue-400 mt-2" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiagramSidebar;
