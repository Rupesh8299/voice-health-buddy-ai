const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const chatRoute = require('./routes/chatRoute');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const expectedFrontendPort = '8080';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log origin and port
app.use((req, res, next) => {
  const origin = req.headers.origin || 'unknown';
  let clientPort = 'unknown';

  try {
    const url = new URL(origin);
    clientPort = url.port || (url.protocol === 'https:' ? '443' : '80');
  } catch {}

  console.log(`Client connected from origin: ${origin} (client port: ${clientPort})`);
  console.log(`Server running on port: ${PORT}`);

  if (clientPort !== 'unknown' && clientPort !== expectedFrontendPort) {
    console.warn(`⚠️ Client port (${clientPort}) does not match expected frontend port (${expectedFrontendPort})`);
  } else {
    console.log('✅ Client and server ports match expected configuration.');
  }

  res.on('finish', () => {
    console.log(`Client disconnected: ${req.method} ${req.url}`);
  });

  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', chatRoute);
app.use('/api/upload', imageRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
