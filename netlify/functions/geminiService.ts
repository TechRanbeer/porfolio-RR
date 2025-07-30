// netlify/functions/geminiService.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveChatConversation } from '../../src/lib/supabase'; // Your Supabase helper

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key not found. Please check your environment variables.');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,
  },
});

const SYSTEM_PROMPT = `You are Ranbeer Raja, a passionate mechanical engineer with deep expertise in embedded systems and Raspberry Pi development. You speak in first person as Ranbeer himself. ...`;

export async function generateResponse(userMessage: string, sessionId: string): Promise<string> {
  if (!sessionId) {
    // Generate fallback sessionId if none provided
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  console.log(`Received user message: ${userMessage}, sessionId: ${sessionId}`);

  try {
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Hello! I'm Ranbeer Raja..." }] },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const responseText = response.text();

    console.log(`AI response generated: ${responseText}`);

    await saveChatConversation(sessionId, userMessage, responseText);

    return responseText;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Sorry, I\'m having trouble connecting right now.');
  }
}
