// 代码生成时间: 2025-09-16 18:02:08
import express from 'express';
import { Request, Response } from 'express';
import { createServer } from 'http';
import { createClient } from 'redis'; // 引入Redis客户端

// 创建一个Express应用
const app = express();
const port = 3000;

// 创建Redis客户端
const redisClient = createClient();

// 连接Redis
redisClient.on('error', (err) => console.error('Redis client error', err));
redisClient.connect();

// 中间件来处理缓存逻辑
app.use((req: Request, res: Response, next) => {
  // 从请求中提取资源的键
  const cacheKey = `cache:${req.originalUrl}`;
  // 尝试从Redis获取缓存数据
  redisClient.get(cacheKey, async (err, cachedData) => {
    if (err) {
      console.error('Error fetching cache', err);
      return next();
    }
    // 如果有缓存数据，则直接返回缓存数据
    if (cachedData) {
      console.log('Cache hit');
      res.send(cachedData);
    } else {
      console.log('Cache miss');
      // 如果没有缓存数据，则调用next()继续处理请求
      next();
    }
  });
});

// 模拟一个API来返回数据
app.get('/api/data', async (req: Request, res: Response) => {
  try {
    // 模拟数据获取
    const data = await fetchData();
    // 发送响应
    res.json(data);
    // 将数据缓存起来
    const cacheKey = `cache:${req.originalUrl}`;
    redisClient.set(cacheKey, JSON.stringify(data), 'EX', 3600); // 设置缓存有效期为1小时
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).send('Internal Server Error');
  }
});

// 启动Express服务器
createServer(app).listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 模拟数据获取函数
async function fetchData(): Promise<any> {
  // 模拟异步操作
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Hello from the server!' });
    }, 1000);
  });
}
