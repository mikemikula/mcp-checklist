#!/bin/bash

# Cleanup script for MCP Checklist project
# Keeps only the necessary files and organizes the project structure

echo "Cleaning up MCP Checklist project..."

# Create a backup directory
mkdir -p backup

# Backup all current files in src
cp -r src/* backup/

# Clean up the src directory - keep only essential files
find src -type f -not -name "mcp-checklist.js" -not -name "mcp-checklist.log" -not -path "*/functions/*" -not -path "*/utils/*" -exec mv {} backup/ \;

# Make sure mcp-checklist.js is executable
chmod +x src/mcp-checklist.js

# Ensure proper log directory exists
mkdir -p logs
touch logs/.gitkeep

# Update package.json
if [ -f package.json ]; then
  # If jq is installed, use it to update package.json
  if command -v jq &> /dev/null; then
    jq '.bin = {"mcp-checklist": "src/mcp-checklist.js"} | .main = "src/mcp-checklist.js"' package.json > package.json.new
    mv package.json.new package.json
  else
    echo "jq not found. Please update package.json manually."
  fi
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  cat > .gitignore << EOL
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Dependency directories
node_modules/

# Environment variables
.env

# Backup
backup/

# macOS specific
.DS_Store
EOL
fi

echo "Cleanup complete!"
echo "Your clean MCP Checklist project now contains only essential files."
echo "Removed files have been backed up to the 'backup' directory." 