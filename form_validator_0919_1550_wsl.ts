// 代码生成时间: 2025-09-19 15:50:50
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// 创建一个Express应用
const app = express();

// 设置跨域资源共享（CORS）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 定义表单验证规则
const validateFormData = [
  body('username').isAlpha().withMessage('Username must be alphabetic characters only').trim().escape(),
  body('email').isEmail().withMessage('Email must be a valid email address').trim().escape(),
  body('age').isInt({ min: 18 }).withMessage('Age must be an integer greater than or equal to 18').toInt(),
];

// 创建一个路由处理POST请求，并使用验证器
app.post('/submit-form', validateFormData, (req: Request, res: Response) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // 如果有错误，返回错误信息
    return res.status(400).json({
      errors: errors.array(),
      message: 'Validation failed',
    });
  }
  
  // 如果没有错误，处理表单提交
  // 这里可以根据实际业务逻辑进行处理，例如保存数据到数据库等
  try {
    // 假设我们保存数据的函数是saveFormData
    const formData = {
      username: req.body.username,
      email: req.body.email,
      age: req.body.age,
    };
    // 保存数据
    // saveFormData(formData);
    
    // 返回成功响应
    res.status(200).json({
      message: 'Form data submitted successfully',
      data: formData,
    });
  } catch (error) {
    // 错误处理
    res.status(500).send({
      message: 'Internal server error',
      error: error.message,
    });
  }
});

// 定义默认端口
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});