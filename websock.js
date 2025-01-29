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
wss.on('connection', (ws, req) => {
    console.log('Client connected');
    console.log('Request headers:', req.headers);
    console.log('Request params:', req.url);

    ws.send("Hi");
    // Handle incoming messages
    ws.on('message', (message) => {
        console.log('Received:', message);

        // Echo the same message back
        ws.send(message + "Send");
        // Send the message as a byte frame
        const byteFrame = Buffer.from(message);
        ws.send(byteFrame);
    });

    ws.on('ping', () => {
        console.log(`Ping received at: ${new Date().toLocaleTimeString()}`);
    });

    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
            console.log("ping send");
        }
    ws.send(JSON.stringify({ header: 'Custom Header', timestamp: new Date().toISOString() }));
    }, 30000);

    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(pingInterval);
    });

    // Optional: Send a welcome message on connection
    ws.send('Welcome to the WebSocket echo server!');
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running at localhost:${port}`);
});
