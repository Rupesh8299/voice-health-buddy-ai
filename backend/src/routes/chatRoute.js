const express = require('express');
const axios = require('axios');
const conversationService = require('../services/conversationService');
const MedicalPromptService = require('../services/medicalPromptService');
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

// POST /api/message - Enhanced conversation flow with memory and escalation
router.post('/message', async (req, res) => {
  const { message, conversationId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid message' });
  }

  try {
    // Get or create conversation
    const conversation = conversationService.getConversation(conversationId);
    const actualConversationId = conversation.id;
    
    // Add user message to conversation history
    conversationService.addMessage(actualConversationId, 'user', message);
    
    // Check for repetitive behavior
    const isRepetitive = conversationService.checkRepetition(actualConversationId, message);
    
    // Extract symptoms and update conversation state
    const symptoms = conversationService.extractSymptoms(actualConversationId);
    const questionCount = conversation.messages.filter(msg => 
      msg.role === 'assistant' && msg.content.includes('?')
    ).length;
    
    const conversationState = conversationService.updateConversationState(
      actualConversationId, symptoms, questionCount
    );
    
    // Generate appropriate system prompt
    const systemPrompt = MedicalPromptService.generateSystemPrompt(
      conversationState, symptoms, questionCount, isRepetitive
    );
    
    // Check if should escalate to recommendations
    const shouldEscalate = conversationService.shouldEscalateToRecommendations(
      actualConversationId, message
    );
    
    let enhancedPrompt = systemPrompt;
    if (shouldEscalate) {
      const recommendations = conversationService.generateRecommendations(symptoms);
      enhancedPrompt += `\n\nBased on the symptoms collected (${Object.keys(symptoms).join(', ')}), ` +
        `provide specific recommendations including: ` +
        `OTC medications, specialists to consult, urgency level (${recommendations.urgency}), ` +
        `and home remedies. Be practical and actionable.`;
    }

    const payload = {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: enhancedPrompt,
        },
        ...conversation.messages.slice(-6), // Use last 6 messages for context
      ],
    };

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
    
    // Add assistant response to conversation
    conversationService.addMessage(actualConversationId, 'assistant', reply);

    // Generate intelligent follow-up suggestions
    let suggestions = [];
    if (!shouldEscalate) {
      // Extract questions from reply
      const lines = reply.split('\n');
      for (const line of lines) {
        if (line.trim().endsWith('?')) {
          suggestions.push(line.trim());
        }
      }
      
      // Add contextual suggestions if none found
      if (suggestions.length === 0) {
        if (Object.keys(symptoms).length === 0) {
          suggestions = [
            "What are your main symptoms?",
            "When did this start?",
            "How severe is it on a scale of 1-10?"
          ];
        } else {
          suggestions = [
            "Are there any other symptoms?",
            "How long have you had these symptoms?",
            "What makes it better or worse?"
          ];
        }
      }
    } else {
      // Provide final action suggestions when escalating
      suggestions = [
        "Should I see a doctor soon?",
        "What can I do at home?",
        "Are there warning signs to watch for?"
      ];
    }

    res.json({
      reply,
      conversationId: actualConversationId,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      symptoms: Object.keys(symptoms),
      conversationState,
      shouldEscalate
    });
  } catch (err) {
    console.error('❌ Enhanced conversation error:', err.message);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

module.exports = router;
