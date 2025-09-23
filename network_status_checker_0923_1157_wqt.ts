// 代码生成时间: 2025-09-23 11:57:38
import express from 'express';
import https from 'https';
import http from 'http';

// 检查网络连接状态的函数
async function checkNetworkStatus(url: string, timeout: number): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const request = https.get(url, { timeout }, response => {
      if (response.statusCode === 200) {
        resolve('Online');
      } else {
        reject('Server returned a non-200 status code');
      }
    }).on('error', (err) => {
      reject('Network request failed');
    });
  });
}

// 创建Express应用
const app = express();

// 设置端口号
const PORT = process.env.PORT || 3000;

// 定义路由检查网络状态
app.get('/api/check-network', async (req, res) => {
  try {
    // 用户可以指定不同的url和超时时间
    const { url, timeout } = req.query;
    if (!url || !timeout) {
      throw new Error('URL and timeout are required');
    }
    const status = await checkNetworkStatus(url as string, Number(timeout));
    res.status(200).json({ status });
  } catch (error) {
    // 错误处理
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});