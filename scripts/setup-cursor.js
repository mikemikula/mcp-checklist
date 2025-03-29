#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import inquirer from 'inquirer';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log(chalk.cyan.bold('\nCursor MCP Checklist Setup\n'));
  console.log(chalk.white('This script will help you set up the MCP Checklist tool in Cursor.'));

  const userSettings = await promptUserSettings();
  const cursorConfigPath = findCursorConfigPath();

  if (!cursorConfigPath) {
    console.log(chalk.yellow('\nCursor config not found. Please follow the manual setup instructions:'));
    printManualInstructions();
    return;
  }

  try {
    updateCursorConfig(cursorConfigPath, userSettings);
    console.log(chalk.green.bold('\n✓ Successfully updated Cursor configuration!'));
    console.log(chalk.white('\nPlease restart Cursor for the changes to take effect.'));
    console.log(chalk.white('\nYou can now use the checklist MCP with prompts like:'));
    console.log(chalk.white('  - "Create a checklist for implementing authentication"'));
    console.log(chalk.white('  - "Break down the steps to deploy this React application"'));
  } catch (error) {
    console.error(chalk.red('\nFailed to update Cursor configuration:'), error.message);
    console.log(chalk.yellow('\nPlease follow the manual setup instructions:'));
    printManualInstructions();
  }
}

function findCursorConfigPath() {
  const homedir = os.homedir();
  let configPath;

  // Check for different OS paths
  if (os.platform() === 'darwin') {
    // macOS
    configPath = path.join(homedir, 'Library', 'Application Support', 'Cursor', 'User', 'settings.json');
  } else if (os.platform() === 'win32') {
    // Windows
    configPath = path.join(homedir, 'AppData', 'Roaming', 'Cursor', 'User', 'settings.json');
  } else {
    // Linux and others
    configPath = path.join(homedir, '.config', 'Cursor', 'User', 'settings.json');
  }

  return fs.existsSync(configPath) ? configPath : null;
}

async function promptUserSettings() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'mcpName',
      message: 'What name would you like to give to the MCP in Cursor?',
      default: 'checklist'
    },
    {
      type: 'list',
      name: 'installType',
      message: 'How would you like to run the MCP server?',
      choices: [
        { name: 'Use npx (recommended for most users)', value: 'npx' },
        { name: 'Use global installation path', value: 'global' },
        { name: 'Use local development', value: 'local' }
      ]
    }
  ]);

  return answers;
}

function updateCursorConfig(configPath, userSettings) {
  let config = {};
  
  // Read existing config if it exists
  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(configContent);
    } catch (error) {
      throw new Error(`Failed to parse Cursor config: ${error.message}`);
    }
  }

  // Ensure mcp field exists
  if (!config.mcp) {
    config.mcp = { servers: [] };
  } else if (!config.mcp.servers) {
    config.mcp.servers = [];
  }

  // Create new MCP server entry
  const serverCommand = userSettings.installType === 'npx' 
    ? 'npx -y cursor-mcp-checklist-server'
    : `node ${getGlobalInstallPath()}/cursor-mcp-checklist/src/mcp-server.js`;

  // For local development, use a direct path
  const localServerCommand = `node ${process.cwd()}/src/mcp-server.js`;

  // Check if server already exists
  const existingServerIndex = config.mcp.servers.findIndex(
    server => server.name === userSettings.mcpName
  );

  if (existingServerIndex >= 0) {
    // Update existing server
    config.mcp.servers[existingServerIndex] = {
      name: userSettings.mcpName,
      type: 'command',
      command: userSettings.installType === 'local' ? localServerCommand : serverCommand
    };
  } else {
    // Add new server
    config.mcp.servers.push({
      name: userSettings.mcpName,
      type: 'command',
      command: userSettings.installType === 'local' ? localServerCommand : serverCommand
    });
  }

  // Write updated config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
}

function getGlobalInstallPath() {
  try {
    // This is a simplification - in a real script, we'd use more robust methods
    if (os.platform() === 'win32') {
      return path.join(os.homedir(), 'AppData', 'Roaming', 'npm', 'node_modules');
    } else {
      return '/usr/local/lib/node_modules';
    }
  } catch (error) {
    return '/usr/local/lib/node_modules';
  }
}

function printManualInstructions() {
  console.log(chalk.white('\n1. Open Cursor IDE'));
  console.log(chalk.white('2. Go to Settings > Features'));
  console.log(chalk.white('3. Find "MCP Servers" and click "Add New MCP Server"'));
  console.log(chalk.white('4. Configure with these settings:'));
  console.log(chalk.cyan('   Name: ') + chalk.white('checklist'));
  console.log(chalk.cyan('   Type: ') + chalk.white('command'));
  console.log(chalk.cyan('   Command: ') + chalk.white('npx -y cursor-mcp-checklist-server'));
  console.log(chalk.white('\nAlternatively, if you installed globally:'));
  console.log(chalk.cyan('   Command: ') + chalk.white('node /path/to/global/node_modules/cursor-mcp-checklist/src/mcp-server.js'));
  console.log(chalk.white('\nFor local development:'));
  console.log(chalk.cyan('   Command: ') + chalk.white(`node ${process.cwd()}/src/mcp-server.js`));
}

// Run the main function
main().catch(error => {
  console.error(chalk.red('Error:'), error);
  process.exit(1);
}); 