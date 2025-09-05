// 代码生成时间: 2025-09-06 02:06:05
import express, { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// 创建一个函数来定义表单数据验证规则
const validateFormData = () => {
  return [
    // 假设我们需要验证名字和邮箱
    check('name').exists().withMessage('Name is required').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    check('email').exists().withMessage('Email is required').isEmail().withMessage('Must be a valid email address'),
  ];
};

// 创建一个中间件来处理验证错误
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({ field: err.param, message: err.msg })),
    });
  }
  next();
};

// 表单数据验证器函数
function formValidator() {
  const app = express();
  app.use(express.json()); // 解析JSON请求体

  // 路由: POST /validate-form
  app.post('/validate-form', validateFormData(), handleValidationErrors, (req: Request, res: Response) => {
    // 验证通过后的逻辑
    res.status(200).json({ message: 'Form data is valid.' });
  });

  return app;
}

export default formValidator;