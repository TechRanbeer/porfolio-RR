// netlify/functions/gemini.ts

import { generateResponse } from './geminiService'; // Adjusted relative path based on your structure

export const handler = async (event: any) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No request body provided' }),
      };
    }

    const { message, sessionId } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message not provided in request body' }),
      };
    }

    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Session ID not provided in request body' }),
      };
    }

    const responseText = await generateResponse(message, sessionId);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error: any) {
    console.error('Error in Gemini function:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
