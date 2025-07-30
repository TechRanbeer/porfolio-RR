import type { Handler } from '@netlify/functions';
import { generateResponse } from './geminiService';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { message, sessionId } = JSON.parse(event.body || '{}');

    if (!message || !sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: message and sessionId' }),
      };
    }

    const response = await generateResponse(message, sessionId);

    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (error: any) {
    console.error('Error in Gemini handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
