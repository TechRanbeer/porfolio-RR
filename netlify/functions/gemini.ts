// netlify/functions/gemini.ts

import fetch from 'node-fetch'; // or use 'undici' for native fetch in Node.js

export const handler = async (event: any, context: any) => {
  // Retrieve the Gemini API Key from environment variables (set on Netlify)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gemini API Key not found" }),
    };
  }

  try {
    const response = await fetch('https://api.gemini.com/v1/endpoint', { // Change to actual Gemini API endpoint
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
