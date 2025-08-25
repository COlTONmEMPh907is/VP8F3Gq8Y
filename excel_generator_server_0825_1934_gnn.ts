// 代码生成时间: 2025-08-25 19:34:42
 * This server provides an endpoint to create an Excel file based on user input data.
 */
import express from 'express';
import { createExcelFile } from './excel_creator'; // Assuming excel_creator.ts file
import { Request, Response } from 'express';
import { ExcelData, ErrorResponse } from './types'; // Assuming types.ts file for type definitions

// Initialize the Express application
const app = express();

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint for generating Excel files
app.post('/generate-excel', async (req: Request, res: Response) => {
    // Check if the request body contains the required data
    if (!req.body || !(req.body instanceof Object)) {
        return res.status(400).json<ErrorResponse>({
            message: 'Invalid request body',
        });
    }
    
    const data: ExcelData = req.body;
    try {
        // Generate the Excel file
        const excelBuffer = await createExcelFile(data);
        
        // Set the headers to indicate the file is downloadable
        res.setHeader('Content-Disposition', 'attachment; filename=generated.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        // Send the file as a response
        res.send(excelBuffer);
    } catch (error: any) {
        // Handle any errors that occur during file generation
        return res.status(500).json<ErrorResponse>({
            message: error.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Excel Generator Server is running on port ${PORT}`);
});

// Define the structure for the data required to generate an Excel file
interface ExcelData {
    title: string;
    rows: Array<Array<string>>;
}

// Define the structure for error responses
interface ErrorResponse {
    message: string;
}
