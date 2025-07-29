// netlify/functions/gemini.ts

import { generateResponse } from './geminiService'; // Correct import for functions directory

export const handler = async (event: any, context: any) => {
  try {
    // Check if body exists and is properly formatted
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No body provided' }),
      };
    }

    const parsedBody = JSON.parse(event.body);
    
    if (!parsedBody.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message not provided in request body' }),
      };
    }

    const userMessage = parsedBody.message;

    // Call the AI service to get the response
    const responseText = await generateResponse(userMessage);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }), // Return the AI's response
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
