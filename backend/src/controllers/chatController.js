const { getAIResponse } = require('../services/openaiService');

exports.handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const reply = await getAIResponse(message);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
