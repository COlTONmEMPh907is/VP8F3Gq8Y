// 代码生成时间: 2025-08-30 02:39:25
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

// 设置环境变量
const JWT_SECRET: string = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || '2h';

// 模拟用户数据库
interface User {
  username: string;
  password: string;
}

const users: User[] = [];

// 注册新用户
const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = { username, password: hashedPassword };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully' });
};

// 用户登录
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  res.json({ message: 'Login successful', token });
};

// 保护的路由中间件
const protectRoute = async (req: Request, res: Response, next: Function) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'You are not authenticated' });
  }
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// 创建Express应用
const app = express();
app.use(express.json());

// 路由
app.post('/register', register);
app.post('/login', login);
app.get('/protected', protectRoute, (req: Request, res: Response) => {
  res.json({ message: 'You are authenticated' });
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err);
  res.status(500).json({ message: 'An internal server error occurred' });
});

// 启动服务器
const PORT: number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});