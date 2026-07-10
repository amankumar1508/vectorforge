import { parseUploadedFile } from './parserService.js';
import { getChatOwner } from './ownerService.js';
import { getWritingStyleProfile } from './analyzerService.js';
import { generateTrainingPairs } from './trainingService.js';

// Regex for extracting standard emojis
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu;

const stopwords = new Set([
  "the", "a", "an", "and", "but", "or", "for", "nor", "on", "in", "at", "to", "by", 
  "of", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", 
  "do", "does", "did", "this", "that", "these", "those", "i", "you", "he", "she", 
  "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", 
  "our", "their", "am", "with", "as", "if", "about", "there", "then", "so", 
  "than", "just", "very", "up", "out", "now", "get", "go", "can", "will", "here"
]);

/**
 * Service compiling comprehensive chat metrics, times distributions, word ranks, and timelines
 * @param {string} filename - Stored chat log file name
 * @returns {Promise<Object>} Completed Analytics profile payload
 */
export const getChatAnalytics = async (filename) => {
  // 1. Fetch selections mapping
  const ownerName = await getChatOwner(filename);

  if (!ownerName) {
    const error = new Error(`No owner selected for file "${filename}". Register owner first.`);
    error.statusCode = 400;
    throw error;
  }

  // 2. Fetch dependencies datasets
  const rawMessages = await parseUploadedFile(filename);
  const trainingPairs = await generateTrainingPairs(filename);
  const styleProfile = await getWritingStyleProfile(filename);

  // 3. Filter owner/me message logs
  const ownerMessages = rawMessages.filter((m) => m.sender === ownerName);

  const totalMessages = ownerMessages.length;
  const replyPairsCount = trainingPairs.length;

  const hoursMap = Array(24).fill(0);
  const daysMap = { "Sun": 0, "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0 };
  const datesMap = {};

  const wordFrequencies = {};
  const emojiFrequencies = {};

  ownerMessages.forEach((msg) => {
    const text = msg.message ? msg.message.trim() : '';
    if (!text) return;

    // A. Parse hours distribution (Daily activity)
    if (msg.time) {
      const match = msg.time.match(/(\d+):(\d+):?(\d+)?\s*(AM|PM)?/i);
      if (match) {
        let hour = parseInt(match[1], 10);
        const ampm = match[4];
        if (ampm) {
          if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
          if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
        }
        if (hour >= 0 && hour < 24) {
          hoursMap[hour]++;
        }
      }
    }

    // B. Parse days of week & dates timelines (Weekly activity)
    if (msg.date) {
      const parts = msg.date.split(/[-/.]/);
      if (parts.length === 3) {
        let dateObj = new Date(msg.date);
        // Fallback for international structures (DD-MM-YYYY)
        if (isNaN(dateObj.getTime())) {
          dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
        
        if (!isNaN(dateObj.getTime())) {
          const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const dayName = daysOfWeek[dateObj.getDay()];
          daysMap[dayName]++;
        }
      }
      
      datesMap[msg.date] = (datesMap[msg.date] || 0) + 1;
    }

    // C. Extract emojis frequencies
    const emojis = text.match(emojiRegex);
    if (emojis) {
      emojis.forEach((e) => {
        emojiFrequencies[e] = (emojiFrequencies[e] || 0) + 1;
      });
    }

    // D. Extract word frequencies
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9']/g, ''))
      .filter(Boolean);

    words.forEach((w) => {
      if (!stopwords.has(w)) {
        wordFrequencies[w] = (wordFrequencies[w] || 0) + 1;
      }
    });
  });

  // Compile top records
  const favoriteEmoji = Object.entries(emojiFrequencies).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  const topWords = Object.entries(wordFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => ({ word: entry[0], count: entry[1] }));

  const dailyActivity = hoursMap.map((count, hr) => ({
    hour: `${hr.toString().padStart(2, '0')}:00`,
    count
  }));

  const weeklyActivity = Object.entries(daysMap).map(([day, count]) => ({
    day,
    count
  }));

  const timelineActivity = Object.entries(datesMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7); // Slice the last 7 active dates

  return {
    totalMessages,
    replyPairsCount,
    avgReplyLength: styleProfile.avgReplyLength,
    favoriteEmoji,
    mostUsedWords: topWords,
    tone: styleProfile.formalityLevel,
    formalityScore: styleProfile.formalityScore,
    dailyActivity,
    weeklyActivity,
    timelineActivity
  };
};
