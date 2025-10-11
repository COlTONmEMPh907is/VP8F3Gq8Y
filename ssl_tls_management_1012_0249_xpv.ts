// 代码生成时间: 2025-10-12 02:49:28
import express, { Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

// Promisify fs methods for better async support
const readFileAsync = promisify(readFileSync);
const writeFileAsync = promisify(writeFileSync);

// Define a simple in-memory storage for certificates
const certificates: Record<string, string> = {};

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to get a certificate by id
app.get('/certificates/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!certificates[id]) {
    return res.status(404).json({
      error: 'Certificate not found'
    });
  }
  res.json({
    id,
    certificate: certificates[id]
  });
});

// Endpoint to add a new certificate
app.post('/certificates', async (req: Request, res: Response) => {
  const { id, certificate } = req.body;
  if (!id || !certificate) {
    return res.status(400).json({
      error: 'Missing ID or Certificate'
    });
  }
  if (certificates[id]) {
    return res.status(409).json({
      error: 'Certificate already exists'
    });
  }
  try {
    certificates[id] = certificate;
    await writeFileAsync(join(__dirname, 'certificates', `${id}.pem`), certificate);
    res.status(201).json({
      id,
      certificate
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to save certificate'
    });
  }
});

// Endpoint to update an existing certificate
app.put('/certificates/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { certificate } = req.body;
  if (!certificates[id]) {
    return res.status(404).json({
      error: 'Certificate not found'
    });
  }
  if (!certificate) {
    return res.status(400).json({
      error: 'Missing Certificate'
    });
  }
  try {
    certificates[id] = certificate;
    await writeFileAsync(join(__dirname, 'certificates', `${id}.pem`), certificate);
    res.json({
      id,
      certificate
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to update certificate'
    });
  }
});

// Endpoint to delete a certificate
app.delete('/certificates/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!certificates[id]) {
    return res.status(404).json({
      error: 'Certificate not found'
    });
  }
  delete certificates[id];
  try {
    await promisify(unlink)(join(__dirname, 'certificates', `${id}.pem`));
    res.status(200).json({
      id
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to delete certificate'
    });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
