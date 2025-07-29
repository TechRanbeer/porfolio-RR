import { createClient } from '@supabase/supabase-js';

// Use process.env for environment variables in Netlify functions
const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  session_id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
}

export interface PageAnalytics {
  id: string;
  page_path: string;
  visitor_id: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
}

export interface ProjectView {
  id: string;
  project_id: string;
  visitor_id: string;
  created_at: string;
}

// Analytics functions
export const trackPageView = async (pagePath: string) => {
  const visitorId = getOrCreateVisitorId();
  
  try {
    await supabase.from('page_analytics').insert({
      page_path: pagePath,
      visitor_id: visitorId,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackProjectView = async (projectId: string) => {
  const visitorId = getOrCreateVisitorId();
  
  try {
    await supabase.from('project_views').insert({
      project_id: projectId,
      visitor_id: visitorId
    });
  } catch (error) {
    console.error('Error tracking project view:', error);
  }
};

export const submitContactMessage = async (messageData: Omit<Message, 'id' | 'read' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error submitting message:', error);
    throw error;
  }
};

export const saveChatConversation = async (sessionId: string, userMessage: string, aiResponse: string) => {
  try {
    await supabase.from('chat_conversations').insert({
      session_id: sessionId,
      user_message: userMessage,
      ai_response: aiResponse
    });
  } catch (error) {
    console.error('Error saving chat conversation:', error);
  }
};

// Helper function to get or create visitor ID
function getOrCreateVisitorId(): string {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
}
