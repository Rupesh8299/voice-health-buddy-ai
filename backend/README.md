# Voice-Based Health Assistant Backend

## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env` and fill in your API keys for OpenRouter, Replicate, and Infermedica.
3. **Run the server (development):**
   ```sh
   npm run dev
   ```
4. **Run the server (production):**
   ```sh
   npm start
   ```

## API Endpoints

- `POST /api/chat` — Send user message, receive AI-generated response (OpenRouter/ChatGPT)

Other endpoints (`/api/image`, `/api/symptom-check`) are planned for future integration.

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
