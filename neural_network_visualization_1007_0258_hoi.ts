// 代码生成时间: 2025-10-07 02:58:21
import express from 'express';
import { createServer } from 'vite';
import path from 'path';
import { render } from 'ejs';

// Define a port number for the server to listen on
const PORT = 3000;
const app = express();
const vite = createServer({ preview: true });

// Middleware to serve the Vite-generated assets
app.use(vite.middlewares);

// Serve the project assets from the 'public' directory
app.use(express.static('public'));

// Home route that renders the visualization page
app.get('/', async (req, res) => {
  try {
    // Render the EJS template passing a title
    const html = await renderFile(path.resolve(__dirname, 'views', 'index.ejs'), { title: 'Neural Network Visualization' });
    res.status(200).send(html);
  } catch (error) {
    // Error handling middleware
    res.status(500).send('Internal Server Error');
    console.error('Error rendering index page:', error);
  }
});

// Middleware to handle Vite's special routes
app.all('*', async (req, res) => {
  await vite.handle(req, res);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Function to render EJS templates
async function renderFile(filePath: string, data: Record<string, unknown>): Promise<string> {
  return new Promise((resolve, reject) => {
    render(filePath, data, (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
}
