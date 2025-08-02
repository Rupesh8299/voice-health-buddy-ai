class MedicalPromptService {
  // Generate system prompt based on conversation state
  static generateSystemPrompt(conversationState, symptoms, questionCount, isRepetitive) {
    const basePrompt = "You are a professional medical assistant AI. ";
    
    switch (conversationState) {
      case 'initial':
        return basePrompt + 
          "Start by asking about the patient's main concern or primary symptoms. " +
          "Be warm but professional. Ask one clear question at a time.";
      
      case 'gathering':
        if (isRepetitive) {
          return basePrompt + 
            "The patient seems to be giving repetitive answers. " +
            "Try a different approach - ask more specific questions or " +
            "move towards providing recommendations based on what you know. " +
            "Don't keep asking the same type of questions.";
        }
        return basePrompt + 
          "Continue gathering symptom information. Ask specific, targeted questions " +
          "about duration, severity, triggers, and associated symptoms. " +
          "Be efficient - don't ask more than 2-3 more questions before moving to analysis.";
      
      case 'analyzing':
        return basePrompt + 
          "You have gathered sufficient information. Now provide a thoughtful analysis " +
          "and actionable recommendations. Include: " +
          "1) Possible conditions (be cautious, not diagnostic) " +
          "2) Recommended over-the-counter treatments " +
          "3) When to see a doctor " +
          "4) Warning signs to watch for " +
          "5) Home remedies that might help. " +
          "Be concise but comprehensive.";
      
      case 'recommending':
        return basePrompt + 
          "Provide final recommendations and follow-up advice. " +
          "Focus on next steps, when to seek medical attention, " +
          "and how to monitor symptoms. Be supportive and clear.";
      
      default:
        return basePrompt + 
          "Provide helpful medical guidance while being professional and cautious.";
    }
  }

  // Generate follow-up prompts to avoid repetition
  static generateFollowUpPrompt(symptoms, previousQuestions) {
    const questionTypes = [
      "timing and duration",
      "severity and intensity", 
      "triggers and patterns",
      "associated symptoms",
      "impact on daily activities",
      "previous treatments tried",
      "family history relevance",
      "recent changes or travel"
    ];
    
    // Filter out question types already covered
    const unusedTypes = questionTypes.filter(type => 
      !previousQuestions.some(q => q.toLowerCase().includes(type.split(' ')[0]))
    );
    
    if (unusedTypes.length > 0) {
      const nextType = unusedTypes[0];
      return `Focus your next question on ${nextType}. `;
    }
    
    return "Move towards providing recommendations based on the information gathered. ";
  }

  // Detect if AI should escalate to recommendations
  static shouldProvideRecommendations(conversationState, symptoms, questionCount, isRepetitive) {
    return conversationState === 'analyzing' || 
           conversationState === 'recommending' ||
           isRepetitive ||
           questionCount >= 5 ||
           Object.keys(symptoms).length >= 3;
  }
}

module.exports = MedicalPromptService;