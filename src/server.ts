import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import unzipper from 'unzipper';
import { Readable } from 'stream';
import mqtt from 'mqtt';

const app = express();
const port = 3000;

const client = mqtt.connect('ws://localhost:9001');

client.on('connect', () => {
    console.log('Connected to MQTT broker for publishing model updates.');
});

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

    if (typeof teamId !== 'string' || teamId.trim() === '') {
        return res.status(400).send('Invalid teamId.');
    }

    const modelDirectoryName = `${teamId}-${modelName}`;
    const uploadPath = path.join('public', 'models', modelDirectoryName);
    const relativePath = path.join('models', modelDirectoryName);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const extractedFiles: string[] = [];
    const readableStream = Readable.from(file.buffer);
    readableStream
        .pipe(unzipper.Parse())
        .on('entry', (entry: unzipper.Entry) => {
            const fileName = entry.path;
            extractedFiles.push(fileName);
            const filePath = path.join(uploadPath, fileName);
            entry.pipe(fs.createWriteStream(filePath));
        })
        .on('close', () => {
            const modelNodeId = `model-${modelName.toLowerCase().replace(/\s+/g, '-')}`;
            const absoluteModelPath = path.resolve(uploadPath);
            const uploadedAt = new Date().toISOString();
            const filesList = extractedFiles.join(',');

            const properties = ['path', 'relativePath', 'teamId', 'deviceId', 'uploadedAt', 'files'];

            client.publish(`homie/${teamId}/$nodes`, `info,${modelNodeId}`, { retain: true });

            client.publish(`homie/${teamId}/${modelNodeId}/$name`, modelName, { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/$properties`, properties.join(','), { retain: true });

            // Publish path property
            client.publish(`homie/${teamId}/${modelNodeId}/path`, absoluteModelPath, { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/path/$name`, "Absolute Path", { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/path/$datatype`, "string", { retain: true });

            // Publish relativePath property
            client.publish(`homie/${teamId}/${modelNodeId}/relativePath`, relativePath, { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/relativePath/$name`, "Relative Path", { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/relativePath/$datatype`, "string", { retain: true });

            // Publish teamId property
            client.publish(`homie/${teamId}/${modelNodeId}/teamId`, teamId, { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/teamId/$name`, "Team ID", { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/teamId/$datatype`, "string", { retain: true });

            // Publish deviceId property
            client.publish(`homie/${teamId}/${modelNodeId}/deviceId`, deviceId || '', { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/deviceId/$name`, "Device ID", { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/deviceId/$datatype`, "string", { retain: true });

            // Publish uploadedAt property
            client.publish(`homie/${teamId}/${modelNodeId}/uploadedAt`, uploadedAt, { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/uploadedAt/$name`, "Uploaded At", { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/uploadedAt/$datatype`, "string", { retain: true });

            // Publish files property
            client.publish(`homie/${teamId}/${modelNodeId}/files`, filesList, { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/files/$name`, "Files", { retain: true });
            client.publish(`homie/${teamId}/${modelNodeId}/files/$datatype`, "string", { retain: true });

            res.send('File uploaded and extracted successfully with extended info.');
        });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
