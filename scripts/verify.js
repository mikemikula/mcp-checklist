#!/usr/bin/env node

// Simple verification script to check if all dependencies are properly installed
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Check if package.json exists
if (!fs.existsSync(path.join(rootDir, 'package.json'))) {
  console.error(chalk.red('Error: package.json not found.'));
  process.exit(1);
}

// Check if src/index.js exists
if (!fs.existsSync(path.join(rootDir, 'src', 'index.js'))) {
  console.error(chalk.red('Error: src/index.js not found.'));
  process.exit(1);
}

// Check if all required dependencies are installed
const requiredDeps = ['openai', 'commander', 'inquirer', 'chalk', 'dotenv'];
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const installedDeps = Object.keys(packageJson.dependencies || {});

const missingDeps = requiredDeps.filter(dep => !installedDeps.includes(dep));

if (missingDeps.length > 0) {
  console.error(chalk.red(`Error: Missing dependencies: ${missingDeps.join(', ')}`));
  console.log(chalk.yellow('Run "pnpm install" to install missing dependencies.'));
  process.exit(1);
}

console.log(chalk.green('Verification passed! The project is ready to use.'));
process.exit(0); 