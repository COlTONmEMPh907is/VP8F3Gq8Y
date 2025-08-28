// 代码生成时间: 2025-08-29 04:56:56
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// 库存管理系统接口
interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

// 模拟数据库
const inventoryDatabase: InventoryItem[] = [];

// 获取所有库存项
const getAllInventoryItems = (req: Request, res: Response) => {
    try {
        res.status(200).json(inventoryDatabase);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 获取单个库存项
const getInventoryItemById = (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        const item = inventoryDatabase.find(item => item.id === itemId);
        if (!item) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            res.status(200).json(item);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 添加库存项
const addInventoryItem = (req: Request, res: Response) => {
    try {
        const newItem: Omit<InventoryItem, 'id'> = req.body;
        if (!newItem.name || !newItem.quantity || !newItem.price) {
            res.status(400).json({ error: 'Invalid item data' });
        } else {
            const item: InventoryItem = {
                id: uuidv4(),
                ...newItem,
            };
            inventoryDatabase.push(item);
            res.status(201).json(item);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 更新库存项
const updateInventoryItem = (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        const index = inventoryDatabase.findIndex(item => item.id === itemId);
        if (index === -1) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            const updatedItem = {
                ...inventoryDatabase[index],
                ...req.body,
            };
            inventoryDatabase[index] = updatedItem;
            res.status(200).json(updatedItem);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 删除库存项
const deleteInventoryItem = (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;
        const index = inventoryDatabase.findIndex(item => item.id === itemId);
        if (index === -1) {
            res.status(404).json({ error: 'Item not found' });
        } else {
            inventoryDatabase.splice(index, 1);
            res.status(200).json({ message: 'Item deleted' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// 创建Express应用
const app = express();
app.use(express.json());

// 路由
app.get('/api/inventory', getAllInventoryItems);
app.get('/api/inventory/:id', getInventoryItemById);
app.post('/api/inventory', addInventoryItem);
app.put('/api/inventory/:id', updateInventoryItem);
app.delete('/api/inventory/:id', deleteInventoryItem);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
