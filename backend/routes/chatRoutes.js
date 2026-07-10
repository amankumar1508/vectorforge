import express from 'express';
import { generateCloneResponse } from '../controllers/chatController.js';

const router = express.Router();

/**
 * @route   POST /api/chat
 * @desc    Generate a clone response using the LLM backend
 * @access  Public
 */
router.post('/chat', generateCloneResponse);

export default router;
