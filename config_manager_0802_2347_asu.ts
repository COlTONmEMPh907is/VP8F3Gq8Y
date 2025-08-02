// 代码生成时间: 2025-08-02 23:47:54
import express from 'express';
import fs from 'fs';
import path from 'path';

// 定义配置文件管理器
class ConfigManager {
    private configPath: string;

    constructor(configPath: string) {
        this.configPath = configPath;
    }

    // 加载配置文件
    public loadConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.configPath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    // 保存配置文件
    public saveConfig(configData: any): Promise<void> {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(configData, null, 4);
            fs.writeFile(this.configPath, data, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

// Express 应用配置
const app = express();
const PORT = process.env.PORT || 3000;

// 创建配置文件管理器实例
const configManager = new ConfigManager(path.join(__dirname, 'config.json'));

// 获取配置文件
app.get('/config', async (req, res) => {
    try {
        const configData = await configManager.loadConfig();
        res.json(configData);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load config', error: error.message });
    }
});

// 更新配置文件
app.post('/config', async (req, res) => {
    try {
        await configManager.saveConfig(req.body);
        res.status(200).json({ message: 'Config updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update config', error: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});