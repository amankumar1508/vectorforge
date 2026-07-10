import { getWritingStyleProfile } from './analyzerService.js';

/**
 * Compiles a structured, high-level summary of writing characteristics
 * @param {string} filename - Stored chat log file name
 * @returns {Promise<Object>} Structured summary matching user format guidelines
 */
export const getPersonalitySummary = async (filename) => {
  const profile = await getWritingStyleProfile(filename);

  // Map reply length
  let replyLength = "Medium";
  if (profile.avgReplyLength < 6) replyLength = "Short";
  else if (profile.avgReplyLength > 12) replyLength = "Long";

  // Map emoji frequency category
  let emojiUsage = "Moderate";
  const emojiFreqNum = parseFloat(profile.emojiFrequency);
  if (emojiFreqNum > 60) emojiUsage = "High";
  else if (emojiFreqNum < 15) emojiUsage = "Low";

  // Map punctuation habits category
  let punctuation = "Standard";
  const noPunc = profile.punctuationHabits.noPunctuation;
  const periods = profile.punctuationHabits.endingPeriods;
  if (noPunc > 70) punctuation = "Minimal";
  else if (periods > 60) punctuation = "Formal";

  return {
    tone: profile.formalityLevel,
    replyLength,
    emojiUsage,
    greetingStyle: profile.greetingStyle,
    goodbyeStyle: profile.goodbyeStyle,
    favoriteWords: profile.mostCommonWords.slice(0, 5),
    punctuation
  };
};

/**
 * Compiles a descriptive natural-language profile text block for LLM prompting
 * @param {string} filename - Stored chat log file name
 * @returns {Promise<string>} Plain text personality description
 */
export const getPersonalityDescriptionText = async (filename) => {
  const profile = await getWritingStyleProfile(filename);
  const summary = await getPersonalitySummary(filename);

  const parts = [];

  // Formality and length
  parts.push(`The user writes in a ${profile.formalityLevel} tone (Formality Score: ${profile.formalityScore}/100).`);
  parts.push(`Their messages are typically ${summary.replyLength.toLowerCase()} (averaging ${profile.avgReplyLength} words per reply).`);

  // Emojis habits
  if (profile.mostCommonEmojis.length > 0) {
    parts.push(`They have a ${summary.emojiUsage.toLowerCase()} emoji usage frequency of ${profile.emojiFrequency}, favoring emojis such as ${profile.mostCommonEmojis.join(', ')}.`);
  } else {
    parts.push(`They rarely use emojis (frequency: ${profile.emojiFrequency}).`);
  }

  // Conversation boundaries
  const greeting = profile.greetingStyle !== 'None detected' ? `'${profile.greetingStyle}'` : 'no standard greeting';
  const goodbye = profile.goodbyeStyle !== 'None detected' ? `'${profile.goodbyeStyle}'` : 'no standard goodbye';
  parts.push(`They usually open conversations with ${greeting} and close them with ${goodbye}.`);

  // Punctuation habits
  const punct = [];
  if (profile.punctuationHabits.noPunctuation > 60) {
    punct.push(`minimizing punctuation and leaving messages open-ended with no ending period ${profile.punctuationHabits.noPunctuation}% of the time`);
  }
  if (profile.punctuationHabits.endingPeriods > 50) {
    punct.push(`applying standard sentence grammar, ending messages with periods ${profile.punctuationHabits.endingPeriods}% of the time`);
  }
  if (profile.punctuationHabits.endingExclamations > 30) {
    punct.push(`emphasizing statements with exclamation marks ${profile.punctuationHabits.endingExclamations}% of the time`);
  }
  const punctStr = punct.length > 0 ? punct.join(' and ') : 'using basic punctuation conventions';
  parts.push(`Their punctuation habits are ${punctStr}.`);

  // Slang habits
  if (profile.slang.length > 0) {
    parts.push(`They commonly integrate slang and contractions into their chats, including: ${profile.slang.join(', ')}.`);
  }

  // Signature words
  if (profile.mostCommonWords.length > 0) {
    parts.push(`Their signature vocabulary features high frequencies of words like: ${profile.mostCommonWords.slice(0, 6).join(', ')}.`);
  }

  return parts.join(' ');
};
