import express from "express";
import cors from "cors";
const app = express();
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

app.get('/hello', (req, res) => {
    console.log("hello");

});

app.post('/trial1', upload.any(), (req, res) => {
    setTimeout(() => {
        // Print uploaded files

        res.json({
            message: 'Received form-data',
            fields: req.body,
            files: req.files.map(file => ({
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            }))
        });
    }, 10000); // 10 seconds timeout
});

app.post('/trial', upload.any(), (req, res) => {
    console.log("entered trial");
    setTimeout(() => {
        console.log('Fields:', req.body); // Print text fields
        console.log('Files:', req.files); // Print uploaded files

        res.json({
            message: 'Received form-data',
            fields: req.body,
            files: req.files.map(file => ({
                fieldname: file.fieldname,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size
            }))
        });
    },0); // 10 seconds timeout
});


app.post('/print', express.text(), (req, res) => {
    console.log("req param" + req.query.name);
    console.log(req.body);
    console.log("Headers: ", req.headers);
    res.send('Text received and printed' + req.body);
});

app.post('/printJson', express.text(), (req, res) => {
    console.log(req.body);
    res.send('Text received and printed' + req.body.name +req.body.age);
});
app.post('/upload', express.urlencoded({ extended: true }), (req, res) => {
    console.log("req param"+req.params);
    console.log(req.body);
    res.send('Form data received and printed: ' + JSON.stringify(req.body));
});

app.listen(3000,()=>{console.log("listening 3000")});