import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey || !geminiApiKey) {
  throw new Error("Missing one or more required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export const handler: Handler = async (event, context) => {
  try {
    // Your custom function logic here, e.g., querying Supabase or calling Gemini API
    
    // Example: just return a success message for demo
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Gemini function executed successfully" }),
    };
  } catch (error: any) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};
