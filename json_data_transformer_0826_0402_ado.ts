// 代码生成时间: 2025-08-26 04:02:10
// json_data_transformer.ts
import express from 'express';
import { Request, Response } from 'express';

// 定义一个函数，用于转换JSON数据格式
function transformJsonData(inputData: any): any {
  // 此处添加具体的转换逻辑
  // 示例：深拷贝并转换输入数据为驼峰命名
  let transformedData = JSON.parse(JSON.stringify(inputData));
  return transformCamelCaseKeys(transformedData);
}

// 递归函数，将对象的键转换为驼峰命名
function transformCamelCaseKeys(obj: any): any {
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (acc: any, key: string) => {
        const camelCaseKey = key.replace(/(\w)(\w+)/g, (match, char, rest) => char + rest.toLowerCase());
        acc[camelCaseKey] = transformCamelCaseKeys(obj[key]);
        return acc;
      },
      {}
    );
  } else {
    return obj;
  }
}

// 创建Express应用
const app = express();

// 设置中间件来解析请求体中的JSON
app.use(express.json());

// 定义路由，用于接受JSON数据并返回转换后的数据
app.post('/api/transform', (req: Request, res: Response) => {
  // 检查请求体是否包含数据
  if (!req.body) {
    return res.status(400).json({
      error: 'No input data provided'
    });
  }

  try {
    // 转换JSON数据格式
    const transformedData = transformJsonData(req.body);
    // 返回转换后的数据
    res.status(200).json(transformedData);
  } catch (error) {
    // 错误处理
    res.status(500).json({
      error: 'Error transforming JSON data'
    });
  }
}

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`JSON Data Transformer is running on port ${PORT}`);
});
