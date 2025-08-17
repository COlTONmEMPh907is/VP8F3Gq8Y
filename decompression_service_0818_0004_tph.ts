// 代码生成时间: 2025-08-18 00:04:07
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { Request, Response } from 'express';

// Initialize Express application
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle file uploads and decompression
app.post('/decompress', (req: Request, res: Response) => {
  // Check if the file is present in the request
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  const file = req.files?.file;
  if (!file) {
    return res.status(400).json({ message: 'No file field in the request.' });
  }

  // Define the directory where the extracted files will be stored
  const extractPath = path.join(__dirname, 'extracted');
  fs.mkdirSync(extractPath, { recursive: true });

  // Extract the files from the archive
  const output = fs.createWriteStream(path.join(extractPath, `${file.name}.extracted`));
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive
    .on('error', (err) => {
      throw err;
    })
    .on('finish', () => {
      res.json({ message: 'File extracted successfully.' });
    })
    .pipe(output);

  // Pipe the file stream to the archiver
  file.data.pipe(archive);

  // Finalize the archive process
  archive.finalize();
});

// Start the Express server
app.listen(port, () => {
  console.log(`Decompression service listening at http://localhost:${port}`);
});
