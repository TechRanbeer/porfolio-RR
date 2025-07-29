// netlify/functions/gemini.ts

import { generateResponse } from '../../services/gemini'; // Correct the path to access the service

export const handler = async (event: any, context: any) => {
  try {
    // Check if the body exists and is properly formatted
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No body provided' }), // If no body, return an error
      };
    }

    const parsedBody = JSON.parse(event.body);
    
    // Ensure that 'message' exists in the parsed body
    if (!parsedBody.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message not provided in request body' }),
      };
    }

    const userMessage = parsedBody.message;

    // Call generateResponse and handle the response
    const responseText = await generateResponse(userMessage);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }), // Send the response
    };
  } catch (error) {
    console.error('Error in Gemini function:', error); // Log the error for debugging

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }), // Handle any error
    };
  }
};
