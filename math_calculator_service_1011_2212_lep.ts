// 代码生成时间: 2025-10-11 22:12:46
import express from 'express';
import { Request, Response } from 'express';

// 定义一个接口来描述数学计算请求的体部分
interface MathRequest {
  operation: string;
  number1: number;
  number2?: number;
}

// 创建一个Express应用
const app = express();

// 设置请求体解析中间件
app.use(express.json());

// 定义一个数学计算类
class MathCalculator {
  // 加法计算
  public add(number1: number, number2: number): number {
    return number1 + number2;
  }

  // 减法计算
  public subtract(number1: number, number2: number): number {
    return number1 - number2;
  }

  // 乘法计算
  public multiply(number1: number, number2: number): number {
    return number1 * number2;
  }

  // 除法计算
  public divide(number1: number, number2: number): number {
    if (number2 === 0) {
      throw new Error('Division by zero is not allowed.');
    }
    return number1 / number2;
  }
}

// 实例化MathCalculator
const calculator = new MathCalculator();

// 定义一个处理数学计算的路由
app.post('/math', (req: Request, res: Response) => {
  const { operation, number1, number2 } = req.body as MathRequest;

  try {
    let result: number;

    switch (operation) {
      case 'add':
        result = calculator.add(number1, number2);
        break;
      case 'subtract':
        result = calculator.subtract(number1, number2);
        break;
      case 'multiply':
        result = calculator.multiply(number1, number2);
        break;
      case 'divide':
        result = calculator.divide(number1, number2);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid operation',
        });
    }

    // 返回计算结果
    res.json({
      result,
    });
  } catch (error) {
    // 错误处理
    res.status(500).json({
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
});

// 设置服务监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
