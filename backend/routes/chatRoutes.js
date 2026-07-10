import express from 'express';
import { handleChatPrompt } from '../controllers/chatController.js';

const router = express.Router();

/**
 * @route   POST /api/chat
 * @desc    Send chat prompt messages to Ollama (Llama 3.2:3b) and receive response
 * @access  Public
 */
router.post('/chat', handleChatPrompt);

export default router;
