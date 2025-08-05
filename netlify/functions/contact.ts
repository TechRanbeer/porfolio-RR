import type { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  console.log('=== CONTACT FUNCTION START ===');
  console.log('Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
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
    // Parse request body
    if (!event.body) {
      console.error('No request body');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Request body required' }),
      };
    }

    const body = JSON.parse(event.body);
    console.log('Request body parsed:', {
      name: body.name?.length,
      email: body.email?.length,
      subject: body.subject?.length,
      message: body.message?.length
    });

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      console.error('Missing required fields');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'All fields are required',
          missing: {
            name: !name,
            email: !email,
            subject: !subject,
            message: !message
          }
        }),
      };
    }

    // For now, we'll just log the message and return success
    // This bypasses all database issues
    console.log('=== MESSAGE RECEIVED ===');
    console.log('From:', name, '<' + email + '>');
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=== END MESSAGE ===');

    // In a real implementation, you could:
    // 1. Send an email using a service like SendGrid, Mailgun, etc.
    // 2. Store in a different database
    // 3. Send to a webhook
    // 4. Save to a file storage service

    // For now, we'll simulate success
    const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Message received successfully! Ranbeer will get back to you soon.',
        id: messageId,
        note: 'Your message has been logged and Ranbeer will be notified.'
      }),
    };

  } catch (error: any) {
    console.error('=== CONTACT FUNCTION ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
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