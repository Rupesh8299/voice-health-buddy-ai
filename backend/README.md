# Voice-Based Health Assistant Backend

## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env` and fill in your API keys for OpenRouter and set up your GCP credentials.
3. **Run the server (development):**
   ```sh
   npm run dev
   ```
4. **Run the server (production):**
   ```sh
   npm start
   ```

## API Endpoints

- `POST /api/message` — Send user message, receive AI-generated response (OpenRouter/ChatGPT)
- `POST /api/analyze-image` — Upload and analyze medical images using MedGemma and GPT

## Folder Structure

```
src/
  routes/
  controllers/
  services/
  utils/
  server.js
uploads/
.env
```
