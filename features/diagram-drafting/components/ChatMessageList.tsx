import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../../../types';
import { SparklesIcon } from '../../../components/icons';

interface ChatMessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, isLoading }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-500">
                    <SparklesIcon className="w-8 h-8 mb-2" />
                    <p className="text-sm">Start by describing your diagram.</p>
                </div>
            )}
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${
                            message.role === 'user'
                                ? 'bg-blue-600 text-white dark:bg-blue-700'
                                : message.role === 'model'
                                ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                        role="status" // For accessibility
                    >
                        {message.content}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="max-w-[75%] px-4 py-2 rounded-lg shadow-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 animate-pulse">
                        Thinking...
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};
