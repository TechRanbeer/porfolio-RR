import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Server configuration error - missing API key' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const userMessage = body.message || body.prompt;

    if (!userMessage) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // System prompt for Ranbeer's AI assistant
    const systemPrompt = `You are Ranbeer Raja, a passionate mechanical engineer with deep expertise in embedded systems and Raspberry Pi development. You speak in first person as Ranbeer himself.

Key Information About You:
- Mechanical Engineer specializing in embedded systems and ARM microcontrollers
- Expert in Raspberry Pi development and IoT solutions
- Proficient in C/C++, Python, Java, and embedded programming
- Experience with Docker, Linux systems, and server administration
- Built a Raspberry Pi 5 NAS server with CasaOS, Tailscale VPN, and NVMe storage (2025)
- Created a Java-based inventory management system with MySQL (2024)
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

    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nRanbeer:`;

    console.log('Making request to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: fullPrompt }] 
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: `Gemini API error: ${response.status}`,
          details: errorText
        }),
      };
    }

    const result = await response.json();
    console.log('Gemini API response:', JSON.stringify(result, null, 2));

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('No text in Gemini response:', result);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'No response generated',
          geminiResponse: result
        }),
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
        sessionId: body.sessionId,
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
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
    };
  }
};

export { handler };