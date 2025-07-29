// netlify/functions/gemini.ts

import { generateResponse } from './geminiService'; // Correct import for functions directory

export const handler = async (event: any, context: any) => {
  console.log('Received request to generate response'); // Debugging log
  try {
    // Check if body exists and is properly formatted
    if (!event.body) {
      console.log('Error: No body provided'); // Debugging log
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No body provided' }),
      };
    }

    const parsedBody = JSON.parse(event.body);
    console.log('Parsed Body:', parsedBody); // Debugging log
    
    if (!parsedBody.message) {
      console.log('Error: Message not provided in request body'); // Debugging log
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message not provided in request body' }),
      };
    }

    const userMessage = parsedBody.message;

    // Call the AI service to get the response
    const responseText = await generateResponse(userMessage);

    console.log('Generated AI Response:', responseText); // Debugging log

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }), // Return the AI's response
    };
  } catch (error) {
    console.error('Error in gemini function:', error); // Debugging log
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};
