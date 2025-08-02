import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

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
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables:', { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseKey,
        envKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
      });
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    console.log('Creating Supabase client with URL:', supabaseUrl.substring(0, 20) + '...');

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = JSON.parse(event.body || '{}');
    
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    console.log('Attempting to insert message for:', email);

    const { data, error } = await supabase
      .from('messages')
      .insert({
        name,
        email,
        subject,
        message,
        read: false
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
        body: JSON.stringify({ error: 'Failed to save message' }),
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
        message: 'Message sent successfully',
        data 
      }),
    };

  } catch (error: any) {
    console.error('Contact function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };