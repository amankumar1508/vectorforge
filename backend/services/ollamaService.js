import dotenv from 'dotenv';

// Ensure environment keys are fully resolved
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

/**
 * Interface service making request payloads to the local/remote Ollama model instance
 * @param {Array<Object>} messages - Array of chat logs: [ { role: 'user'|'assistant'|'system', content: '...' } ]
 * @returns {Promise<string>} The parsed string response text content from Llama
 */
export const sendChatPrompt = async (messages) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // Strict 30s timeout ceiling

  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Attach bearer token if configured
    if (OLLAMA_API_KEY) {
      headers['Authorization'] = `Bearer ${OLLAMA_API_KEY}`;
    }

    const body = JSON.stringify({
      model: OLLAMA_MODEL,
      messages: messages,
      stream: false // Strict requirement: disable stream processing
    });

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMsg = await response.text();
      const error = new Error(
        `Ollama API Error (Status ${response.status}): ${errorMsg || response.statusText}`
      );
      error.statusCode = response.status;
      throw error;
    }

    const data = await response.json();

    // Verify response schema structures
    if (!data.message || typeof data.message.content !== 'string') {
      throw new Error('Malformed JSON response returned from Ollama API.');
    }

    return data.message.content;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      const timeoutError = new Error('Gateway Timeout: Ollama failed to respond within 30 seconds.');
      timeoutError.statusCode = 504;
      throw timeoutError;
    }

    throw err;
  }
};
