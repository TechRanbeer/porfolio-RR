// File: netlify/functions/gemini.ts

import { Handler } from '@netlify/functions';
import { generateResponse } from './geminiService';

const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { message, sessionId } = body;

    if (!message || !sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing message or sessionId' }),
      };
    }

    const response = await generateResponse(message, sessionId);

    return {
      statusCode: 200,
      body: JSON.stringify({ response }),
    };
  } catch (error) {
    console.error('Gemini function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

export { handler };
