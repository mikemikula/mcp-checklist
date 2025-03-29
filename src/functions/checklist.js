import { generateOpenAIChecklist } from '../utils/openai.js';

/**
 * Generates a checklist for the given task
 * @param {Object} params Function parameters
 * @param {string} params.task Task description
 * @param {string} params.format Output format (markdown or json)
 * @param {string} params.apiKey OpenAI API key (optional, will use process.env.OPENAI_API_KEY if not provided)
 * @returns {Promise<Object>} Object containing the generated checklist and metadata
 */
export async function generateChecklist(params) {
  try {
    const { task, format = 'markdown', apiKey = process.env.OPENAI_API_KEY } = params;
    
    if (!task || typeof task !== 'string' || task.trim() === '') {
      throw new Error('Task description is required');
    }
    
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    // Generate checklist
    const checklist = await generateOpenAIChecklist(apiKey, task, format);
    
    return {
      checklist,
      format,
      taskLength: task.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating checklist:', error);
    throw new Error(`Failed to generate checklist: ${error.message}`);
  }
} 