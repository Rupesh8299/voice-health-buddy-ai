# Welcome you to Voice Health Buddy AI project

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
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

# Voice Health Buddy AI

A full-stack AI-powered assistant for analyzing symptom images and providing health-related chat support.

---

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

---

## 🚀 Features

- **Image Analysis:** Upload symptom images and get AI-powered analysis using Google MedGemma (Vertex AI).
- **Chat Assistant:** Chat with an AI for health-related queries (OpenAI or OpenRouter).
- **Multi-media Upload:** (Optional) Upload multiple images/videos or stream live video.
- **Modern UI:** Built with React, TypeScript, Tailwind CSS, and shadcn-ui.

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- Google Cloud account with Vertex AI enabled
- Service account key (`gcp-key.json`) with Vertex AI permissions

### 2. Clone the Repository

```sh
git clone <YOUR_GIT_URL>
cd voice-health-buddy-ai
```

### 3. Backend Setup

```sh
cd backend
npm install
```

- Create a `.env` file in `/backend`:

  ```
  PORT=5000
  OPENROUTER_API_KEY=your_openrouter_key
  GOOGLE_APPLICATION_CREDENTIALS=./gcp-key.json
  GOOGLE_CLOUD_PROJECT=your_gcp_project_id
  ```

- Place your `gcp-key.json` in the `/backend` directory.

- Start the backend server:

  ```sh
  npm run dev
  ```

### 4. Frontend Setup

```sh
cd ..
npm install
npm run dev
```

- The frontend will run on [http://localhost:8080](http://localhost:8080) by default.

---

## 🧠 How It Works

1. **Image Upload:**  
   User uploads an image via the UI.  
   The frontend sends a `POST` request to `/api/analyze-image` with the image.

2. **Backend Processing:**  
   The backend receives the image, passes it to Google Vertex AI MedGemma, and returns the analysis.

3. **Chat:**  
   User can chat with the AI assistant via `/api/message`.

---

## 🔑 Environment Variables

| Variable                         | Description                          |
| -------------------------------- | ------------------------------------ |
| `PORT`                           | Backend server port                  |
| `OPENROUTER_API_KEY`             | API key for OpenRouter/OpenAI        |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to your GCP service account key |
| `GOOGLE_CLOUD_PROJECT`           | Your Google Cloud project ID         |

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend:** Node.js, Express, Google Vertex AI, OpenAI/OpenRouter
- **AI Models:** MedGemma (Vertex AI), GPT (OpenAI/OpenRouter)

---

## 📝 Development Tips

- **Image Upload Endpoint:**  
  Always use `/api/analyze-image` for image analysis.
- **Chat Endpoint:**  
  Use `/api/message` for chat queries.
- **Logs:**  
  Backend logs requests and AI responses for debugging.
- **CORS:**  
  The backend is CORS-enabled for local development.

---

## 🧪 Testing

- Use the UI to upload images and chat.
- Check backend logs for request flow and errors.
- Use dummy data in `medgemmaService.js` if you want to test without calling Vertex AI.

---

## 🌐 Deployment

- Deploy backend and frontend separately or together.
- For custom domains or cloud deployment, update environment variables accordingly.

---

## 📄 License

MIT (or your preferred license)

---

## 🙋‍♂️ Support

For issues or feature requests, open an issue on GitHub or contact the maintainer.
