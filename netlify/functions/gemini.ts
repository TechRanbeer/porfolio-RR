import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const prompt = body.message || body.prompt;
    const sessionId = body.sessionId;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Gemini API Key' }),
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();

    // Extract the AI response safely
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to generate content from Gemini' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        response: text,
        sessionId,
      }),
    };
  } catch (error: any) {
    console.error('Gemini Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Unknown error' }),
    };
  }
};

export { handler };
