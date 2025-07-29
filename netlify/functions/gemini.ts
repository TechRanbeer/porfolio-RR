// netlify/functions/gemini.ts
import { generateResponse } from './gemini'; // Local import from the same folder

export const handler = async (event: any, context: any) => {
  const userMessage = JSON.parse(event.body).userMessage; // Assuming the message is sent in the request body
  
  try {
    // Call the generateResponse function to generate a response from Gemini API
    const responseText = await generateResponse(userMessage);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: responseText }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
