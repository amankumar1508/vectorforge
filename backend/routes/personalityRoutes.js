import express from 'express';
import { handleGetPersonalityDescription, handleGetPersonalitySummary } from '../controllers/personalityController.js';

const router = express.Router();

/**
 * @route   GET /api/personality-description
 * @desc    Get the writing style description as plain text
 * @access  Public
 */
router.get('/personality-description', handleGetPersonalityDescription);

/**
 * @route   GET /api/personality-summary
 * @desc    Get the structured personality summary as JSON
 * @access  Public
 */
router.get('/personality-summary', handleGetPersonalitySummary);

export default router;
