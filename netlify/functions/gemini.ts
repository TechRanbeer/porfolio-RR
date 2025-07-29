// netlify/functions/gemini.ts

import { generateResponse } from '../../services/gemini'; // Adjust the path as needed for your directory structure

export const handler = async (event: any, context: any) => {
  try {
    const userMessage = JSON.parse(event.body).message; // Assuming you are sending a message in the request body
    const responseText = await generateResponse(userMessage);

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
