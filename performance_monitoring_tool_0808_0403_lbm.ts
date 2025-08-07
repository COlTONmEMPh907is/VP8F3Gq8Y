// 代码生成时间: 2025-08-08 04:03:02
import express from 'express';
import { performance } from 'perf_hooks';

interface PerformanceData {
  cpuUsage: number;
  memoryUsage: number;
  processUptime: string;
}

// Function to get system performance data
async function getSystemPerformanceData(): Promise<PerformanceData> {
  try {
    const os = require('os');
    const cpus = os.cpus();
    const totalIdleTime = cpus.reduce((sum, cpu) => {
      return sum + cpu.times.idle;
    }, 0);
    const totalCpuTime = cpus.reduce((sum, cpu) => {
      return sum + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.irq + cpu.times.idle;
    }, 0);
    const cpuUsage = 100 - ((totalIdleTime / totalCpuTime) * 100);

    const memoryUsage = process.memoryUsage().rss / (1024 * 1024);
    const processUptime = process.uptime().toString();

    return {
      cpuUsage,
      memoryUsage,
      processUptime
    };
  } catch (error) {
    throw new Error('Failed to get system performance data: ' + error.message);
  }
}

// Express app setup
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to get performance data
app.get('/api/performance', async (req, res) => {
  try {
    const performanceData = await getSystemPerformanceData();
    res.status(200).json(performanceData);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Performance monitoring tool listening at http://localhost:${port}`);
});