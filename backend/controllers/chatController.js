import { sendChatPrompt } from '../services/ollamaService.js';

/**
 * Controller managing chat endpoints and processing prompt payloads to Ollama
 */
export const handleChatPrompt = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      const error = new Error(
        'Invalid request payload: "messages" parameter is required and must be a non-empty array of message objects.'
      );
      error.statusCode = 400;
      throw error;
    }

    // Call Ollama endpoint
    const reply = await sendChatPrompt(messages);

    res.status(200).json({
      success: true,
      reply
    });
  } catch (err) {
    next(err);
  }
};
