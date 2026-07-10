import express from 'express';
import { handleGetParticipants, handleSelectOwner, handleGetOwner } from '../controllers/ownerController.js';

const router = express.Router();

/**
 * @route   GET /api/participants
 * @desc    Get all unique participants from parsed chat export logs
 * @access  Public
 */
router.get('/participants', handleGetParticipants);

/**
 * @route   POST /api/select-owner
 * @desc    Register a participant as the chat owner ("Me")
 * @access  Public
 */
router.post('/select-owner', handleSelectOwner);

/**
 * @route   GET /api/owner
 * @desc    Get the registered owner for a specific chat file
 * @access  Public
 */
router.get('/owner', handleGetOwner);

export default router;
