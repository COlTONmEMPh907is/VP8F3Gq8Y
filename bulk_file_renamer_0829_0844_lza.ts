// 代码生成时间: 2025-08-29 08:44:25
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import multer from 'multer';

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Set up a temporary storage for uploaded files using Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware to parse JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Endpoint to rename files in batch
app.post('/rename', upload.array('files'), async (req, res) => {
    // Check if files were uploaded
    if (!req.files) {
        return res.status(400).json({
            error: 'No files were uploaded.'
        });
    }

    // Get the uploaded files
    const files = req.files;
    // Check if there's a rename pattern in the request body
    if (!req.body.renamePattern) {
        return res.status(400).json({
            error: 'Rename pattern is required.'
        });
    }

    try {
        // Rename files based on the provided pattern
        for (const file of files) {
            const { name, ext } = path.parse(file.filename);
            const newFileName = `${req.body.renamePattern}_${name}${ext}`;
            const oldPath = file.path;
            const newPath = path.join(file.destination, newFileName);
            await fs.rename(oldPath, newPath);
        }

        // Return the new file paths
        res.json({
            renamedFiles: files.map(file => path.join(file.destination, path.basename(file.filename)))
        });
    } catch (error) {
        // Handle any errors that occur during file renaming
        res.status(500).json({
            error: 'Error renaming files.',
            message: error.message
        });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});