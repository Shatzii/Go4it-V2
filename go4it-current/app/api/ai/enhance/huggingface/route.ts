import { NextRequest, NextResponse } from 'next/server';

interface HuggingFaceResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { task, input, model, options = {} } = await request.json();

    if (!task || !input) {
      return NextResponse.json(
        { error: 'Missing required parameters: task and input' },
        { status: 400 }
      );
    }

    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HF_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      );
    }

    let endpoint = '';
    let payload: any = {};

    // Map tasks to appropriate Hugging Face models
    switch (task) {
      case 'sentiment-analysis':
        endpoint = 'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest';
        payload = { inputs: input };
        break;

      case 'text-generation':
        endpoint = `https://api-inference.huggingface.co/models/${model || 'microsoft/DialoGPT-medium'}`;
        payload = {
          inputs: input,
          parameters: {
            max_length: options.maxLength || 100,
            temperature: options.temperature || 0.7,
            do_sample: true,
            ...options
          }
        };
        break;

      case 'summarization':
        endpoint = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
        payload = {
          inputs: input,
          parameters: {
            max_length: options.maxLength || 150,
            min_length: options.minLength || 50,
            ...options
          }
        };
        break;

      case 'translation':
        const targetLang = options.targetLang || 'en';
        endpoint = `https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-${options.sourceLang || 'de'}-${targetLang}`;
        payload = { inputs: input };
        break;

      case 'question-answering':
        endpoint = 'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2';
        payload = {
          inputs: {
            question: options.question,
            context: input
          }
        };
        break;

      case 'text-classification':
        endpoint = `https://api-inference.huggingface.co/models/${model || 'microsoft/DialoGPT-medium'}`;
        payload = { inputs: input };
        break;

      case 'image-generation':
        // Use Stability AI or similar for image generation
        endpoint = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';
        payload = {
          inputs: input,
          parameters: {
            negative_prompt: options.negativePrompt || '',
            num_inference_steps: options.steps || 20,
            guidance_scale: options.guidanceScale || 7.5,
            ...options
          }
        };
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported task: ${task}` },
          { status: 400 }
        );
    }

    // Make request to Hugging Face API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Hugging Face API error: ${response.status} - ${errorData}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      data: result,
      task,
      model: model || 'default',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Enhancement API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during AI processing' },
      { status: 500 }
    );
  }
}