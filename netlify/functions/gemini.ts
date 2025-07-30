// File: netlify/functions/geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseServer } from './supabaseServer'; 


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const generateResponse = async (message: string, sessionId: string): Promise<string> => {
  try {
    const chatHistory = await fetchChatHistory(sessionId);

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    await logMessage(sessionId, message, responseText);

    return responseText;
  } catch (error) {
    console.error('generateResponse error:', error);
    return 'Sorry, there was an error processing your request.';
  }
};

const fetchChatHistory = async (sessionId: string) => {
  const { data, error } = await supabaseServer
    .from('chats')
    .select('user_message, bot_response')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }

  return data.map((entry: any) => ({
    role: 'user',
    parts: [{ text: entry.user_message }],
  })).flatMap((userEntry: any, i: number) => [
    userEntry,
    {
      role: 'model',
      parts: [{ text: data[i]?.bot_response || '' }],
    },
  ]);
};

const logMessage = async (sessionId: string, userMessage: string, botResponse: string) => {
  const { error } = await supabaseServer.from('chats').insert([
    {
      session_id: sessionId,
      user_message: userMessage,
      bot_response: botResponse,
    },
  ]);

  if (error) {
    console.error('Error logging message:', error);
  }
};
