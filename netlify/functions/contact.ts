import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const handler: Handler = async (event) => {
  console.log('Contact function called with method:', event.httpMethod);
  console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));

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
    // Try multiple environment variable names for Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 
                       process.env.SUPABASE_URL || 
                       process.env.REACT_APP_SUPABASE_URL;
    
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 
                       process.env.SUPABASE_ANON_KEY || 
                       process.env.REACT_APP_SUPABASE_ANON_KEY;

    console.log('Supabase URL found:', !!supabaseUrl);
    console.log('Supabase Key found:', !!supabaseKey);
    console.log('URL starts with:', supabaseUrl?.substring(0, 20));

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      console.error('Available env vars:', Object.keys(process.env));
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
            hasKey: !!supabaseKey,
            envKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
          }
        }),
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const body = JSON.parse(event.body);
    console.log('Parsed request body:', { ...body, message: body.message?.substring(0, 50) + '...' });
    
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'All fields are required',
          received: { name: !!name, email: !!email, subject: !!subject, message: !!message }
        }),
      };
    }

    console.log('Attempting to insert message into Supabase...');

    // Test Supabase connection first
    const { data: testData, error: testError } = await supabase
      .from('messages')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Supabase connection test failed:', testError);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Database connection failed',
          details: testError.message
        }),
      };
    }

    console.log('Supabase connection test successful');

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        read: false
      }])
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
          code: error.code
        }),
      };
    }

    console.log('Message saved successfully with ID:', data?.id);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully',
        id: data?.id
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
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack
      }),
    };
  }
};

export { handler };