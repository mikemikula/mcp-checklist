# MCP Checklist Server Guide

This guide explains how to use the MCP Checklist server implementation for generating checklists.

## Key Features of the Implementation

The implementation in `src/mcp-checklist.js` provides:

1. **Direct Request Handling**: Implements explicit request handlers for MCP tools
2. **Parameter Processing**: Handles parameter validation and extraction efficiently
3. **Proper Response Formatting**: Returns properly formatted markdown checklists
4. **Robust Error Handling**: Catches and reports errors with clear messages
5. **Comprehensive Logging**: Logs all actions to both console and file for debugging

## Using with Cursor

To use this implementation with Cursor:

1. **Update your Cursor settings**:

```json
"Checklist": {
  "command": "node",
  "args": [
    "/path/to/your/mcp-checklist/src/mcp-checklist.js"
  ],
  "env": {
    "OPENAI_API_KEY": "your-api-key-here"
  }
}
```

2. **Restart Cursor** to load the new configuration

3. **Use in prompts**:
   - "Create a checklist for building a web application"
   - "Create a checklist for implementing user authentication"

## Testing with MCP Inspector

To test with the MCP Inspector:

1. **Start the server**:
   ```bash
   node src/mcp-checklist.js
   ```

2. **In another terminal, run MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector
   ```

3. **Connect to your server**:
   - Enter: `child:node src/mcp-checklist.js`
   - Click "Connect"

4. **Use the tool**:
   - Navigate to the "Tools" tab
   - Click on "create_checklist"
   - Fill in the "topic" field (e.g., "building a React application")
   - Click "Execute"

## Debugging

If you encounter issues:

1. **Check the log file**: The server logs all activity to `src/mcp-checklist.log`
2. **Check environment variables**: Ensure `OPENAI_API_KEY` is set correctly
3. **Monitor terminal output**: The server also logs to stderr

## How It Works

1. The server defines a tool with a schema specifying the expected parameters
2. It registers handlers for tool listing and execution
3. When a tool is called, it extracts parameters, calls OpenAI, and returns the response
4. All errors are caught and formatted appropriately

This implementation provides a reliable way to generate checklists through the MCP protocol. 