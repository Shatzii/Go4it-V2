import { NextRequest, NextResponse } from 'next/server';

interface WorkflowStep {
  id: string;
  type: 'llm' | 'tool' | 'condition' | 'transform';
  config: any;
  inputs?: string[];
  outputs?: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  connections: Array<{
    from: string;
    to: string;
    output?: string;
    input?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { workflow, inputs, options = {} } = await request.json();

    if (!workflow || !inputs) {
      return NextResponse.json(
        { error: 'Missing required parameters: workflow and inputs' },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Execute workflow steps in order
    const results: Record<string, any> = {};
    const context = { ...inputs };

    for (const step of workflow.steps) {
      try {
        const stepResult = await executeStep(step, context, OPENAI_API_KEY, options);
        results[step.id] = stepResult;

        // Update context with step outputs
        if (step.outputs) {
          step.outputs.forEach(output => {
            if (stepResult[output] !== undefined) {
              context[output] = stepResult[output];
            }
          });
        }
      } catch (error) {
        console.error(`Error executing step ${step.id}:`, error);
        return NextResponse.json(
          { error: `Failed to execute step ${step.id}: ${error.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      workflow: workflow.id,
      results,
      finalContext: context,
      executedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json(
      { error: 'Internal server error during workflow execution' },
      { status: 500 }
    );
  }
}

async function executeStep(
  step: WorkflowStep,
  context: Record<string, any>,
  apiKey: string,
  options: any
): Promise<any> {
  switch (step.type) {
    case 'llm':
      return await executeLLMStep(step, context, apiKey, options);

    case 'tool':
      return await executeToolStep(step, context, options);

    case 'condition':
      return await executeConditionStep(step, context);

    case 'transform':
      return await executeTransformStep(step, context);

    default:
      throw new Error(`Unknown step type: ${step.type}`);
  }
}

async function executeLLMStep(
  step: WorkflowStep,
  context: Record<string, any>,
  apiKey: string,
  options: any
): Promise<any> {
  const { model = 'gpt-4', prompt, temperature = 0.7, maxTokens = 1000 } = step.config;

  // Replace context variables in prompt
  let processedPrompt = prompt;
  Object.entries(context).forEach(([key, value]) => {
    processedPrompt = processedPrompt.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), String(value));
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: processedPrompt }],
      temperature,
      max_tokens: maxTokens,
      ...options
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content,
    usage: data.usage,
    model: data.model
  };
}

async function executeToolStep(
  step: WorkflowStep,
  context: Record<string, any>,
  options: any
): Promise<any> {
  const { tool, parameters = {} } = step.config;

  // Process parameters with context
  const processedParams = { ...parameters };
  Object.entries(processedParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      Object.entries(context).forEach(([ctxKey, ctxValue]) => {
        processedParams[key] = (value as string).replace(
          new RegExp(`\\$\\{${ctxKey}\\}`, 'g'),
          String(ctxValue)
        );
      });
    }
  });

  // Execute tool based on type
  switch (tool) {
    case 'web-search':
      return await performWebSearch(processedParams);

    case 'database-query':
      return await performDatabaseQuery(processedParams);

    case 'api-call':
      return await performAPICall(processedParams);

    case 'file-operation':
      return await performFileOperation(processedParams);

    default:
      throw new Error(`Unknown tool: ${tool}`);
  }
}

async function executeConditionStep(
  step: WorkflowStep,
  context: Record<string, any>
): Promise<any> {
  const { condition, trueValue, falseValue } = step.config;

  // Simple condition evaluation (can be extended with a proper expression parser)
  try {
    const result = evaluateCondition(condition, context);
    return {
      result,
      value: result ? trueValue : falseValue
    };
  } catch (error) {
    throw new Error(`Condition evaluation failed: ${error.message}`);
  }
}

async function executeTransformStep(
  step: WorkflowStep,
  context: Record<string, any>
): Promise<any> {
  const { operation, input, parameters = {} } = step.config;

  const inputValue = context[input] || input;

  switch (operation) {
    case 'uppercase':
      return { result: String(inputValue).toUpperCase() };

    case 'lowercase':
      return { result: String(inputValue).toLowerCase() };

    case 'split':
      return { result: String(inputValue).split(parameters.delimiter || ',') };

    case 'join':
      return { result: Array.isArray(inputValue) ? inputValue.join(parameters.delimiter || ',') : inputValue };

    case 'extract':
      const regex = new RegExp(parameters.pattern, parameters.flags || 'g');
      const matches = String(inputValue).match(regex);
      return { result: matches };

    default:
      throw new Error(`Unknown transform operation: ${operation}`);
  }
}

// Helper functions for tool execution
async function performWebSearch(params: any) {
  // Implement web search using a search API
  const { query, limit = 10 } = params;
  // This would integrate with a search service like SerpAPI, Google Custom Search, etc.
  return { results: [], query, limit };
}

async function performDatabaseQuery(params: any) {
  // Implement database queries
  const { table, conditions, limit = 100 } = params;
  // This would connect to your database
  return { records: [], table, conditions, limit };
}

async function performAPICall(params: any) {
  const { url, method = 'GET', headers = {}, body } = params;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return await response.json();
}

async function performFileOperation(params: any) {
  // Implement file operations (read, write, etc.)
  const { operation, path, content } = params;
  // This would handle file system operations
  return { operation, path, success: true };
}

function evaluateCondition(condition: string, context: Record<string, any>): boolean {
  // Simple condition evaluation - can be enhanced with a proper parser
  // Example: "age > 16 && sport === 'soccer'"
  try {
    // Replace context variables
    let processedCondition = condition;
    Object.entries(context).forEach(([key, value]) => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      processedCondition = processedCondition.replace(regex, JSON.stringify(value));
    });

    // Use Function constructor for safe evaluation (in production, use a proper expression parser)
    const evaluate = new Function('context', `return ${processedCondition};`);
    return Boolean(evaluate(context));
  } catch (error) {
    throw new Error(`Invalid condition: ${condition}`);
  }
}