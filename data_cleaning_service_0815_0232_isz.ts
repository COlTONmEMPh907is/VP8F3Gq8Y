// 代码生成时间: 2025-08-15 02:32:46
import express from 'express';
import { Request, Response } from 'express';

// 创建Express应用
const app = express();

// 中间件，用于解析JSON请求体
app.use(express.json());

// 数据清洗和预处理工具类
class DataCleaningService {
  // 去除字符串中的空白字符
  public static trim(text: string): string {
    return text.trim();
  }

  // 将字符串中的字母转换为小写
  public static toLowerCase(text: string): string {
    return text.toLowerCase();
  }

  // 去除字符串中的非数字字符
  public static removeNonNumeric(text: string): string {
    return text.replace(/\D/g, '');
  }
}

// 定义路由处理函数
app.post('/clean', (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        error: 'No text provided for cleaning'
      });
    }

    // 使用DataCleaningService类进行数据清洗
    const cleanedText = DataCleaningService.trim(DataCleaningService.toLowerCase(DataCleaningService.removeNonNumeric(text)));

    // 返回清洗后的数据
    res.json({
      originalText: text,
      cleanedText
    });
  } catch (error) {
    // 错误处理
    res.status(500).json({
      error: 'An error occurred during data cleaning process'
    });
  }
});

// 定义服务器监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});