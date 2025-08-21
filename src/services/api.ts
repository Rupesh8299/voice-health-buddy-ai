// API service for health assistant backend integration

const API_BASE_URL = 'https://voice-health-buddy-ai-3m9x.vercel.app'; // Will be configured for your backend

// Define ChatMessage type for OpenRouter messages
export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export interface MessageRequest {
  message: string;
  conversationId?: string;
  history?: ChatMessage[];
}



export interface MessageResponse {
  reply: string;
  conversationId: string;
  suggestions?: string[];
}

export interface ImageUploadResponse {
  insights: string;
  analysis: string;
  recommendations?: string[];
}

// Send text message to health assistant
export const sendMessage = async (request: MessageRequest): Promise<MessageResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    // Mock response for development
    return {
      reply: "I understand you're experiencing symptoms. Can you provide more details about when this started and how severe it is?",
      conversationId: 'mock-conversation-id',
      suggestions: [
        "When did the symptoms start?",
        "How would you rate the severity (1-10)?",
        "Have you taken any medication?"
      ]
    };
  }
};

// Upload image for symptom analysis
export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    // Mock response for development
    return {
      insights: "I can see the area you're concerned about. This appears to be a skin condition.",
      analysis: "Based on the image, I recommend consulting with a healthcare professional for proper diagnosis.",
      recommendations: [
        "Schedule an appointment with a dermatologist",
        "Keep the area clean and dry",
        "Avoid scratching or picking at the area"
      ]
    };
  }
};

// Health check endpoint
export const healthCheck = async (): Promise<{ status: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'Service temporarily unavailable' };
  }
};