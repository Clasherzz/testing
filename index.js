const fs = require('fs');
const https = require('https');
const express = require('express');
const multer = require('multer');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// Configure multer to handle form-data uploads
const upload = multer({ storage: multer.memoryStorage() });
app.use(express.json());
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


// Define a simple schema and resolver
const schema = buildSchema(`
  type Query {
    placeholder: String
  }
`);

const root = {
  placeholder: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('This is a delayed response');
      }, 60000); // 1 minute delay
    });
  },
};

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


app.post('/upload', (req, res) => {
  try {
    const contentType = req.headers['content-type'];
    console.log(contentType)
    let response = {};

    if (contentType.includes('multipart/form-data')) {
      // Handle multipart/form-data
      upload.single('file')(req, res, (err) => {
        if (err) {
          console.error('Upload error:', err);
          return res.status(400).json({ error: 'Error uploading file' });
        }

        const field1 = req.body.field1;
        const field2 = req.body.field2;
        const uploadedFile = req.file;

        console.log('Field 1:', field1);
        console.log('Field 2:', field2);
        console.log('Uploaded File:', uploadedFile);

        response = {
          message: 'Multipart file uploaded successfully!',
          file: uploadedFile,
          fields: { field1, field2 },
        };

        return res.status(200).json(response);
      });
    } else if (contentType.includes('application/json')) {
      // Handle JSON payload
      console.log(req.body);
      // console.log('Field 1:', field1);
      // console.log('Field 2:', field2);
      // console.log('Additional Data:', additionalData);

      // response = {
      //   message: 'JSON data processed successfully!',
      //   data: { field1, field2, additionalData },
      // };

     // return res.status(200).json(response);
    } else {
      // Unsupported content type
      console.error('Unsupported content type:', contentType);
      return res.status(400).json({ error: 'Unsupported content type' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to process the request' });
  }
});

// Self-signed certificate (ensure you have `key.pem` and `cert.pem` files)
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');

// HTTPS server options
// const httpsOptions = {
//   key: privateKey,
//   cert: certificate,
// };

// // Create the HTTPS server
// const httpsServer = https.createServer(httpsOptions, app);

// Start the HTTPS server
const PORT = 3443;
app.listen(PORT, () => {
  console.log(`Self-signed HTTPS server running at https://localhost:${PORT}`);
});
