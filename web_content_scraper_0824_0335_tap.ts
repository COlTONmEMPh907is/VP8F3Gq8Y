// 代码生成时间: 2025-08-24 03:35:25
import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { createServer } from 'vite';

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to scrape content from a given URL
app.get('/scrape', async (req, res) => {
    try {
        // Get the URL from the query parameters
        const { url } = req.query;
        
        // Check if the URL is provided
        if (!url) {
            return res.status(400).json({
                error: 'URL parameter is required'
            });
        }
        
        // Use axios to make a GET request to the provided URL
        const response = await axios.get(url);
        
        // Use cheerio to load and manipulate the HTML content
        const $ = cheerio.load(response.data);
        
        // Extract the content you need
        // Example: Extract all paragraph texts
        const paragraphs = $('p').map((i, elem) => $(elem).text()).get();
        
        // Return the extracted content as JSON
        res.json({ paragraphs });
    } catch (error) {
        // Handle any errors that occur during the scraping process
        res.status(500).json({
            error: 'An error occurred while scraping the content',
            message: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});