const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Create an HTTP server to attach the WebSocket server
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send("Hi");
    // Handle incoming messages
    ws.on('message', (message) => {
        console.log('Received:', message);

        // Echo the same message back
        ws.send(message);
    });

    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Optional: Send a welcome message on connection
    ws.send('Welcome to the WebSocket echo server!');
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
