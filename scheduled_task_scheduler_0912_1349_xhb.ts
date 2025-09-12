// 代码生成时间: 2025-09-12 13:49:18
import express, { Request, Response } from 'express';
import { setInterval, clearInterval } from 'timers';

// Define the type for a task function
type TaskFunction = () => void;

// Scheduler class to manage tasks
class TaskScheduler {
  private tasks: Map<string, NodeJS.Timeout>;

  constructor() {
    this.tasks = new Map<string, NodeJS.Timeout>();
  }

  // Method to add a new task
  addTask(taskName: string, interval: number, task: TaskFunction): void {
    if (this.tasks.has(taskName)) {
      throw new Error(`Task with name ${taskName} already exists`);
    }
    this.tasks.set(taskName, setInterval(task, interval));
  }

  // Method to remove a task
  removeTask(taskName: string): void {
    if (!this.tasks.has(taskName)) {
      throw new Error(`Task with name ${taskName} does not exist`);
    }
    clearInterval(this.tasks.get(taskName) as NodeJS.Timeout);
    this.tasks.delete(taskName);
  }

  // Method to stop all tasks
  stopAllTasks(): void {
    this.tasks.forEach((timeout, taskName) => {
      clearInterval(timeout as NodeJS.Timeout);
      this.tasks.delete(taskName);
    });
  }
}

// Define a sample task
const sampleTask: TaskFunction = () => {
  console.log('Sample task executed');
};

// Create an instance of the scheduler
const scheduler = new TaskScheduler();

// Schedule the sample task to run every 5 seconds
scheduler.addTask('sampleTask', 5000, sampleTask);

// Create an express server
const app = express();
const port = 3000;

// Endpoint to remove a task by name
app.post('/remove-task', (req: Request, res: Response) => {
  try {
    const { taskName } = req.body;
    scheduler.removeTask(taskName);
    res.status(200).json({ message: `Task ${taskName} removed` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to stop all tasks
app.post('/stop-all-tasks', (req: Request, res: Response) => {
  try {
    scheduler.stopAllTasks();
    res.status(200).json({ message: 'All tasks stopped' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});