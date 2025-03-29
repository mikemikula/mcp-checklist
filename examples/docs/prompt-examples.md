# Recognizing When to Use the Checklist MCP

This document provides examples of prompts that would trigger an LLM to use the Checklist MCP tool.

## Prompt Patterns

The following keywords and phrases typically indicate that the Checklist MCP would be beneficial:

- "Create a checklist for..."
- "I need a checklist to..."
- "What steps should I follow for..."
- "Break down this task into steps..."
- "Give me a step-by-step guide for..."
- "What's the process for..."
- "Help me organize the workflow for..."
- "Generate a list of tasks for..."

## Example Prompts and Responses

### Example 1: Direct Request

**User Prompt:**
```
Create a checklist for building a REST API with Node.js.
```

**LLM Action:**
The LLM should invoke the `create_checklist` tool with parameters:
```json
{
  "context": "building a REST API with Node.js"
}
```

**Tool Response:**
```markdown
# Checklist for Building a REST API with Node.js

1. [ ] Set up project structure and initialize npm
2. [ ] Install essential packages (Express, etc.)
3. [ ] Configure environment variables
4. [ ] Design database schema
5. [ ] Set up connection to database
6. [ ] Create models for data entities
7. [ ] Implement API routes and controllers
8. [ ] Add middleware for authentication
9. [ ] Implement error handling
10. [ ] Add request validation
11. [ ] Write API tests
12. [ ] Set up logging
13. [ ] Implement rate limiting
14. [ ] Configure CORS
15. [ ] Document API endpoints
```

### Example 2: Implicit Request

**User Prompt:**
```
I'm starting to learn React Native and don't know where to begin.
```

**LLM Action:**
The LLM should recognize this as an opportunity for structured guidance and invoke:
```json
{
  "context": "getting started with React Native development",
  "num_items": 10
}
```

**Tool Response:**
```markdown
# Checklist for Getting Started with React Native

1. [ ] Install Node.js and npm
2. [ ] Set up development environment (React Native CLI or Expo)
3. [ ] Create your first React Native project
4. [ ] Understand the project structure
5. [ ] Learn basic React Native components
6. [ ] Build a simple UI
7. [ ] Implement navigation between screens
8. [ ] Connect to an API
9. [ ] Test on multiple devices/simulators
10. [ ] Learn debugging techniques
```

### Example 3: Task Organization Request

**User Prompt:**
```
I need to implement user authentication in my web app. There are so many approaches and I'm feeling overwhelmed.
```

**LLM Action:**
The LLM should recognize the need for organizing this complex task:
```json
{
  "context": "implementing user authentication in a web application"
}
```

## Best Practices for LLMs

When using the Checklist MCP:

1. **Analyze the request** - Determine if a structured checklist would help the user
2. **Set appropriate parameters** - Adjust context and number of items based on task complexity
3. **Follow up with assistance** - After presenting the checklist, offer help on specific steps
4. **Consider user expertise** - Tailor the detail level to the user's apparent knowledge level

## Integration with Workflow

The Checklist MCP works best as part of a larger assistance strategy:

1. First, provide high-level guidance or answer questions
2. Use the Checklist MCP to organize implementation steps
3. Offer detailed help on specific checklist items as requested
4. Suggest resources for challenging steps 