import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import unzipper from 'unzipper';
import { Readable } from 'stream';

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload-model', upload.single('modelArchive'), (req, res) => {
    const { modelName, teamId, deviceId } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    if (typeof modelName !== 'string' || modelName.trim() === '') {
        return res.status(400).send('Invalid model name.');
    }

    const uploadPath = path.join('public', 'models', modelName);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const readableStream = Readable.from(file.buffer);
    readableStream
        .pipe(unzipper.Parse())
        .on('entry', (entry: unzipper.Entry) => {
            const fileName = entry.path;
            const filePath = path.join(uploadPath, fileName);
            entry.pipe(fs.createWriteStream(filePath));
        })
        .on('close', () => {
            res.send('File uploaded and extracted successfully.');
        });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
