// 代码生成时间: 2025-08-19 06:45:03
// audit_logger_service.ts

import express, { Request, Response } from 'express';
import fs from 'fs';
import { createWriteStream } from 'fs';
import path from 'path';
import util from 'util';

// 设置日志文件存储的位置和文件名称
const LOGS_DIRECTORY = path.join(__dirname, 'logs');
const LOG_FILE_NAME = 'audit.log';
const LOG_FILE_PATH = path.join(LOGS_DIRECTORY, LOG_FILE_NAME);

// 确保日志文件夹存在
if (!fs.existsSync(LOGS_DIRECTORY)) {
  fs.mkdirSync(LOGS_DIRECTORY);
}

// 使用异步写入流来记录日志
const logStream = createWriteStream(LOG_FILE_PATH, { flags: 'a' });
const logWrite = util.promisify(logStream.write.bind(logStream));

// Express 应用实例
const app = express();

// 中间件：记录所有请求的审计日志
app.use((req: Request, res: Response, next) => {
  const { method, url, headers, body } = req;
  
  // 构建日志信息
  const logEntry = `[${new Date().toISOString()}] ${method} ${url} - ${JSON.stringify(headers)} - ${JSON.stringify(body)}
`;

  // 异步写入日志文件
  logWrite(logEntry)
    .then(() => next())
    .catch((err) => next(new Error('Error writing to log file: ' + err.message)));
});

// 示例路由：用于触发日志记录的GET请求
app.get('/test', (req, res) => {
  res.status(200).send('Test endpoint responding with audit log');
});

// 错误处理中间件，捕获并记录错误
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  logWrite(`Error: ${err.message}
${err.stack}
`)
    .then(() => res.status(500).send('An error occurred'))
    .catch((err) => console.error('Error writing error to log file: ', err));
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Audit log service running on port ${PORT}`);
});

// 注意：在生产环境中，应使用更复杂的日志记录解决方案
// 例如使用Winston或Bunyan，并考虑使用如ELK堆栈的中央日志管理系统。