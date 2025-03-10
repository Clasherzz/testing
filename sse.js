const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/sse", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Custom-Header", "MyCustomHeaderValue"); // Custom header

    res.write(`: This is a comment, ignored by SSE clients\n`); // Comment

    // Send a standard event
    res.write("event: message\n");
    res.write("data: Hello, SSE Client!\n\n");

    // Send a custom event with extra fields
    res.write(`custom-field1: secretKey123\n`);
    res.write(`custom-field2: userID=42\n`);
    res.write("event: notification\n");
    res.write("data: New message received!\n\n");

    // Keep sending events every 5 seconds
    setInterval(() => {
        res.write(`: Keep-alive comment\n`);
        res.write("event: heartbeat\n");
        res.write(`custom-field3: sessionID=9876\n`);
        res.write("data: Server is still running!\n\n");
    }, 5000);

    req.on("close", () => {
        console.log("SSE Client Disconnected");
        res.end();
    });
});

app.listen(3000, () => console.log("SSE Server running on http://localhost:3000/sse"));
