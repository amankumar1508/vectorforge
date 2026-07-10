import { getPersonalitySummary, getPersonalityDescriptionText } from '../services/personalityService.js';

/**
 * Controller returning a natural-language description as plain text (text/plain)
 */
export const handleGetPersonalityDescription = async (req, res, next) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      const error = new Error('Query parameter "filename" is required.');
      error.statusCode = 400;
      throw error;
    }

    const description = await getPersonalityDescriptionText(filename);

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(description);
  } catch (err) {
    next(err);
  }
};

/**
 * Controller returning the structured summary mapping as JSON
 */
export const handleGetPersonalitySummary = async (req, res, next) => {
  try {
    const { filename } = req.query;

    if (!filename) {
      const error = new Error('Query parameter "filename" is required.');
      error.statusCode = 400;
      throw error;
    }

    const summary = await getPersonalitySummary(filename);

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (err) {
    next(err);
  }
};
