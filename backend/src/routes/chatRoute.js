const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/chat - For general chat with history
router.post('/chat', async (req, res) => {
  console.log('Received POST /chat');
  console.log('Request body:', req.body);

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid message history' });
  }

  const payload = {
    model: 'openai/gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          "You are a helpful medical assistant. Ask detailed follow-up questions like a professional doctor before suggesting a diagnosis. Be clinical, professional, and cautious. Do not guess or give final diagnosis without enough info.",
      },
      ...messages,
    ],
  };
  console.log('Sending to OpenRouter:', payload);

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Voice Health Buddy',
        },
      }
    );

    console.log('✅ OpenRouter reply:', response.data);

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('❌ GPT error:', err.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

// POST /api/message - For message-by-message flow with suggestions
router.post('/message', async (req, res) => {
  const { message, conversationId, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message' });
  }

  const payload = {
    model: 'openai/gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          "You are a helpful and professional medical assistant. Ask only one or two follow-up questions at a time, like a real doctor having a conversation. Be clinical, cautious, and do not jump to conclusions or diagnosis without enough information. Continue the conversation step by step based on the user's responses.",
      },
      ...(history || []),
      {
        role: 'user',
        content: message,
      },
    ],
  };

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Voice Health Buddy',
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // Extract suggested follow-up questions
    const suggestions = [];
    const lines = reply.split('\n');
    for (const line of lines) {
      if (line.trim().endsWith('?')) {
        suggestions.push(line.trim());
      }
    }
    if (suggestions.length === 0) {
      suggestions.push(
        "Can you describe your symptoms in more detail?",
        "When did these symptoms start?",
        "Are there any other symptoms?"
      );
    }

    res.json({
      reply,
      conversationId,
      suggestions,
    });
  } catch (err) {
    console.error('❌ GPT error:', err.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

module.exports = router;
