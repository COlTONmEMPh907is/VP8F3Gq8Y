// 代码生成时间: 2025-08-21 01:23:09
import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Define an interface for an inventory item
interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
}

// In-memory storage for inventory items
const inventory: InventoryItem[] = [];

// Initialize Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Endpoint to get all inventory items
app.get('/api/items', (req: Request, res: Response) => {
    try {
        // Send all inventory items as JSON
        res.status(200).json(inventory);
    } catch (error) {
        // Handle error and send a 500 server error with error message
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to add a new inventory item
app.post('/api/items', (req: Request, res: Response) => {
    const { name, quantity } = req.body;
    if (!name || quantity <= 0) {
        // Send a 400 bad request with error message if required fields are missing or invalid
        res.status(400).json({ message: 'Name and quantity are required and quantity must be greater than 0.' });
        return;
    }
    try {
        // Create a new inventory item with a unique ID
        const newItem: InventoryItem = {
            id: uuidv4(),
            name: name,
            quantity: quantity,
        };
        // Add the new item to the inventory
        inventory.push(newItem);
        // Send the newly created item as JSON
        res.status(201).json(newItem);
    } catch (error) {
        // Handle error and send a 500 server error with error message
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to update an existing inventory item
app.put('/api/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, quantity } = req.body;
    if (!name || quantity <= 0) {
        // Send a 400 bad request with error message if required fields are missing or invalid
        res.status(400).json({ message: 'Name and quantity are required and quantity must be greater than 0.' });
        return;
    }
    try {
        // Find the item by ID and update it
        const itemIndex = inventory.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            // Send a 404 not found if item does not exist
            res.status(404).json({ message: 'Item not found.' });
            return;
        }
        inventory[itemIndex] = {
            id: id,
            name: name,
            quantity: quantity,
        };
        // Send the updated item as JSON
        res.status(200).json(inventory[itemIndex]);
    } catch (error) {
        // Handle error and send a 500 server error with error message
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to delete an inventory item
app.delete('/api/items/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Find the item by ID and remove it from the inventory
        const initialLength = inventory.length;
        inventory.filter((item) => item.id !== id);
        // Check if the item was removed
        if (inventory.length === initialLength) {
            // Send a 404 not found if item does not exist
            res.status(404).json({ message: 'Item not found.' });
            return;
        }
        // Send a 200 OK response
        res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (error) {
        // Handle error and send a 500 server error with error message
        res.status(500).json({ message: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Inventory Management System is running on port ${PORT}`);
});