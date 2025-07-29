const axios = require('axios');

exports.getAIResponse = async ({ history }) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const url = 'https://openrouter.ai/api/v1/chat/completions';

  const payload = {
    model: 'gpt-4', // You can also try: 'mistralai/mistral-7b-instruct:free' to test quickly
    messages: [
      {
        role: 'system',
        content: `You are a cautious and professional medical AI assistant. Ask only one or two follow-up questions at a time. Proceed step-by-step like a real doctor. Be polite, empathetic, and avoid early diagnosis.`,
      },
      ...history,
    ],
  };

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:3000', // Update if needed
    'X-Title': 'Voice Health Buddy',
  };

  try {
    console.log("📡 Sending request to OpenRouter...");
    const response = await axios.post(url, payload, { headers });

    console.log("✅ OpenRouter response received.");
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenRouter API error:", error.message);

    if (error.response) {
      console.error("📄 Error details:", error.response.data);
    }

    return 'Unable to get a response from GPT at the moment.';
  }
};
