import { useState, useCallback, useRef } from 'react';
import { ChatMessage, DiagramGenerationOutput } from '../../../types';
import { diagramService } from '../services/diagramService';

interface UseDiagramGenerator {
    chatMessages: ChatMessage[];
    currentMermaidCode: string;
    isLoading: boolean;
    sendMessage: (message: string) => Promise<void>;
    clearChat: () => void;
}

export const useDiagramGenerator = (): UseDiagramGenerator => {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [currentMermaidCode, setCurrentMermaidCode] = useState<string>(''); // Changed initial state to empty string
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Using a ref to hold mutable chat messages for AI context without re-rendering
    const chatHistoryRef = useRef<ChatMessage[]>([]);

    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim()) return;

        setIsLoading(true);
        const userMessage: ChatMessage = {
            id: Date.now().toString() + '-user',
            role: 'user',
            content: message,
        };
        
        // Update both state and ref for consistency
        setChatMessages(prev => {
            const newMessages = [...prev, userMessage];
            chatHistoryRef.current = newMessages;
            return newMessages;
        });

        try {
            const response: DiagramGenerationOutput = await diagramService.generateDiagramContent(
                message,
                chatHistoryRef.current,
                currentMermaidCode, // Pass currentMermaidCode for incremental updates
            );

            const aiMessage: ChatMessage = {
                id: Date.now().toString() + '-model',
                role: 'model',
                content: response.reply,
            };

            setChatMessages(prev => {
                const newMessages = [...prev, aiMessage];
                chatHistoryRef.current = newMessages;
                return newMessages;
            });
            setCurrentMermaidCode(response.mermaidCode);
        } catch (error) {
            console.error('Error sending message or generating diagram:', error);
            const errorMessage: ChatMessage = {
                id: Date.now().toString() + '-error',
                role: 'system',
                content: "Oops! Something went wrong. Please try again.",
            };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [currentMermaidCode]); // Add currentMermaidCode to dependencies

    const clearChat = useCallback(() => {
        setChatMessages([]);
        setCurrentMermaidCode(''); // Reset to empty string
        chatHistoryRef.current = [];
    }, []);

    return {
        chatMessages,
        currentMermaidCode,
        isLoading,
        sendMessage,
        clearChat,
    };
};