# Voice Health Buddy AI

A full-stack AI-powered assistant for analyzing symptom images and providing health-related chat support.

## 🗂 Project Structure

```
voice-health-buddy-ai/
│
├── backend/         # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── .env
│   └── ...
│
├── src/             # Frontend (React + Vite + TypeScript)
│   ├── components/
│   ├── pages/
│   └── ...
│
├── README.md
└── ...
```

## 🚀 Features

- **Image Analysis:** Upload symptom images and get AI-powered analysis using Google MedGemma (Vertex AI).
- **Chat Assistant:** Chat with an AI for health-related queries (OpenAI or OpenRouter).
- **Multi-media Upload:** (Optional) Upload multiple images/videos or stream live video.
- **Modern UI:** Built with React, TypeScript, Tailwind CSS, and shadcn-ui.

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js (v18+ recommended)
- npm
- Google Cloud account with Vertex AI enabled
- Service account key (`gcp-key.json`) with Vertex AI permissions

### 2. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd voice-health-buddy-ai
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```
PORT=5000
OPENROUTER_API_KEY=your_openrouter_key
GOOGLE_APPLICATION_CREDENTIALS=./gcp-key.json
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
```

Place your `gcp-key.json` in the `/backend` directory.

Start the backend server:

```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd ..
npm install
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a5f6ded9-2cd1-481e-aba2-29bda34a6386) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
