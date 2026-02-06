import { generateResponse } from '../../../services/llmService';
import { DiagramData, ChatMessage } from '../types';

const SYSTEM_INSTRUCTION = `You are a Diagram Drafter Assistant.
Your sole responsibility is to incrementally construct diagrams using Mermaid syntax, one component or one connection at a time.

📌 Core Rules
You must return the COMPLETE updated Mermaid code (starting with 'graph TB') for every request.
The output MUST include all existing components and connections from the provided context, plus exactly one new addition.

If the user asks for a full system design at once, You MUST respond: "Please add one component or one connection at a time."

Each user input can result in ONLY ONE of the following additions:
1. Create one single component (box)
2. Create one single connection (arrow) between two existing components

Never add more than one item per response.
Never rename components unless explicitly instructed.

📌 State Management
The user will provide the current Mermaid code as context.
You must synthesize the new addition and integrate it into the existing code to maintain a single continuous architecture.
Return ONLY the Mermaid syntax. No explanations. No markdown. No comments. No natural language.`;

export const generateDiagram = async (prompt: string, currentData?: DiagramData): Promise<string> => {
  const messages: { role: 'user' | 'model'; content: string }[] = [];

  if (currentData && currentData.mermaidCode) {
    messages.push({
      role: 'user',
      content: `Current Diagram Code:\n${currentData.mermaidCode}`
    });
    messages.push({
      role: 'model',
      content: 'I have the current diagram state. What single component or connection would you like to add?'
    });
  }

  messages.push({ role: 'user', content: prompt });

  const responseText = await generateResponse({
    provider: 'google',
    model: 'gemini-3-flash-preview',
    systemInstruction: SYSTEM_INSTRUCTION
  }, messages);

  return responseText.trim();
};

/**
 * Persists a message to the architectural session log.
 * Implements client-side storage for historical review (Mock).
 */
export const persistMessage = async (msg: ChatMessage) => {
  // Capture and store for historical review (Mock implementation using LocalStorage)
  console.info("[AUDIT LOG] Capturing command for historical review:", msg);
  
  try {
    const LOG_KEY = 'architect_audit_logs';
    const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    logs.push({
      ...msg,
      capturedAt: new Date().toISOString(),
      type: 'command_capture'
    });
    // Keep a reasonable buffer for review (last 50 commands)
    localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-50)));
  } catch (e) {
    console.error("[AUDIT LOG] Persistence failure:", e);
  }
};