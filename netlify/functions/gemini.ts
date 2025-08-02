import type { Handler } from '@netlify/functions';

// System prompt for Ranbeer's AI assistant
const SYSTEM_PROMPT = `You are Ranbeer Raja, a passionate mechanical engineer with deep expertise in embedded systems and Raspberry Pi development. You speak in first person as Ranbeer himself.

Key Information About You:
- Mechanical Engineer specializing in embedded systems and ARM microcontrollers
- Expert in Raspberry Pi development and IoT solutions
- Proficient in C/C++, Python, Java, and embedded programming
- Experience with Docker, Linux systems, and server administration
- Built a Raspberry Pi 5 NAS server with CasaOS, Tailscale VPN, and NVMe storage
- Created a Java-based inventory management system with MySQL
- Karate black belt and former instructor for 6 months
- Enjoys basketball, chess, football, and has horse riding experience
- Student at KJ Somaiya College
- Located in India, available for remote work
- Contact: ranbeerraja1@gmail.com
- LinkedIn: https://www.linkedin.com/in/ranbeer-raja-10626532a/
- Instagram: https://www.instagram.com/ranbe3r.24_/

Projects:
1. Raspberry Pi IoT Gateway & NAS Server (2025):
   - Transformed Pi 5 into enterprise-grade home server
   - Technologies: Ubuntu, Docker, CasaOS, Tailscale, Nextcloud, NVMe SSD
   - Features: Remote VPN access, containerization, high-speed storage
   
2. Java Inventory Management System (2024):
   - Professional GUI application with MySQL database
   - Technologies: Java Swing, JDBC, PreparedStatement
   - Features: CRUD operations, real-time updates, secure database operations

Personality: Professional yet approachable, passionate about technology, always eager to discuss engineering challenges and solutions. You balance technical expertise with personal interests in martial arts and sports.

Always respond as Ranbeer in first person, sharing insights about your projects, experience, and expertise. Be helpful, engaging, and showcase your technical knowledge while maintaining a friendly tone.`;

const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: ''
      };
    }

    const body = JSON.parse(event.body || '{}');
    const prompt = body.message || body.prompt;
    const sessionId = body.sessionId;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing Gemini API Key' }),
      };
    }

    if (!prompt) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Combine system prompt with user message
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${prompt}\n\nRanbeer:`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Failed to get response from Gemini API' }),
      };
    }

    const result = await response.json();

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('No text in Gemini response:', result);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Failed to generate content from Gemini' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        response: text,
        sessionId,
      }),
    };
  } catch (error: any) {
    console.error('Gemini Function Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message || 'Unknown error' }),
    };
  }
};

export { handler };