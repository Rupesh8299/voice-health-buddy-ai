const express = require('express');
const axios = require('axios');
const router = express.Router();

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
      ...messages
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

// New endpoint: POST /api/message
router.post('/message', async (req, res) => {
  const { message, conversationId } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message' });
  }
  // Optionally validate conversationId

  const payload = {
    model: 'openai/gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          "You are a helpful medical assistant. Ask detailed follow-up questions like a professional doctor before suggesting a diagnosis. Be clinical, professional, and cautious. Do not guess or give final diagnosis without enough info.",
      },
      {
        role: 'user',
        content: message,
      }
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

    // Simple suggestion extraction (mock): extract questions from reply
    const suggestions = [];
    const lines = reply.split('\n');
    for (const line of lines) {
      if (line.trim().endsWith('?')) {
        suggestions.push(line.trim());
      }
    }
    // If no suggestions found, add generic ones
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
      suggestions
    });
  } catch (err) {
    console.error('❌ GPT error:', err.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

module.exports = router;
