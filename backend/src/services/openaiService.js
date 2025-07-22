const axios = require('axios');

exports.getAIResponse = async (message) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const payload = {
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
  };
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  const response = await axios.post(url, payload, { headers });
  return response.data.choices[0].message.content;
};
