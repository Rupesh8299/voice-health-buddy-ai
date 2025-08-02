const { v4: uuidv4 } = require('uuid');

// In-memory storage for conversations (replace with MongoDB in production)
const conversations = new Map();

class ConversationService {
  constructor() {
    this.conversations = conversations;
  }

  // Create or get existing conversation
  getConversation(conversationId) {
    if (!conversationId) {
      conversationId = uuidv4();
    }
    
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, {
        id: conversationId,
        messages: [],
        questionsAsked: new Set(),
        repetitiveAnswers: new Map(),
        symptomsCollected: {},
        conversationState: 'initial', // initial, gathering, analyzing, recommending
        lastActivity: Date.now()
      });
    }
    
    return this.conversations.get(conversationId);
  }

  // Add message to conversation history
  addMessage(conversationId, role, content) {
    const conversation = this.getConversation(conversationId);
    conversation.messages.push({
      role,
      content,
      timestamp: Date.now()
    });
    conversation.lastActivity = Date.now();
    return conversation;
  }

  // Check for repetitive answers
  checkRepetition(conversationId, userMessage) {
    const conversation = this.getConversation(conversationId);
    const normalizedMessage = userMessage.toLowerCase().trim();
    
    // Count how many times user has given similar response
    const count = conversation.repetitiveAnswers.get(normalizedMessage) || 0;
    conversation.repetitiveAnswers.set(normalizedMessage, count + 1);
    
    return count >= 2; // Return true if repeated 3+ times
  }

  // Update conversation state based on progress
  updateConversationState(conversationId, symptoms, questionCount) {
    const conversation = this.getConversation(conversationId);
    
    if (questionCount >= 5 || Object.keys(symptoms).length >= 3) {
      conversation.conversationState = 'analyzing';
    } else if (Object.keys(symptoms).length > 0) {
      conversation.conversationState = 'gathering';
    }
    
    return conversation.conversationState;
  }

  // Extract symptoms from conversation
  extractSymptoms(conversationId) {
    const conversation = this.getConversation(conversationId);
    const symptoms = {};
    
    // Simple keyword extraction (enhance with NLP in production)
    const symptomKeywords = {
      'fever': ['fever', 'temperature', 'hot', 'burning'],
      'headache': ['headache', 'head pain', 'migraine'],
      'throat': ['sore throat', 'throat pain', 'swallowing'],
      'cough': ['cough', 'coughing', 'chest'],
      'nausea': ['nausea', 'vomiting', 'sick', 'stomach'],
      'fatigue': ['tired', 'exhausted', 'weak', 'fatigue'],
      'pain': ['pain', 'ache', 'hurt', 'sore']
    };
    
    const allMessages = conversation.messages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content.toLowerCase())
      .join(' ');
    
    for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
      for (const keyword of keywords) {
        if (allMessages.includes(keyword)) {
          symptoms[symptom] = true;
          break;
        }
      }
    }
    
    conversation.symptomsCollected = symptoms;
    return symptoms;
  }

  // Determine if conversation should escalate to recommendations
  shouldEscalateToRecommendations(conversationId, userMessage) {
    const conversation = this.getConversation(conversationId);
    const isRepetitive = this.checkRepetition(conversationId, userMessage);
    const symptoms = this.extractSymptoms(conversationId);
    const questionCount = conversation.messages.filter(msg => 
      msg.role === 'assistant' && msg.content.includes('?')
    ).length;
    
    // Escalate if:
    // 1. User is being repetitive
    // 2. Enough questions have been asked (5+)
    // 3. Clear symptoms are identified
    return isRepetitive || 
           questionCount >= 5 || 
           Object.keys(symptoms).length >= 3;
  }

  // Generate medical recommendations based on symptoms
  generateRecommendations(symptoms) {
    const recommendations = {
      medications: [],
      specialists: [],
      urgency: 'low',
      homeRemedies: [],
      redFlags: []
    };

    // Basic recommendation logic (enhance with medical APIs)
    if (symptoms.fever && symptoms.throat) {
      recommendations.medications.push('Paracetamol for fever', 'Throat lozenges');
      recommendations.specialists.push('ENT specialist');
      recommendations.urgency = 'moderate';
      recommendations.homeRemedies.push('Warm salt water gargling', 'Stay hydrated');
      recommendations.redFlags.push('Difficulty swallowing', 'High fever over 39°C');
    }
    
    if (symptoms.headache && symptoms.fever) {
      recommendations.medications.push('Ibuprofen', 'Rest in dark room');
      recommendations.specialists.push('General practitioner');
      recommendations.urgency = 'moderate';
      recommendations.homeRemedies.push('Cold compress', 'Adequate sleep');
    }
    
    if (symptoms.cough) {
      recommendations.medications.push('Cough syrup', 'Honey and warm water');
      recommendations.specialists.push('Pulmonologist if persistent');
      recommendations.homeRemedies.push('Steam inhalation', 'Warm liquids');
    }

    // Set urgency based on symptom combinations
    if (Object.keys(symptoms).length >= 4) {
      recommendations.urgency = 'high';
    } else if (Object.keys(symptoms).length >= 2) {
      recommendations.urgency = 'moderate';
    }

    return recommendations;
  }

  // Clean up old conversations (call periodically)
  cleanupOldConversations() {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    for (const [id, conversation] of this.conversations.entries()) {
      if (conversation.lastActivity < cutoffTime) {
        this.conversations.delete(id);
      }
    }
  }
}

module.exports = new ConversationService();