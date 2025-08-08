// 代码生成时间: 2025-08-09 00:58:01
import express from 'express';
import { Workbook } from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

// Define the port where the Express server will listen
const PORT = 3000;

// Create an instance of the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files from the public directory
app.use(express.static('public'));

// Route to handle the Excel file generation
app.get('/generate-excel', async (req, res, next) => {
  try {
    // Create a new Excel workbook
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('My Sheet');

    // Define some sample data
    const data = [
      ['ID', 'Name', 'Date'],
      [1, 'John Doe', new Date()],
      [2, 'Jane Smith', new Date()],
    ];

    // Add the data to the sheet
    sheet.addRows(data);

    // Write the workbook to a file
    const outputPath = path.join(__dirname, 'output.xlsx');
    await workbook.xlsx.writeFile(outputPath);

    // Send the file to the client as a response
    res.download(outputPath);
  } catch (error) {
    // Error handling middleware
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the Express server
http.createServer(app).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
