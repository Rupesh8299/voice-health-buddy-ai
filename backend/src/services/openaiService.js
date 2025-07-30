const axios = require('axios');

exports.getAIResponse = async ({ model, systemPrompt, history }) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push(...history);

  const payload = {
    model: model || 'openai/gpt-3.5-turbo', // Default model if not provided
    messages,
  };

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000', // Use an env var for this
    'X-Title': 'Voice Health Buddy',
  };

  try {
    console.log(`📡 Sending request to OpenRouter with model ${payload.model}...`);
    const response = await axios.post(url, payload, { headers });

    console.log("✅ OpenRouter response received.");
    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    }
    return 'No response from AI.';
  } catch (error) {
    console.error("❌ OpenRouter API error:", error.message);

    if (error.response) {
      console.error("📄 Error details:", error.response.data);
    }

    return 'Unable to get a response from the AI service at the moment.';
  }
};
