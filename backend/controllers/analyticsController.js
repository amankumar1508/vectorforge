import { getChatAnalytics } from '../services/analyticsService.js';

/**
 * Controller to resolve detailed chat logs analytics requests
 */
export const handleGetChatAnalytics = async (req, res, next) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      const error = new Error('Query parameter "filename" is required.');
      error.statusCode = 400;
      throw error;
    }

    const analytics = await getChatAnalytics(filename);

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (err) {
    next(err);
  }
};
