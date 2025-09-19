// 代码生成时间: 2025-09-19 21:50:15
 * It follows best practices for error handling, documentation, and maintainability.
 */
import express, { Request, Response } from 'express';
import { createWriteStream, promises as fs } from 'fs';
import ExcelJS from 'exceljs';
import { resolve } from 'path';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to generate an Excel file
app.post('/generate-excel', async (req: Request, res: Response) => {
  // Destructure the data from the request body
  const { data, fileName } = req.body;
  if (!data || !fileName) {
    return res.status(400).json({
      error: 'Missing data or file name'
    });
  }

  try {
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    // Add data to the worksheet
    if (data.length > 0) {
      worksheet.addRow(data[0]); // Assuming the first row is the header
      for (let i = 1; i < data.length; i++) {
        worksheet.addRow(data[i]);
      }
    }

    // Create a path for the Excel file
    const filePath = resolve(__dirname, '..', 'temp', `${fileName}.xlsx`);

    // Write the Excel file to the file system
    const writeStream = createWriteStream(filePath);
    await workbook.xlsx.write(writeStream);
    writeStream.end();

    // Send the file as a response
    const fileStream = fs.createReadStream(filePath);
    const stat = await fs.stat(filePath);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    fileStream.pipe(res);

  } catch (error) {
    // Handle any errors that occur during file generation
    res.status(500).json({
      error: 'Error generating Excel file',
      message: error.message
    });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Excel Generator Service is running on port ${PORT}`);
});
