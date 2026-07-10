import { buildLlamaPrompt } from './promptService.js';
import { sendChatPrompt } from './ollamaService.js';

/**
 * Service to orchestrate the entire Digital Clone reply generation pipeline
 * @param {string} filename - Stored chat log file name
 * @param {string} newIncomingMessage - New incoming message content
 * @returns {Promise<string>} Simulated reply content
 */
export const generateAIReply = async (filename, newIncomingMessage) => {
  // 1. Build the customized system prompt and retrieve relevant few-shot context examples
  const promptData = await buildLlamaPrompt(filename, newIncomingMessage);

  // 2. Dispatch prompt payload array to Ollama API
  const reply = await sendChatPrompt(promptData.messages);

  return reply;
};
