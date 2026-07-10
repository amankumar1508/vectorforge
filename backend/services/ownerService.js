import fs from 'fs/promises';
import path from 'path';
import { parseUploadedFile } from './parserService.js';

const SELECTIONS_FILE = './data/selections.json';

// Helper to read selections from local flat database
const readSelections = async () => {
  try {
    const data = await fs.readFile(SELECTIONS_FILE, 'utf-8');
    return JSON.parse(data || '{}');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Auto-initialize directories and structure if missing
      await fs.mkdir(path.dirname(SELECTIONS_FILE), { recursive: true });
      await fs.writeFile(SELECTIONS_FILE, '{}', 'utf-8');
      return {};
    }
    throw err;
  }
};

// Helper to write selections to local flat database
const writeSelections = async (selections) => {
  await fs.writeFile(SELECTIONS_FILE, JSON.stringify(selections, null, 2), 'utf-8');
};

/**
 * Extracts unique participants from parsed chat messages
 * @param {string} filename - Stored chat log file name
 * @returns {Promise<Array<string>>} Distinct participants list
 */
export const getChatParticipants = async (filename) => {
  const messages = await parseUploadedFile(filename);
  const participants = [...new Set(messages.map((m) => m.sender))];
  return participants;
};

/**
 * Validates and stores the owner selection for a chat log file
 * @param {string} filename - Stored chat log file name
 * @param {string} ownerName - Selected participant acting as "Me"
 * @returns {Promise<string>} The selected owner name
 */
export const saveChatOwner = async (filename, ownerName) => {
  const participants = await getChatParticipants(filename);

  if (!participants.includes(ownerName)) {
    const error = new Error(
      `Owner validation failed: "${ownerName}" is not a participant in this chat. Available participants: ${participants.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  const selections = await readSelections();
  selections[filename] = ownerName;
  await writeSelections(selections);

  return ownerName;
};

/**
 * Retrieves the owner selection mapping for a chat log file
 * @param {string} filename - Stored chat log file name
 * @returns {Promise<string|null>} The owner name, or null if unregistered
 */
export const getChatOwner = async (filename) => {
  const selections = await readSelections();
  return selections[filename] || null;
};
