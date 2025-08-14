// Removed Supabase functionality as requested
// Keeping interfaces for type compatibility
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

// No-op functions to replace Supabase functionality
export const trackPageView = async (pagePath: string) => {
  console.log('Page view tracked (no-op):', pagePath);
};

export const trackProjectView = async (projectId: string) => {
  console.log('Project view tracked (no-op):', projectId);
};

export const submitContactMessage = async (
  messageData: Omit<Message, 'id' | 'read' | 'created_at'>
) => {
  console.log('Contact message submitted (no-op):', messageData);
  // Return a mock response to maintain compatibility
  return {
    id: 'mock-id',
    ...messageData,
    read: false,
    created_at: new Date().toISOString(),
  };
};

export const saveChatConversation = async (
  sessionId: string,
  userMessage: string,
  aiResponse: string
) => {
  console.log('Chat conversation saved (no-op):', { sessionId, userMessage, aiResponse });
};