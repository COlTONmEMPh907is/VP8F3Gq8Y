// 代码生成时间: 2025-08-23 16:57:35
import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { createWriteStream } from 'fs';

// 创建Express应用
const app = express();
const port = 3000;

// 定义网页内容抓取工具的路由
app.get('/scraper', async (req, res) => {
  // 获取请求参数中的URL
  const { url } = req.query;

  // 检查URL参数是否提供
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // 使用axios发送HTTP请求获取网页内容
    const response = await axios.get(url);
    const html = response.data;

    // 使用cheerio解析HTML
    const $ = cheerio.load(html);

    // 抓取所需的网页内容，此处示例为抓取<title>标签的内容
    const title = $('title').text();

    // 将抓取的内容写入文件
    const writeStream = createWriteStream('output.html');
    writeStream.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title}</title></head><body></body></html>`);
    writeStream.end();

    // 返回抓取的内容
    return res.json({ title });
  } catch (error) {
    // 错误处理
    console.error('Error fetching web content:', error);
    return res.status(500).json({ error: 'Failed to fetch web content' });
  }
});

// 启动Express服务器
app.listen(port, () => {
  console.log(`Web content scraper app listening at http://localhost:${port}`);
});
