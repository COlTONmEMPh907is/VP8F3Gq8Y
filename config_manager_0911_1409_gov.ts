// 代码生成时间: 2025-09-11 14:09:12
import express from 'express';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Promisify the readFile function for easier use with async/await
const readFile = util.promisify(fs.readFile);

interface ConfigManagerOptions {
  configsPath: string;
}

class ConfigManager {
  // Options for the ConfigManager
  private options: ConfigManagerOptions;
  private app: express.Application;

  constructor(options: ConfigManagerOptions) {
    this.options = options;
    this.app = express();
    this.initializeRoutes();
  }

  // Initialize Express routes
  private initializeRoutes() {
    this.app.get('/config/:configName', this.getConfig.bind(this));
    this.app.put('/config/:configName', this.updateConfig.bind(this));
  }

  // Load a configuration file
  private async loadConfig(configName: string): Promise<object | null> {
    try {
      // Read the configuration file
      const configContent = await readFile(path.join(this.options.configsPath, `${configName}.json`));
      // Parse the JSON content
      return JSON.parse(configContent.toString());
    } catch (error) {
      // Handle file not found or JSON parsing error
      console.error('Error loading configuration:', error);
      return null;
    }
  }

  // Update a configuration file
  private async updateConfig(req: express.Request, res: express.Response): Promise<void> {
    const configName = req.params.configName;
    try {
      // Read the current configuration
      const currentConfig = await this.loadConfig(configName);
      if (!currentConfig) {
        return res.status(404).send('Configuration not found.');
      }
      // Merge the new configuration with the current one
      const newConfig = { ...currentConfig, ...req.body };
      // Write the new configuration to the file
      await fs.promises.writeFile(
        path.join(this.options.configsPath, `${configName}.json`),
        JSON.stringify(newConfig, null, 2),
        'utf8'
      );
      res.send('Configuration updated successfully.');
    } catch (error) {
      // Handle errors in updating the configuration file
      res.status(500).send('Failed to update configuration.');
    }
  }

  // Get a configuration file
  private async getConfig(req: express.Request, res: express.Response): Promise<void> {
    const configName = req.params.configName;
    try {
      const config = await this.loadConfig(configName);
      if (!config) {
        return res.status(404).send('Configuration not found.');
      }
      res.json(config);
    } catch (error) {
      res.status(500).send('Failed to retrieve configuration.');
    }
  }

  // Start the Express server
  public startServer(port: number): void {
    this.app.listen(port, () => {
      console.log(`Config Manager is running on port ${port}`);
    });
  }
}

// Example usage
const configManager = new ConfigManager({ configsPath: './configs' });
configManager.startServer(3000);