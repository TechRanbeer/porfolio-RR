// netlify/functions/gemini.ts

import { generateResponse } from '../../services/gemini'; // Correct relative path

export const handler = async (event: any, context: any) => {
  try {
    const userMessage = JSON.parse(event.body).message; // Assuming you are sending a message in the request body
    const responseText = await generateResponse(userMessage); // Call generateResponse function

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }), // Send the response
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }), // Handle any error
    };
  }
};
