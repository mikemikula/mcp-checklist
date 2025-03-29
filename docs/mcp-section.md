### Using as an MCP server
This package can also be used as a standard MCP server in Cursor, which allows AI assistants to directly call it to generate checklists.

## How LLMs Use This MCP

When integrated with Cursor, LLMs can detect from user prompts when to use the checklist MCP based on context clues and intent. The LLM will recognize when a user needs task organization, step-by-step guidance, or process planning.

### Prompt Detection

LLMs will analyze user prompts for keywords and phrases that indicate a checklist would be helpful, such as:
- "Create a checklist for..."
- "Break down this task into steps..."
- "How should I approach..." 
- "What's the procedure for..."

For more examples and detailed prompt patterns, see the `examples/docs/prompt-examples.md` file.

### Invocation Method

When the LLM identifies that a checklist would be beneficial, it will:
1. Call the `create_checklist` tool with relevant parameters
2. Parse the returned checklist data
3. Format and present the checklist to the user in a structured way

This happens transparently to the user, who simply receives a well-organized checklist in response to their query.
