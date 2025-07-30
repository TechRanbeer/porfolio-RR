// netlify/functions/gemini.ts

import { generateResponse } from './geminiService';

export const handler = async (event: any, context: any) => {
  console.log('Received request to generate response');

  try {
    if (!event.body) {
      console.log('Error: No body provided');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No body provided' }),
      };
    }

    const parsedBody = JSON.parse(event.body);
    console.log('Parsed Body:', parsedBody);

    const { message, sessionId } = parsedBody;

    if (!message) {
      console.log('Error: Message not provided in request body');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message not provided in request body' }),
      };
    }

    // Pass sessionId to the generateResponse function
    const responseText = await generateResponse(message, sessionId);

    console.log('Generated AI Response:', responseText);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    console.error('Error in gemini function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
