const fs = require('fs');
const https = require('https');
const express = require('express');
const multer = require('multer');

const app = express();

// Configure multer to handle form-data uploads
const upload = multer({ storage: multer.memoryStorage() });

// GET endpoint for basic testing
app.get('/', (req, res) => {
  res.send('This is a self-signed SSL endpoint!');
});

// POST endpoint to handle form-data
app.post('/submit-form', upload.single('file'), (req, res) => {
  const { field1, field2 } = req.body; // Other form-data fields
  const file = req.file; // Uploaded file

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  res.json({
    success: true,
    message: 'Form-data received!',
    data: {
      field1,
      field2,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    },
  });
});


app.post('/upload', upload.single('file'), (req, res) => {
  try {
    // Access form fields
    const field1 = req.body.field1;
    const field2 = req.body.field2;

    // Access the uploaded file
    const uploadedFile = req.file;

    console.log('Field 1:', field1);
    console.log('Field 2:', field2);
    console.log('Uploaded File:', uploadedFile);

    // Respond to the client
    res.status(200).json({
      message: 'File uploaded successfully!',
      file: uploadedFile,
      fields: { field1, field2 },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process the request' });
  }
});

// Self-signed certificate (ensure you have `key.pem` and `cert.pem` files)
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

// HTTPS server options
const httpsOptions = {
  key: privateKey,
  cert: certificate,
};

// Create the HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

// Start the HTTPS server
const PORT = 3443;
httpsServer.listen(PORT, () => {
  console.log(`Self-signed HTTPS server running at https://localhost:${PORT}`);
});
