import { generateResponse } from '../../../services/llmService';
import { DiagramData, ChatMessage } from '../types';

const SYSTEM_INSTRUCTION = `You are a Senior Distributed Systems Architect. 
Your task is to generate valid JSON diagram data for messaging systems.
Schema: {
  "nodes": [{"id": "string", "type": "PRODUCER"|"BROKER"|"CONSUMER"|"DATABASE"|"EXTERNAL_API"|"CACHE"|"TOPIC", "label": "string", "description": "string", "x": number, "y": number}],
  "edges": [{"id": "string", "source": "nodeId", "target": "nodeId", "label": "string"}]
}
Coordinate range: x (0-800), y (0-600).
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

export const persistMessage = async (msg: ChatMessage) => {
  // MOCKED persistence as per REQ_ID: 3135
  // API Specification missing in References folder. 
  // See request_folder/001_api_change_request.md
  console.info("[MOCK DB] Storing message:", msg);
};
