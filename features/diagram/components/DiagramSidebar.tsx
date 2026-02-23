import React, { useState } from 'react';
import { BookOpenIcon, DocumentTextIcon, EditIcon, TrashIcon, CheckCircleIcon, XMarkIcon } from '../../../components/icons';

interface DiagramSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    diagrams: any[];
    isLoading: boolean;
    onSelect: (diagram: any) => void;
    onDelete?: (fileId: string) => void;
    onRename?: (fileId: string, newName: string) => void;
}

const DiagramSidebar: React.FC<DiagramSidebarProps> = ({ 
    isOpen, onToggle, diagrams, isLoading, onSelect, onDelete, onRename 
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');

    const startEditing = (e: React.MouseEvent, diagram: any) => {
        e.stopPropagation();
        setEditingId(diagram.fileId);
        setTempName(diagram.metadata?.displayName || diagram.fileName.split('-')[0]);
    };

    const cancelEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(null);
        setTempName('');
    };

    const handleSaveRename = (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation();
        if (tempName.trim() && onRename) {
            onRename(fileId, tempName.trim());
        }
        setEditingId(null);
    };

    const handleDelete = (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to permanently delete this diagram and its cloud storage record?') && onDelete) {
            onDelete(fileId);
        }
    };

    return (
        <div className={`relative flex transition-all duration-300 ease-in-out ${isOpen ? 'w-72' : 'w-14'} border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden`}>
            <div className="flex flex-col h-full w-full min-w-[288px]">
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
                                        <div
                                            key={diagram.fileId}
                                            onClick={() => editingId !== diagram.fileId && onSelect(diagram)}
                                            onMouseEnter={() => setHoveredId(diagram.fileId)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            className={`w-full text-left p-2 rounded-xl transition-all group flex items-center gap-3 border border-transparent ${editingId === diagram.fileId ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer'}`}
                                        >
                                            <div className={`p-2 rounded-lg ${editingId === diagram.fileId ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'} transition-colors`}>
                                                <DocumentTextIcon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                {editingId === diagram.fileId ? (
                                                    <input
                                                        autoFocus
                                                        value={tempName}
                                                        onChange={(e) => setTempName(e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-700 rounded px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <>
                                                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate">
                                                            {diagram.metadata?.displayName || diagram.fileName.split('-')[0]}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400">
                                                            {new Date(diagram.uploadedAt).toLocaleDateString()}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                            
                                            <div className={`flex items-center gap-1 transition-opacity duration-200 ${hoveredId === diagram.fileId || editingId === diagram.fileId ? 'opacity-100' : 'opacity-0'}`}>
                                                {editingId === diagram.fileId ? (
                                                    <>
                                                        <button onClick={(e) => handleSaveRename(e, diagram.fileId)} title="Save" className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                                                            <CheckCircleIcon className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button onClick={cancelEditing} title="Cancel" className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                                                            <XMarkIcon className="w-3.5 h-3.5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={(e) => startEditing(e, diagram)} title="Rename" className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                                                            <EditIcon className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button onClick={(e) => handleDelete(e, diagram.fileId)} title="Delete" className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                                                            <TrashIcon className="w-3.5 h-3.5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
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