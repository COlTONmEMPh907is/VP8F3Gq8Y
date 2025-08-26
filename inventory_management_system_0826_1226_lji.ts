// 代码生成时间: 2025-08-26 12:26:09
import express, { Request, Response } from 'express';
import { inventoryItems } from './inventoryData'; // 假设有一个inventoryData.ts文件包含库存数据

// 创建Express应用
const app = express();

// 定义端口号
const PORT = 3000;

// 中间件，解析JSON请求体
app.use(express.json());

// 获取库存列表
app.get('/inventory', (req: Request, res: Response) => {
    try {
        // 发送库存列表
        res.status(200).json(inventoryItems);
    } catch (error) {
        // 错误处理
        res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
});

// 获取单个库存项
app.get('/inventory/:itemId', (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    try {
        const item = inventoryItems.find(item => item.id === itemId);
        if (!item) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.status(200).json(item);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// 添加库存项
app.post('/inventory', (req: Request, res: Response) => {
    try {
        const newItem = req.body;
        if (!newItem || !newItem.id || !newItem.name || !newItem.quantity) {
            res.status(400).json({ error: 'Invalid item data' });
        } else {
            inventoryItems.push(newItem);
            res.status(201).json(newItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// 更新库存项
app.put('/inventory/:itemId', (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    try {
        let foundItemIndex = inventoryItems.findIndex(item => item.id === itemId);
        if (foundItemIndex === -1) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            const updatedItem = { ...inventoryItems[foundItemIndex], ...req.body };
            inventoryItems[foundItemIndex] = updatedItem;
            res.status(200).json(updatedItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// 删除库存项
app.delete('/inventory/:itemId', (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    try {
        let foundItemIndex = inventoryItems.findIndex(item => item.id === itemId);
        if (foundItemIndex === -1) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            inventoryItems.splice(foundItemIndex, 1);
            res.status(200).json({ message: 'Item deleted' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Inventory Management System running on port ${PORT}`);
});
