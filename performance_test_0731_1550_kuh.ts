// 代码生成时间: 2025-07-31 15:50:01
import express from 'express';
import axios from 'axios';
import { performance } from 'perf_hooks';

// 创建一个 Express 应用
const app = express();

// 性能测试函数
const performanceTest = async (url: string, iterations: number) => {
  let totalDuration = 0;
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      await axios.get(url);
    } catch (error) {
      console.error(`Request failed on iteration ${i}: ${error}`);
    }
    const end = performance.now();
    totalDuration += end - start;
  }
  return totalDuration / iterations;
};

// 设置要测试的 URL 和迭代次数
const testUrl = 'http://localhost:3000/test';
const iterations = 100;

// 创建一个简单的测试路由
app.get('/test', (req, res) => {
  res.json({ message: 'Test response' });
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// 执行性能测试
performanceTest(testUrl, iterations).then(averageDuration => {
  console.log(`Average request duration: ${averageDuration}ms`);
});