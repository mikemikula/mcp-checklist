#!/usr/bin/env node

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Print installation success message with instructions for Cursor integration
 */
function printSuccessMessage() {
  console.log('\n' + chalk.green.bold('✓ cursor-mcp-checklist installed successfully!'));
  console.log('\n' + chalk.yellow('To use with Cursor:'));
  console.log(chalk.white('  1. Open Cursor IDE'));
  console.log(chalk.white('  2. Go to Settings > Features'));
  console.log(chalk.white('  3. Find "MCP Servers" and click "Add New MCP Server"'));
  console.log(chalk.white('  4. Configure with these settings:'));
  console.log(chalk.cyan('     Name: ') + chalk.white('checklist'));
  console.log(chalk.cyan('     Type: ') + chalk.white('command'));
  
  // Get the installed path
  const globalNodeModules = getGlobalNodeModulesPath();
  const packagePath = path.join(globalNodeModules, 'cursor-mcp-checklist');
  const serverPath = path.join(packagePath, 'src', 'mcp-server.js');
  
  if (fs.existsSync(serverPath)) {
    console.log(chalk.cyan('     Command: ') + chalk.white(`node ${serverPath}`));
  } else {
    console.log(chalk.cyan('     Command: ') + chalk.white('npx -y cursor-mcp-checklist-server'));
  }

  console.log('\n' + chalk.yellow('Example prompts to use in Cursor:'));
  console.log(chalk.white('  - "Create a checklist for implementing authentication"'));
  console.log(chalk.white('  - "Break down the steps to deploy this React application"'));
  console.log(chalk.white('  - "Make a checklist for refactoring this component"'));

  console.log('\n' + chalk.gray('For more information, see the README.md file.'));
}

/**
 * Attempt to get the global node_modules path
 */
function getGlobalNodeModulesPath() {
  try {
    // Try different methods to determine global node_modules path
    const npmRoot = spawn('npm', ['root', '-g'], { encoding: 'utf8' });
    if (npmRoot.stdout) {
      return npmRoot.stdout.toString().trim();
    }
    
    // Fallback methods based on OS
    if (os.platform() === 'win32') {
      return path.join(os.homedir(), 'AppData', 'Roaming', 'npm', 'node_modules');
    } else {
      return '/usr/local/lib/node_modules';
    }
  } catch (error) {
    // If we can't determine the path, return a generic instruction
    return '';
  }
}

// Execute main function
printSuccessMessage(); 