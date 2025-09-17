// 代码生成时间: 2025-09-18 02:57:55
import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Data Model Interface
interface IUserData {
    id: string;
    name: string;
    email: string;
}

// In-memory database simulation
const users: IUserData[] = [];

// Helper function to find user by ID
const findUserById = (id: string): IUserData | undefined => {
    return users.find(user => user.id === id);
}

// Helper function to create a new user
const createUser = (user: Omit<IUserData, 'id'>): IUserData => {
    const newUser: IUserData = {
        id: uuidv4(),
        ...user,
    };
    users.push(newUser);
    return newUser;
}

// Express app instance
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint to retrieve all users
app.get('/users', (req: Request, res: Response) => {
    try {
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// POST endpoint to create a new user
app.post('/users', (req: Request, res: Response, next: NextFunction) => {
    const userData: Omit<IUserData, 'id'> = req.body;
    if (!userData.name || !userData.email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    try {
        const newUser = createUser(userData);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});