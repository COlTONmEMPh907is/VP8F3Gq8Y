// 代码生成时间: 2025-07-30 18:53:04
import express from 'express';
import fs from 'fs';
import path from 'path';

// 定义日志解析工具接口
interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

// 创建Express应用
const app = express();
const port = 3000;

// 解析日志文件并返回解析结果
const parseLogFile = (filePath: string): LogEntry[] => {
  try {
    // 读取日志文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    // 将文件内容按行分割
    const lines = fileContent.split('
');
    // 过滤空行并解析每行为LogEntry对象
    return lines
      .filter(line => line.trim() !== '')
      .map(line => {
        const parts = line.split(' ');
        return {
          timestamp: parts[0],
          level: parts[1],
          message: parts.slice(2).join(' ')
        };
      });
  } catch (error) {
    throw new Error('Failed to parse log file: ' + error.message);
  }
};

// 路由处理函数 - GET /parse-logs/:filename
app.get('/parse-logs/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'logs', filename);
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Log file not found' });
    }
    // 解析日志文件
    const logEntries = parseLogFile(filePath);
    // 返回解析后的日志数据
    res.json(logEntries);
  } catch (error) {
    // 错误处理
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Log Parser Tool is running on http://localhost:${port}`);
});
