# Building Custom MCPs for Cursor: Architecture & Limitations

This document outlines the architectural considerations, supported features, and limitations when building custom Model Context Protocol (MCP) servers for Cursor IDE.

## Cursor's MCP Implementation Overview

Cursor implements MCP as a client that can connect to external MCP servers. Understanding its implementation details is crucial for building compatible custom MCPs:

1. **Transport Methods**
   - Cursor supports two transport types:
     - `stdio`: For command-based MCPs (run as local processes)
     - `sse`: For network-based MCPs (connect via HTTP Server-Sent Events)
   - Both methods are configured through the Cursor UI in Settings > Features > MCP

2. **Current Feature Support**
   - **Tools**: Fully supported in current Cursor versions
   - **Resources**: Not yet supported (planned for future releases)
   - This means your MCP can expose functions/tools but not provide contextual resources

3. **Tool Quantity Limitations**
   - Cursor only sends the first 40 tools to the Agent
   - This applies to the combined total across all active MCP servers
   - Consider tool prioritization in your design if you have many tools

## Architectural Constraints for Custom MCPs

When designing a custom MCP for Cursor, keep these constraints in mind:

1. **Local Execution Only**
   - Cursor communicates with MCP servers from your local machine
   - MCPs may not work properly when accessing Cursor over SSH or other remote development environments
   - Design assuming local execution context

2. **Security Model**
   - No standardized authentication system currently
   - Security is managed through local execution privileges
   - Consider how to manage sensitive operations and credentials

3. **UI Integration**
   - Limited UI feedback for configuration errors
   - No environment variable support in the UI configuration
   - Must handle configuration validation and errors gracefully

4. **Performance Considerations**
   - Tool descriptions contribute to token usage
   - Keep tool descriptions concise but clear
   - Consider latency impacts for network-based tools

## Best Practices for Custom MCP Development

To create effective custom MCPs for Cursor:

1. **Tool Design**
   - Expose functionality as discrete, focused tools
   - Use clear, concise descriptions
   - Group related functionality logically
   - Consider the 40-tool limit when determining scope

2. **Error Handling**
   - Implement robust error reporting
   - Provide clear feedback for configuration issues
   - Handle network/process failures gracefully

3. **Configuration**
   - Provide clear documentation for setup
   - Consider alternatives for sensitive values (since UI doesn't support env vars)
   - Make configuration steps as simple as possible

4. **Testing**
   - Test with Cursor's specific implementation
   - Verify behavior with both direct tool calls and natural language requests

## Implementation Examples

### Command-line (stdio) MCP

```shell
# Example of a command-line MCP server configuration
npx -y @smithery/cli@latest run @your-package/mcp-server --config "{\"key\":\"value\"}"
```

### Network-based (sse) MCP

```
# Example of SSE MCP server configuration
http://localhost:3000/mcp
```

## Future Considerations

Cursor's MCP implementation is evolving. When building custom MCPs:

1. **Resource Support**: Design with future resource support in mind
2. **Authentication**: Plan for more robust authentication options
3. **Configuration**: The community is requesting file-based configuration similar to Claude Desktop

## References

- [Cursor Official Documentation: Model Context Protocol](https://docs.cursor.com/context/model-context-protocol)
- [Model Context Protocol Official Documentation](https://modelcontextprotocol.io/introduction)
- [Cursor MCP Directory](https://cursor.directory/mcp) 