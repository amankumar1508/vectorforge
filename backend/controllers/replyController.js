import { generateAIReply } from '../services/replyService.js';

/**
 * Controller to handle digital clone AI reply requests
 */
export const handlePostAIReply = async (req, res, next) => {
  try {
    const { filename, newIncomingMessage } = req.body;

    if (!filename || !newIncomingMessage) {
      const error = new Error(
        'Missing parameters: Both "filename" and "newIncomingMessage" are required in request body.'
      );
      error.statusCode = 400;
      throw error;
    }

    const reply = await generateAIReply(filename, newIncomingMessage);

    res.status(200).json({
      success: true,
      reply
    });
  } catch (err) {
    next(err);
  }
};
