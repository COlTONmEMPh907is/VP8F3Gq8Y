// 代码生成时间: 2025-09-18 18:24:53
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import util from 'util';

// 定义一个函数，用于重命名文件
async function renameFiles(directory: string, renamePattern: (filename: string) => string): Promise<void> {
    try {
        // 读取目录中的所有文件
        const files = await fs.readdir(directory);

        // 遍历文件并重命名
        for (const file of files) {
            const oldPath = path.join(directory, file);
            const stat = await fs.stat(oldPath);
            if (stat.isFile()) {
                const newPath = path.join(directory, renamePattern(file));
                // 重命名文件
                await fs.rename(oldPath, newPath);
                console.log(`Renamed ${oldPath} to ${newPath}`);
            }
        }
    } catch (error) {
        console.error('Error renaming files:', error);
        throw error;
    }
}

// 创建Express应用
const app = express();
app.use(express.json()); // 用于解析JSON请求体

// 定义重命名文件的路由
app.post('/api/rename', async (req, res) => {
    const { directory, renamePattern } = req.body;
    if (!directory) {
        return res.status(400).json({ error: 'Directory path is required' });
    }
    if (typeof renamePattern !== 'function') {
        return res.status(400).json({ error: 'Rename pattern must be a function' });
    }

    try {
        // 调用重命名函数
        await renameFiles(directory, renamePattern);
        res.status(200).json({ message: 'Files renamed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 监听端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Batch file renamer running on port ${port}`);
});

// 导出renameFiles函数以便于测试
export { renameFiles };
