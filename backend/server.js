const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to log HTTP requests
app.use((req, res, next) => {
  console.log(`Client connected: ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`Client disconnected: ${req.method} ${req.url}`);
  });
  next();
});

// If using WebSocket (example with ws library):
/*
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('WebSocket client connected');
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});