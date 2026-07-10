// Controller to manage AI Digital Clone chat completions via OpenRouter, SiliconFlow, or local Ollama fallbacks.

const DEFAULT_MOCK_RESPONSES = {
  clone: [
    "literally so true 😂 let's deploy the rebase config first and see",
    "yeah it makes complete sense. setup was a bit weird but we got it 🔥",
    "brother we literally just compiled the files 👍 ready to test"
  ],
  sarah: [
    "Hi, I am currently reviewing the accessibility guidelines and user testing mockups.",
    "Please check the alignment and font constraints in the Figma file. Let's align on this tomorrow.",
    "That is correct. Let's make sure the spacing on mobile is legible."
  ],
  mom: [
    "Hello dear!! Did you eat yet?? Call me when you are home! 😘🌸",
    "Okay take care and drive slowly!! ❤️❤️",
    "Pasta is ready! Bring some fruits if you can dear! 😘"
  ],
  alex: [
    "lgtm, test compile ok 👍",
    "yeah PR merged into main branch",
    "lmk if local build fails, rebase complete"
  ]
};

function getMockFallback(personaId, text) {
  const responses = DEFAULT_MOCK_RESPONSES[personaId] || DEFAULT_MOCK_RESPONSES['clone'];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

export const generateCloneResponse = async (req, res, next) => {
  try {
    const { messages = [], styleProfile = {}, personaId = 'clone' } = req.body;

    if (messages.length === 0) {
      return res.status(400).json({ error: 'No message history provided.' });
    }

    const lastUserMessage = messages[messages.length - 1]?.text || '';

    // 1. Build System Instructions from Style Profile
    const vocabularyList = Array.isArray(styleProfile.vocabulary) 
      ? styleProfile.vocabulary.join(', ') 
      : (styleProfile.vocabulary || 'casually, cool');

    const systemPrompt = `You are an AI chat clone of a real person. Your job is to reply to the last message, strictly mimicking the target person's texting habits as defined in their Style Profile.

STYLE PROFILE:
- Tone: ${styleProfile.tone || 'Casual, conversational'}
- Punctuation & Casing: ${styleProfile.punctuation || 'uses minimal punctuation and lowercase'}
- Emoji Habits: ${styleProfile.emojiUsage || 'uses emojis sometimes'}
- Signature Vocabulary Words: ${vocabularyList}
- Typical Response Length: ${styleProfile.messageLength || 'short-to-medium'}

CRITICAL INSTRUCTIONS:
1. Do not start with a greeting (like "Hey" or "Hi") unless the user's message is a greeting or it matches the tone.
2. Imitate their casing and grammar completely. If they use lowercase, write in ALL lowercase.
3. Write ONLY the direct chat response. Do not include any explanations, thinking tags, or framing.
4. Keep the reply length matching their typical response length.
5. If the last message is in Hindi or English, you can reply in the same language/hinglish style.
`;

    // 2. Format Messages History for OpenAI-compatible completions
    // 'me' is the person talking to the clone (User)
    // 'them' is the clone (Assistant)
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10).map(msg => ({
        role: msg.sender === 'me' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    let replyText = '';
    let usedProvider = '';

    // --- Provider 1: OpenRouter ---
    if (process.env.OPENROUTER_API_KEY) {
      try {
        console.log('[AI] Attempting completion via OpenRouter...');
        const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://github.com/kuldeeppatel-cg/vectorforge',
            'X-Title': 'Ditto Workspace'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.2-3b-instruct:free', // Default to free Llama 3.2 on OpenRouter
            messages: formattedMessages,
            temperature: 0.8,
            max_tokens: 150
          })
        });

        if (orRes.ok) {
          const orData = await orRes.json();
          replyText = orData.choices?.[0]?.message?.content?.trim();
          if (replyText) {
            usedProvider = 'OpenRouter (Llama 3.2)';
            console.log(`[AI] OpenRouter reply generated successfully: "${replyText}"`);
          }
        } else {
          console.warn(`[AI] OpenRouter request failed with status: ${orRes.status}`);
        }
      } catch (err) {
        console.error('[AI] OpenRouter error:', err.message);
      }
    }

    // --- Provider 2: SiliconFlow (Fallback) ---
    if (!replyText && process.env.SILICONFLOW_API_KEY) {
      try {
        console.log('[AI] Attempting completion via SiliconFlow...');
        const sfRes = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'Qwen/Qwen2.5-7B-Instruct', // Use standard Qwen model on SiliconFlow
            messages: formattedMessages,
            temperature: 0.8,
            max_tokens: 150
          })
        });

        if (sfRes.ok) {
          const sfData = await sfRes.json();
          replyText = sfData.choices?.[0]?.message?.content?.trim();
          if (replyText) {
            usedProvider = 'SiliconFlow (Qwen 2.5)';
            console.log(`[AI] SiliconFlow reply generated successfully: "${replyText}"`);
          }
        } else {
          console.warn(`[AI] SiliconFlow failed with status: ${sfRes.status}`);
        }
      } catch (err) {
        console.error('[AI] SiliconFlow error:', err.message);
      }
    }

    // --- Provider 3: Local Ollama (Fallback) ---
    if (!replyText) {
      const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
      try {
        console.log(`[AI] Attempting local Ollama inference on ${ollamaUrl}...`);
        const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3.2', // Assumes llama3.2 is installed locally
            messages: formattedMessages,
            stream: false
          })
        });

        if (ollamaRes.ok) {
          const ollamaData = await ollamaRes.json();
          replyText = ollamaData.message?.content?.trim();
          if (replyText) {
            usedProvider = 'Local Ollama (Llama 3.2)';
            console.log(`[AI] Local Ollama reply generated successfully: "${replyText}"`);
          }
        } else {
          console.warn(`[AI] Local Ollama failed with status: ${ollamaRes.status}`);
        }
      } catch (err) {
        console.warn('[AI] Local Ollama is unreachable. Falling back to local heuristics.', err.message);
      }
    }

    // --- Provider 4: High Fidelity Simulated Fallback ---
    if (!replyText) {
      replyText = getMockFallback(personaId, lastUserMessage);
      usedProvider = 'Ditto Simulation (Offline Heuristics)';
      console.log(`[AI] Fallback reply selected: "${replyText}"`);
    }

    res.status(200).json({
      success: true,
      text: replyText,
      provider: usedProvider
    });
  } catch (err) {
    next(err);
  }
};
