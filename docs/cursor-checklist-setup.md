# Cursor MCP Checklist Server Setup

This document provides instructions for setting up the MCP Checklist server in Cursor.

## Configuration for Cursor

1. In Cursor, go to **Settings** → **Features** → **MCP Servers**
2. Configure your Checklist server using this format:

```json
"Checklist": {
  "command": "node",
  "args": [
    "/path/to/your/mcp-checklist/src/mcp-checklist.js"
  ],
  "env": {
    "OPENAI_API_KEY": "your-api-key-here",
    "DEBUG": "true" 
  }
}
```

Replace `/path/to/your/mcp-checklist` with the actual path where you installed the project.

## Restart Cursor

1. Completely close/quit Cursor
2. Re-open Cursor to load the updated configuration

## Test the MCP server

Use these prompts to test the Checklist tool:

- **Simple test**: "Create a checklist"
- **With context**: "Create a checklist for developing a mobile app"
- **With parameters**: "Create a checklist with context='setting up CI/CD pipeline' and num_items=7"

## Troubleshooting

If you're encountering issues:

1. **Check logs**: Look at the log file at `src/mcp-checklist.log` for detailed error information.

2. **Test with MCP Inspector**: Run the MCP Inspector tool to directly test the server:
   ```bash
   cd /path/to/your/mcp-checklist
   npx @modelcontextprotocol/inspector
   ```
   Then open http://localhost:5173 in your browser.

3. **Common issues**:
   - Make sure your OPENAI_API_KEY is valid
   - Ensure no other MCP server is running on the same port
   - Check that the file paths in your configuration are correct

## Parameter Handling

The server is designed to handle various parameter configurations:

1. **With explicit parameters**: When parameters like `context` and `num_items` are provided
2. **With default parameters**: When called with minimal parameters, it uses sensible defaults
3. **Robust error handling**: Catches and reports errors with clear messages
4. **Comprehensive logging**: Logs all actions to both console and file for debugging

The server logs to both console.error and a local log file (`src/mcp-checklist.log`) to make debugging easier. This can be particularly helpful when used within Cursor, where direct console output might not be visible. 