// 代码生成时间: 2025-09-02 09:49:43
import express, { Request, Response, NextFunction } from 'express';
import { InventoryItem } from './models/InventoryItem';

// 定义库存接口
interface IInventoryItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

// 创建库存管理类
class InventoryManager {
    private inventory: Map<string, IInventoryItem>;

    constructor() {
        this.inventory = new Map<string, IInventoryItem>();
    }

    // 添加库存项
    public addInventoryItem(item: IInventoryItem): boolean {
        if (this.inventory.has(item.id)) {
            return false; // 已存在相同ID的库存项
        }
        this.inventory.set(item.id, item);
        return true;
    }

    // 更新库存项
    public updateInventoryItem(id: string, item: Partial<IInventoryItem>): boolean {
        if (!this.inventory.has(id)) {
            return false; // 找不到ID对应的库存项
        }
        this.inventory.set(id, { ...this.inventory.get(id), ...item });
        return true;
    }

    // 删除库存项
    public deleteInventoryItem(id: string): boolean {
        if (!this.inventory.has(id)) {
            return false; // 找不到ID对应的库存项
        }
        this.inventory.delete(id);
        return true;
    }

    // 获取所有库存项
    public getAllInventoryItems(): IInventoryItem[] {
        return Array.from(this.inventory.values());
    }

    // 根据ID获取库存项
    public getInventoryItemById(id: string): IInventoryItem | undefined {
        return this.inventory.get(id);
    }
}

// 创建Express应用
const app = express();
const port = 3000;
const inventoryManager = new InventoryManager();

// 使用JSON中间件解析请求体
app.use(express.json());

// 定义库存项路由
app.post('/inventory', (req: Request, res: Response, next: NextFunction) => {
    const item = req.body as IInventoryItem;
    if (!item) {
        return res.status(400).json({ message: 'Invalid inventory item' });
    }
    if (inventoryManager.addInventoryItem(item)) {
        res.status(201).json({ message: 'Inventory item added successfully', item });
    } else {
        res.status(400).json({ message: 'Inventory item with the same ID already exists' });
    }
});

app.get('/inventory', (req: Request, res: Response, next: NextFunction) => {
    const items = inventoryManager.getAllInventoryItems();
    res.status(200).json(items);
});

app.get('/inventory/:id', (req: Request, res: Response, next: NextFunction) => {
    const item = inventoryManager.getInventoryItemById(req.params.id);
    if (item) {
        res.status(200).json(item);
    } else {
        res.status(404).json({ message: 'Inventory item not found' });
    }
});

app.put('/inventory/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const updatedItem = req.body as Partial<IInventoryItem>;
    if (!updatedItem) {
        return res.status(400).json({ message: 'Invalid inventory item' });
    }
    if (inventoryManager.updateInventoryItem(id, updatedItem)) {
        res.status(200).json({ message: 'Inventory item updated successfully', updatedItem });
    } else {
        res.status(404).json({ message: 'Inventory item not found' });
    }
});

app.delete('/inventory/:id', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (inventoryManager.deleteInventoryItem(id)) {
        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } else {
        res.status(404).json({ message: 'Inventory item not found' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Inventory management system listening at http://localhost:${port}`);
});