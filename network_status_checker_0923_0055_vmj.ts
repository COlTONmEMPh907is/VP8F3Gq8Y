// 代码生成时间: 2025-09-23 00:55:43
import express from 'express';
import { createServer } from 'http';
import { check } from 'systeminformation';

// 创建Express应用
const app = express();
const port = 3000;

// 创建HTTP服务器
const server = createServer(app);

// 定义一个GET路由来检查网络状态
app.get('/network/status', async (req, res) => {
    try {
        // 使用systeminformation库检查网络状态
        const networkStatus = await check.networkConnections();
        
        // 将网络状态信息发送给客户端
        res.json({ status: 'success', data: networkStatus });
    } catch (error) {
        // 错误处理
        console.error('Error checking network status:', error);
        res.status(500).json({ status: 'error', message: 'Failed to check network status' });
    }
});

// 服务器监听指定端口
server.listen(port, () => {
    console.log(`Network status checker app listening at http://localhost:${port}`);
});

// 导出Express应用和服务器实例
export { app, server };
