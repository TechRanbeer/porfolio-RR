// netlify/functions/gemini.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { generateResponse } from '../../services/gemini'; // Correct path to your service

// Load backend environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const geminiApiKey = process.env.GEMINI_API_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey || !geminiApiKey) {
  throw new Error('Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY environment variables');
}

// Initialize Supabase client with service role key for backend
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const handler: Handler = async (event, context) => {
  try {
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

    // You can pass geminiApiKey to generateResponse if needed
    const responseText = await generateResponse(userMessage, geminiApiKey);

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
