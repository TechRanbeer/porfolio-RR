// netlify/functions/gemini.ts

import { generateResponse } from '../../services/gemini'; // Import the function from services/gemini.ts

export const handler = async (event: any, context: any) => {
  const { userMessage } = JSON.parse(event.body); // Get user message from the request

  try {
    // Call the function to generate a response from Gemini API
    const responseText = await generateResponse(userMessage);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: responseText }), // Send back the generated response
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }), // Handle errors gracefully
    };
  }
};
