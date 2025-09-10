// 代码生成时间: 2025-09-11 07:59:37
import express from 'express';
import os from 'os';
import { performance, PerformanceObserver } from 'perf_hooks';

// 创建一个Express应用
const app = express();
const port = 3000;

// 接口用于获取系统信息
app.get('/system-info', (req, res) => {
  try {
    // 收集CPU和内存信息
    const cpuInfo = {
      model: os.cpus()[0].model,
      speed: `${os.cpus()[0].speed} MHz`,
     核心数: os.cpus().length,
    };

    const memoryInfo = {
      total: `${(os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)} GB`,
      free: `${(os.freemem() / (1024 * 1024 * 1024)).toFixed(2)} GB`,
    };

    // 返回系统信息
    res.json({
      cpu: cpuInfo,
      memory: memoryInfo,
    });
  } catch (error) {
    // 错误处理
    console.error('Error fetching system info:', error);
    res.status(500).json({ error: 'Failed to fetch system info' });
  }
});

// 接口用于监控性能
app.get('/performance', (req, res) => {
  try {
    // 定义一个性能监控器
    const obs = new PerformanceObserver((items) => {
      items.getEntries().forEach((entry) => {
        console.log(`Performance entry: ${entry.name}, duration: ${entry.duration} ms`);
      });
    });

    // 启用性能监控器
    obs.observe({ entryTypes: ['function', 'http2'] });

    // 模拟一个性能监控项
    performance.mark('start');
    // 这里可以放置需要监控的代码
    performance.mark('end');
    performance.measure('operation', 'start', 'end');

    res.json({
      message: 'Performance monitoring is enabled.',
    });
  } catch (error) {
    // 错误处理
    console.error('Error setting up performance monitoring:', error);
    res.status(500).json({ error: 'Failed to set up performance monitoring' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`System Performance Monitor app listening at http://localhost:${port}`);
});