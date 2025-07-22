# Voice-Based Health Assistant - Backend Integration Guide

## Current UI Implementation Status

### ✅ Completed Frontend Features

#### 1. **Real-time Voice Conversation**
- **Component**: `ContinuousVoiceRecorder`
- **Features**: 
  - Continuous speech recognition
  - Auto-sends transcripts when user stops speaking
  - Toggle conversation mode for hands-free interaction
  - Voice activity detection
- **Browser API**: Uses Web Speech API (`webkitSpeechRecognition`)

#### 2. **Text-to-Speech Responses**
- **Component**: `TextToSpeech`
- **Features**:
  - Automatically speaks AI responses in conversation mode
  - Voice controls (play/pause/stop)
  - Speaking state management
- **Browser API**: Uses Web Speech API (`speechSynthesis`)

#### 3. **Multi-Media Upload System**
- **Component**: `MultiMediaUpload`
- **Features**:
  - Multiple image uploads (up to 5 files)
  - Video file uploads
  - Live video streaming (camera access)
  - Drag & drop support
  - File preview and management
- **File Types**: Images (jpg, png, gif, webp), Videos (mp4, mov, avi)

#### 4. **Chat Interface**
- **Component**: `ChatInterface`
- **Features**:
  - Message history display
  - Media message support
  - Auto-scroll to latest messages
  - Loading states
  - Text-to-speech integration

#### 5. **Complete Health Assistant Page**
- **Page**: `HealthAssistant`
- **Features**:
  - Integrated voice + media + chat
  - Real-time conversation management
  - Session state management
  - Professional medical UI design

---

## Backend Requirements & API Specifications

### 🔧 Required API Endpoints

#### 1. **POST `/api/message`**
**Purpose**: Handle text/voice message processing

```json
// Request
{
  "message": "I have chest pain and shortness of breath",
  "conversationId": "unique-session-id"
}

// Response
{
  "reply": "I understand you're experiencing chest pain and shortness of breath. How long have you been experiencing these symptoms?",
  "conversationId": "unique-session-id",
  "suggestions": [
    "When did the pain start?",
    "Rate the pain from 1-10",
    "Any other symptoms?"
  ]
}
```

#### 2. **POST `/api/upload-image`**
**Purpose**: Analyze uploaded images for visible symptoms

```json
// Request: Multipart form data
// - file: image file
// - conversationId: session ID

// Response
{
  "insights": "The image shows signs of a rash on the forearm. The affected area appears red and slightly raised.",
  "recommendations": [
    "Keep the area clean and dry",
    "Avoid scratching the affected area",
    "Consider applying a cool compress"
  ],
  "conversationId": "unique-session-id"
}
```

#### 3. **POST `/api/upload-video`** (Future)
**Purpose**: Analyze video content for symptoms

```json
// Request: Multipart form data
// - file: video file
// - conversationId: session ID

// Response
{
  "insights": "Video analysis shows irregular movement patterns that may indicate coordination issues.",
  "recommendations": [
    "Document when these episodes occur",
    "Note any triggers or patterns"
  ],
  "conversationId": "unique-session-id"
}
```

#### 4. **POST `/api/live-video-stream`** (Future)
**Purpose**: Handle real-time video streaming for live analysis

```json
// WebSocket or Server-Sent Events implementation
// Real-time video frame analysis
```

---

## Current Frontend Integration Points

### 📁 File: `src/services/api.ts`

```typescript
// Current implementation with mock responses
export const sendMessage = async (data: {
  message: string;
  conversationId: string;
}) => {
  const response = await fetch('/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};
```

---

## Backend Architecture Recommendations

### 🏗️ Suggested Tech Stack

#### **Option 1: Node.js + Express**
```bash
npm install express multer cors helmet
npm install @google-cloud/speech @google-cloud/vision
npm install openai # or any AI service
```

#### **Option 2: Python + FastAPI**
```bash
pip install fastapi uvicorn python-multipart
pip install openai google-cloud-vision google-cloud-speech
pip install opencv-python pillow
```

#### **Option 3: Supabase + Edge Functions**
- Built-in file storage
- PostgreSQL database
- Real-time subscriptions
- Edge functions for AI processing

### 🗄️ Database Schema

```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  content TEXT NOT NULL,
  sender VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'video'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Media files table
CREATE TABLE media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id),
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  analysis_result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Integration Steps

### 🔄 Phase 1: Basic Text Chat
1. Implement `/api/message` endpoint
2. Connect to AI service (OpenAI, Claude, etc.)
3. Test with existing frontend
4. Add conversation persistence

### 🔄 Phase 2: Image Analysis
1. Implement `/api/upload-image` endpoint
2. Add file storage (AWS S3, Cloudinary, etc.)
3. Integrate medical image analysis AI
4. Test multi-image uploads

### 🔄 Phase 3: Video & Real-time Features
1. Implement video upload processing
2. Add WebSocket for live video streaming
3. Real-time AI analysis
4. Performance optimization

---

## Environment Variables Needed

```env
# AI Service
OPENAI_API_KEY=your-openai-key
# or
ANTHROPIC_API_KEY=your-anthropic-key

# File Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=your-bucket

# Database
DATABASE_URL=your-database-url

# Optional: Medical APIs
MEDICAL_API_KEY=your-medical-service-key
```

---

## Testing the Integration

### 🧪 Frontend Testing Points

1. **Voice Input**: Speak into mic → should call `/api/message`
2. **Image Upload**: Select multiple images → should call `/api/upload-image`
3. **Conversation Flow**: Multi-turn conversation with session persistence
4. **Live Video**: Enable camera → should establish streaming connection

### 🧪 Backend Testing Checklist

- [ ] `/api/message` returns structured responses
- [ ] `/api/upload-image` processes multiple files
- [ ] CORS enabled for frontend domain
- [ ] File upload size limits configured
- [ ] Error handling for invalid inputs
- [ ] Rate limiting implemented

---

## Current Mock Data (Remove After Backend Integration)

The frontend currently uses mock responses. Replace these in `src/services/api.ts`:

```typescript
// REMOVE THESE MOCK RESPONSES AFTER BACKEND INTEGRATION
const mockResponses = [
  "I understand your concern. Can you tell me more about when these symptoms started?",
  "Based on what you've described, I'd like to ask a few more questions...",
  // ... other mock responses
];
```

---

## Security Considerations

1. **Input Validation**: Sanitize all user inputs
2. **File Validation**: Check file types, sizes, and scan for malware
3. **Rate Limiting**: Prevent API abuse
4. **HIPAA Compliance**: If handling real medical data
5. **Session Management**: Secure conversation IDs
6. **CORS Configuration**: Restrict to your domain

---

## Performance Optimization

1. **Image Compression**: Compress images before processing
2. **Caching**: Cache AI responses for common queries
3. **Streaming**: Use streaming responses for long AI outputs
4. **CDN**: Use CDN for static assets and media files
5. **Load Balancing**: Handle concurrent users

---

*Generated for Voice-Based Health Assistant | January 2025*
*Frontend Implementation Status: Complete | Backend Integration: Pending*
