import { generateResponse } from '../../../services/llmService';
import { DiagramData, ChatMessage } from '../types';

const SYSTEM_INSTRUCTION = `You are a Senior Distributed Systems Architect. 
Your task is to generate valid JSON diagram data for messaging systems.
Schema: {
  "nodes": [{"id": "string", "type": "PRODUCER"|"BROKER"|"CONSUMER"|"DATABASE"|"EXTERNAL_API"|"CACHE"|"TOPIC", "label": "string", "description": "string", "x": number, "y": number}],
  "edges": [{"id": "string", "source": "nodeId", "target": "nodeId", "label": "string"}]
}
Coordinate range: x (100-700), y (100-500). Distribute nodes logically to avoid overlap.
Return ONLY the JSON object.`;

export const generateDiagram = async (prompt: string): Promise<DiagramData> => {
  const messages = [{ role: 'user' as const, content: prompt }];
  const responseText = await generateResponse({
    provider: 'google',
    model: 'gemini-3-flash-preview',
    systemInstruction: SYSTEM_INSTRUCTION
  }, messages);

  try {
    const cleaned = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as DiagramData;
  } catch (error) {
    console.error("Failed to parse diagram JSON", error);
    throw new Error("Architecture generation failed. Please try a different prompt.");
  }
};

/**
 * REQ_ID: 3134 - Secure API endpoint for message queuing.
 * NOTE: API spec is missing in the references folder for secure messaging queue integration.
 * Proceeding with mock implementation as per HumanizeIQ safety rules.
 */
export const queueMessageForDelivery = async (senderId: string, recipientId: string, content: string) => {
  console.warn("API spec for secure messaging queue is missing in the references folder. Using MOCK.");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.info(`[MOCK QUEUE] Message from ${senderId} to ${recipientId} queued successfully. Content: ${content.substring(0, 20)}...`);
      resolve({ success: true, messageId: Math.random().toString(36).substr(2, 9) });
    }, 800);
  });
};

export const persistMessage = async (msg: ChatMessage) => {
  // MOCKED persistence as per REQ_ID: 3135
  // See request_folder/001_api_change_request.md
  console.info("[MOCK DB] Storing architectural session message:", msg);
};