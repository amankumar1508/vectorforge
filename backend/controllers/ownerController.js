import { getChatParticipants, saveChatOwner, getChatOwner } from '../services/ownerService.js';

/**
 * Controller to extract all unique participants in a chat log
 */
export const handleGetParticipants = async (req, res, next) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      const error = new Error('Query parameter "filename" is required.');
      error.statusCode = 400;
      throw error;
    }

    const participants = await getChatParticipants(filename);

    res.status(200).json({
      success: true,
      count: participants.length,
      participants
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to assign and save a participant as the chat owner ("Me")
 */
export const handleSelectOwner = async (req, res, next) => {
  try {
    const { filename, ownerName } = req.body;

    if (!filename || !ownerName) {
      const error = new Error('Missing body parameters: Both "filename" and "ownerName" are required.');
      error.statusCode = 400;
      throw error;
    }

    const savedOwner = await saveChatOwner(filename, ownerName);

    res.status(200).json({
      success: true,
      message: `Selected owner "${savedOwner}" saved successfully.`,
      ownerName: savedOwner
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to retrieve the saved owner mapping
 */
export const handleGetOwner = async (req, res, next) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      const error = new Error('Query parameter "filename" is required.');
      error.statusCode = 400;
      throw error;
    }

    const ownerName = await getChatOwner(filename);

    res.status(200).json({
      success: true,
      ownerName
    });
  } catch (err) {
    next(err);
  }
};
