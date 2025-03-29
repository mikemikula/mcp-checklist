# MCP Checklist Server

A Model Context Protocol (MCP) server that generates markdown checklists with checkboxes for use with AI tools like Cursor and Claude.

## Features

- Creates properly formatted markdown checklists with checkboxes
- Works with Cursor, Claude Desktop, and any MCP-compatible client
- Supports customizable number of checklist items
- Formats output as `1. [ ] Item` for easy use in markdown documents
- Uses a low-level API approach for maximum compatibility

## Installation

```bash
# Clone the repository
git clone https://github.com/mikemikula/mcp-checklist.git
cd mcp-checklist

# Install dependencies using pnpm
pnpm install
```

## Setup for Cursor

1. Open Cursor
2. Go to Settings → Features → MCP Servers
3. Add a new server with these settings:

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

Replace the path with the actual path to your `mcp-checklist.js` file and add your OpenAI API key.

4. Restart Cursor to load the new configuration

For detailed setup instructions and troubleshooting, see [Cursor Setup Guide](docs/cursor-checklist-setup.md).

## Usage

In Cursor, you can use the checklist tool with prompts like:

- "Create a checklist for implementing user authentication"
- "Make a checklist for deploying a React app to AWS"
- "I need a checklist for optimizing a website's performance"

For more information on how AI assistants use this tool, see [MCP Integration Guide](docs/mcp-section.md).

## Testing with MCP Inspector

1. Run the server:
   ```
   node src/mcp-checklist.js
   ```

2. In another terminal, run MCP Inspector:
   ```
   npx @modelcontextprotocol/inspector
   ```

3. Connect to your server:
   - Enter: `child:node src/mcp-checklist.js`
   - Click "Connect"

4. Use the tool:
   - Go to the "Tools" tab
   - Click on "create_checklist"
   - Fill in the "topic" field
   - Click "Execute"

For more detailed testing instructions, see [MCP Guide](docs/mcp-guide.md).

## Debugging

Check the log file at `src/mcp-checklist.log` for detailed logs of server activity.

## Documentation

- [Cursor Setup Guide](docs/cursor-checklist-setup.md) - Instructions for setting up the MCP server in Cursor
- [MCP Guide](docs/mcp-guide.md) - Detailed guide on the MCP implementation
- [MCP Integration](docs/mcp-section.md) - How LLMs use this MCP server

## License

MIT

## Acknowledgements

- Built with the Model Context Protocol (MCP) SDK
- Powered by OpenAI's GPT models 