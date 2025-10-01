// 代码生成时间: 2025-10-01 21:52:54
import express from 'express';
import { request, response, Router } from 'express';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define a DataSync class to handle data synchronization logic
class DataSync {
  private static instance: DataSync;

  private constructor() {}

  public static getInstance(): DataSync {
    if (!DataSync.instance) {
      DataSync.instance = new DataSync();
    }
    return DataSync.instance;
  }

  // Synchronize data from source to destination
  public async syncData(srcPath: string, destPath: string): Promise<void> {
    try {
      const data = await fsPromises.readFile(srcPath, 'utf8');
      await fsPromises.writeFile(destPath, data, 'utf8');
      console.log('Data synchronized successfully');
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  }
}

const app = express();
const router: Router = express.Router();
const PORT = process.env.PORT || 3000;

// API endpoint to initiate data synchronization
router.post('/sync-data', async (req: request, res: response) => {
  const { srcPath, destPath } = req.body;
  if (!srcPath || !destPath) {
    return res.status(400).json({ error: 'Source and destination paths are required' });
  }

  try {
    const uniqueFileName = `sync-${uuidv4()}.txt`;
    const destFilePath = path.join(destPath, uniqueFileName);
    await DataSync.getInstance().syncData(srcPath, destFilePath);
    res.status(200).json({ message: 'Data synchronized successfully', destFilePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Register routes
app.use(router);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});