import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const handler: Handler = async (event) => {
  console.log('=== CONTACT FUNCTION START ===');
  console.log('Method:', event.httpMethod);

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
    // Get Supabase credentials
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    console.log('Environment check:');
    console.log('- Supabase URL available:', !!supabaseUrl);
    console.log('- Supabase Key available:', !!supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Server configuration error - missing Supabase credentials',
          debug: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey
          }
        }),
      };
    }

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { name, email, subject, message } = body;

    console.log('Form data received:', {
      name: name?.substring(0, 20) + '...',
      email: email?.substring(0, 20) + '...',
      subject: subject?.substring(0, 30) + '...',
      messageLength: message?.length
    });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'All fields are required',
          missing: { name: !name, email: !email, subject: !subject, message: !message }
        }),
      };
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');

    // Insert message into database
    console.log('Attempting to insert message...');
    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Failed to save message to database',
          details: error.message,
          code: error.code,
          hint: error.hint
        }),
      };
    }

    console.log('Message saved successfully:', data?.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Message sent successfully! Ranbeer will get back to you soon.',
        id: data?.id
      }),
    };

  } catch (error: any) {
    console.error('=== CONTACT FUNCTION ERROR ===');
    console.error('Error:', error);
    
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