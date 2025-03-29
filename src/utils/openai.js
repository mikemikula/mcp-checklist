import OpenAI from 'openai';

/**
 * Creates an OpenAI client instance
 * @param {string} apiKey OpenAI API key
 * @returns {OpenAI} OpenAI client instance
 */
function createOpenAIClient(apiKey) {
  return new OpenAI({
    apiKey: apiKey
  });
}

/**
 * Generates a checklist using OpenAI API
 * @param {string} apiKey OpenAI API key
 * @param {string} task The task description
 * @param {string} format The output format (markdown or json)
 * @returns {Promise<string>} The generated checklist
 */
export async function generateOpenAIChecklist(apiKey, task, format = 'markdown') {
  const openai = createOpenAIClient(apiKey);
  
  const systemPrompt = `You are a helpful assistant that creates detailed checklists for LLM agents to follow when completing tasks. 
Your checklist should break down the task into clear, sequential steps that are easy to follow.
Each step should be specific and actionable. Number the steps and include sub-steps where appropriate.
Structure your response in ${format === 'json' ? 'JSON format with steps and substeps arrays' : 'markdown format'}.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Create a detailed checklist for an LLM agent that needs to complete the following task: ${task}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
} 