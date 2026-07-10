import express from 'express';
import { handlePostAIReply } from '../controllers/replyController.js';

const router = express.Router();

/**
 * @route   POST /api/reply
 * @desc    Generate digital clone AI reply using full semantic retrieval and Ollama pipeline
 * @access  Public
 */
router.post('/reply', handlePostAIReply);

export default router;
