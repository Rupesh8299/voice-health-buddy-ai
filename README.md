Voice Health Buddy AI

A full-stack AI-powered assistant that lets users upload symptom images and receive intelligent health-related insights and chat support.

🧰 Technologies Used
- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn-ui
- Backend: Node.js, Express, Google Vertex AI, OpenAI/OpenRouter
- AI Models: Google MedGemma (Vertex AI), GPT (via OpenAI or OpenRouter)

🗂 Project Structure
voice-health-buddy-ai/
├── backend/         # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env
│   └── ...
├── src/             # Frontend (React + Vite + TypeScript)
│   ├── components/
│   ├── pages/
│   └── ...
├── README.md
└── ...

⚙️ Setup Instructions

1. Prerequisites
- Node.js (v18+ recommended)
- npm
- Google Cloud account with Vertex AI enabled
- A service account key JSON (gcp-key.json) with Vertex AI permissions

2. Clone and Run the Project Locally
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd voice-health-buddy-ai

3. Backend Setup
cd backend
npm install

Create a .env file in /backend:
PORT=5000
OPENROUTER_API_KEY=your_openrouter_key
GOOGLE_APPLICATION_CREDENTIALS=./gcp-key.json
GOOGLE_CLOUD_PROJECT=your_gcp_project_id

Place your gcp-key.json file in the backend/ directory.

Start the backend server:
npm run dev

4. Frontend Setup
cd ..
npm install
npm run dev

Frontend will be live at: http://localhost:8080

🧠 How It Works

Image Upload:
- User uploads an image via the UI.
- Frontend sends a POST request to /api/analyze-image.
- Backend uses Google MedGemma (Vertex AI) to analyze and returns results.

Chat Assistant:
- User sends a message to /api/message.
- Backend uses OpenAI/OpenRouter to generate health advice.

🔑 Environment Variables
PORT: Backend server port
OPENROUTER_API_KEY: API key for OpenRouter/OpenAI
GOOGLE_APPLICATION_CREDENTIALS: Path to GCP service account key (gcp-key.json)
GOOGLE_CLOUD_PROJECT: Your Google Cloud project ID

🧪 Testing & Debugging
- Upload test images via UI.
- Monitor terminal for logs (console.log) to trace flow.
- You can hardcode dummy responses in medgemmaService.js for testing offline.

🌐 Deployment
You can deploy the backend and frontend together or separately.
Examples: Vercel (frontend), Render / Railway / Cloud Run (backend).

📝 License
MIT (or your preferred license)

🙋‍♂️ Support
Open a GitHub issue or contact the repository maintainer for help.
