import express from 'express';
import { handleGetChatAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

/**
 * @route   GET /api/analytics
 * @desc    Get detailed activity timelines, top words, and chat logs analytics
 * @access  Public
 */
router.get('/analytics', handleGetChatAnalytics);

export default router;
