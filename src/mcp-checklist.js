#!/usr/bin/env node

/**
 * MCP Checklist Server
 * 
 * Creates markdown checklists with checkboxes for use with Cursor and other MCP clients.
 * Uses a low-level approach with direct request handlers for maximum compatibility.
 * 
 * Usage:
 *   node mcp-checklist.js
 * 
 * Environment variables:
 *   OPENAI_API_KEY - Your OpenAI API key
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths and logging
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE = path.join(__dirname, 'mcp-checklist.log');
fs.writeFileSync(LOG_FILE, `=== MCP Checklist Server Log (${new Date().toISOString()}) ===\n`);

/**
 * Log a message to both console and the log file
 * @param {string} message Message to log
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} - ${message}`;
  console.error(entry);
  fs.appendFileSync(LOG_FILE, entry + '\n');
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

/**
 * Tool definition for the checklist creator
 * Used by MCP clients to understand tool capabilities and parameters
 */
const CHECKLIST_TOOL = {
  name: 'create_checklist',
  description: 'Create a detailed markdown checklist with checkboxes for the specified task or topic',
  inputSchema: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: 'The topic or task to create a checklist for (e.g., "building a web app")'
      },
      num_items: {
        type: 'integer',
        description: 'Number of items to include in the checklist (default: 5)'
      },
      random_string: {
        type: 'string',
        description: 'Alternative parameter for topic, used by some clients like Cursor'
      }
    }
  }
};

/**
 * Handles the creation and formatting of checklists
 */
class ChecklistProcessor {
  /**
   * Creates a checklist for the given parameters
   * @param {Object} params Parameters for checklist creation
   * @returns {Object} MCP-formatted response
   */
  async createChecklist(params) {
    log(`Creating checklist with params: ${JSON.stringify(params)}`);
    
    try {
      // Check API key
      if (!openai.apiKey) {
        log('ERROR: Missing OpenAI API key');
        return {
          content: [{
            type: 'text',
            text: 'Error: Missing OpenAI API key. Please set the OPENAI_API_KEY environment variable.'
          }],
          isError: true
        };
      }
      
      // Extract parameters with fallbacks
      const topic = params?.topic || params?.context || params?.random_string || 'implementing a snake game';
      const numItems = parseInt(params?.num_items || '5', 10);
      
      log(`Processing request for topic: "${topic}" with ${numItems} items`);
      
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `Create a detailed development checklist with exactly ${numItems} steps for ${topic}.

FORMAT REQUIREMENTS:
1. Each item must be a SINGLE LINE starting with an action verb (e.g., "Create", "Build", "Implement", "Design")
2. Items should be clear, concise, and actionable - no vague descriptions
3. Make each item a concrete task that can be checked off when completed
4. Format as a simple list with one task per line (NOT numbered)
5. Each item should be approximately 5-15 words in length
6. NO introductory text, explanations, or conclusions - ONLY the checklist items
7. Do NOT split a single item across multiple lines
8. NO placeholders or "(e.g., ...)" text within items`
          },
          { 
            role: 'user', 
            content: `Create a development checklist for: ${topic}` 
          }
        ]
      });
      
      // Get content from response
      const rawContent = response.choices[0]?.message?.content || 'Could not generate checklist';
      log('Checklist generated successfully');
      
      // Ensure proper checklist formatting
      const formattedChecklist = this.ensureChecklistFormat(rawContent, numItems);
      
      // Return formatted response
      return {
        content: [{
          type: 'text',
          text: formattedChecklist
        }]
      };
    } catch (error) {
      log(`ERROR generating checklist: ${error.message}`);
      return {
        content: [{
          type: 'text',
          text: `Error creating checklist: ${error.message}`
        }],
        isError: true
      };
    }
  }

  /**
   * Formats raw content into a proper Markdown checklist with checkboxes
   * @param {string} content Raw text content from OpenAI
   * @param {number} numItems Number of items to include in the checklist
   * @returns {string} Formatted Markdown checklist
   */
  ensureChecklistFormat(content, numItems) {
    log('Formatting raw content into checklist');
    
    // Clean up content - remove any title or header text
    let cleanContent = content
      .replace(/^(#+\s+.+?$|.+?\n={3,}|-{3,})/m, '') // Remove markdown headers
      .replace(/^(checklist|task list|todo|to-do|steps|plan)[:|-]\s*/im, '') // Remove common header text
      .trim();
    
    // Split content into lines and clean up
    let lines = cleanContent.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Extract items based on different possible formats
    let items = [];
    
    // Case 1: Content has numbered items (e.g., "1.", "2.", etc.)
    if (lines.some(line => /^\d+\./.test(line))) {
      items = lines
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
    } 
    // Case 2: Content has bullet points (-, *, •)
    else if (lines.some(line => /^[\-\*•]/.test(line))) {
      items = lines
        .filter(line => /^[\-\*•]/.test(line))
        .map(line => line.replace(/^[\-\*•]\s*/, '').trim());
    }
    // Case 3: Just plain lines without markers
    else if (lines.length >= 2) {
      items = lines;
    }
    // Case 4: If none of the above, try to split by sentences
    else {
      items = (cleanContent.match(/[^.!?]+[.!?]+/g) || [cleanContent])
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 3); // Minimum length filter
    }
    
    // Clean up each item
    items = items
      .map(item => {
        // Remove any additional numbering or bullets within the item
        return item.replace(/^(\d+\.|[\-\*•])\s*/, '')
          // Remove common prefixes like "Step X:"
          .replace(/^(step|task|item)\s+\d+\s*[:|-]\s*/i, '')
          .trim();
      })
      // Filter out empty or too-short items
      .filter(item => item.length > 3);
    
    // Ensure each item starts with a verb if it doesn't already
    items = items.map(item => {
      // Check if item already starts with a verb-like pattern
      if (!/^[A-Z][a-z]+\s/.test(item)) {
        // If not, add a generic verb prefix
        return `Implement ${item}`;
      }
      return item;
    });
    
    // Ensure we have exactly the requested number of items
    if (items.length > numItems) {
      items = items.slice(0, numItems);
    } else if (items.length < numItems) {
      // If we don't have enough items, pad with generic tasks
      const genericTasks = [
        "Create project documentation",
        "Set up version control",
        "Implement automated testing",
        "Conduct code review",
        "Perform user acceptance testing",
        "Optimize performance",
        "Fix any identified bugs",
        "Deploy to production environment",
        "Create user documentation",
        "Plan for future enhancements"
      ];
      
      while (items.length < numItems && items.length < 20) {
        const genericIndex = items.length % genericTasks.length;
        items.push(genericTasks[genericIndex]);
      }
    }
    
    // Format as a markdown checklist with checkboxes
    log(`Formatted ${items.length} checklist items`);
    return items
      .map((item, index) => `${index + 1}. [ ] ${item}`)
      .join('\n');
  }
}

/**
 * Create MCP server instance
 */
const server = new Server(
  {
    name: 'checklist-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Initialize checklist processor
const checklistProcessor = new ChecklistProcessor();

/**
 * Register request handler for listing available tools
 * This is called when a client connects and requests tool information
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  log('Listing available tools');
  return {
    tools: [CHECKLIST_TOOL]
  };
});

/**
 * Register request handler for tool execution
 * This is called when a client wants to use a tool
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  log(`Tool call request: ${request.params.name}`);
  
  if (request.params.name === 'create_checklist') {
    return await checklistProcessor.createChecklist(request.params.arguments);
  }
  
  // Handle unknown tool
  log(`ERROR: Unknown tool requested: ${request.params.name}`);
  return {
    content: [{
      type: 'text',
      text: `Unknown tool: ${request.params.name}`
    }],
    isError: true
  };
});

/**
 * Start the server
 */
async function main() {
  try {
    log('Initializing MCP server...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    log('Checklist MCP Server running on stdio');
  } catch (error) {
    log(`FATAL ERROR: ${error.message}`);
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Handle unexpected errors
process.on('uncaughtException', (error) => {
  log(`Uncaught exception: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  log(`Unhandled rejection: ${reason}`);
});

// Run the server
main(); 