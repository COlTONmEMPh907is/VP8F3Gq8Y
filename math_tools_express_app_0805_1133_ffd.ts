// 代码生成时间: 2025-08-05 11:33:19
import express, { Request, Response } from 'express';

// Define a type for the calculation request body
interface CalculationRequestBody {
  operation: string;
  operand1: number;
  operand2?: number;
}

// Create the Express application
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Math utility functions
class MathUtils {
  // Adds two numbers
  public static add(operand1: number, operand2: number): number {
    return operand1 + operand2;
  }

  // Subtracts two numbers
  public static subtract(operand1: number, operand2: number): number {
    return operand1 - operand2;
  }

  // Multiplies two numbers
  public static multiply(operand1: number, operand2: number): number {
    return operand1 * operand2;
  }

  // Divides two numbers
  public static divide(operand1: number, operand2: number): number {
    if (operand2 === 0) {
      throw new Error('Division by zero is not allowed.');
    }
    return operand1 / operand2;
  }
}

// Route for performing calculations
app.post('/calculate', (req: Request, res: Response) => {
  const { operation, operand1, operand2 } = req.body as CalculationRequestBody;

  if (!operation || (!operand1 && !operand2)) {
    return res.status(400).json({
      error: 'Invalid request. Please provide an operation and at least one operand.'
    });
  }

  try {
    let result: number;
    switch (operation) {
      case 'add':
        result = MathUtils.add(operand1, operand2 as number);
        break;
      case 'subtract':
        result = MathUtils.subtract(operand1, operand2 as number);
        break;
      case 'multiply':
        result = MathUtils.multiply(operand1, operand2 as number);
        break;
      case 'divide':
        result = MathUtils.divide(operand1, operand2 as number);
        break;
      default:
        return res.status(400).json({
          error: 'Unsupported operation.'
        });
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Math Tools Express App is running at http://localhost:${port}`);
});
