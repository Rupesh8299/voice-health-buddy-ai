const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoute = require('./routes/chatRoute');
const imageRoutes = require('./routes/imageRoute');
const { startCleanupJob } = require('./utils/cleanup');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Move logging middleware above routes ---
app.use((req, res, next) => {
  console.log(`➡️  Incoming request: ${req.method} ${req.url}`);
  const origin = req.headers.origin || 'unknown';
  const expectedFrontendPort = '8080';
  const serverPort = PORT.toString();

  // Extract port from origin if present
  let clientPort = 'unknown';
  try {
    const url = new URL(origin);
    clientPort = url.port || (url.protocol === 'https:' ? '443' : '80');
  } catch {
    // origin may be missing or malformed
  }

  console.log(`Client connected from origin: ${origin} (client port: ${clientPort})`);
  console.log(`Server running on port: ${serverPort}`);

  if (clientPort !== 'unknown' && clientPort !== expectedFrontendPort) {
    console.warn(`⚠️ Client port (${clientPort}) does not match expected frontend port (${expectedFrontendPort})`);
  } else if (clientPort === expectedFrontendPort) {
    console.log('✅ Client and server ports match expected configuration.');
  }

  res.on('finish', () => {
    console.log(`Client disconnected: ${req.method} ${req.url}`);
  });

  next();
});

app.use('/api', chatRoute);
app.use('/api/upload', imageRoutes);


app.get('/', (req, res) => {
  res.send('Voice-Based Health Assistant Backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start cleanup job for conversation memory
  startCleanupJob();
  console.log('🧹 Conversation cleanup job started');
});
