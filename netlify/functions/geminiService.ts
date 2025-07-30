// netlify/functions/geminiService.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveChatConversation } from '../../src/lib/supabase'; // Adjust path if needed

// Use environment variables securely on the server
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key not found. Please check your environment variables.');
}

// Initialize GoogleGenerativeAI client and model once
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
  console.log(`Generating response for session: ${sessionId}, message: ${userMessage}`);

  try {
    // Start chat with system prompt (history)
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Hello! I'm Ranbeer Raja..." }] },
      ],
    });

    // Send user's message and await response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const responseText = response.text();

    console.log(`AI response: ${responseText}`);

    // Save conversation with sessionId in Supabase
    await saveChatConversation(sessionId, userMessage, responseText);

    return responseText;
  } catch (error: any) {
    console.error('Error generating response:', error);
    throw new Error('Sorry, I\'m having trouble connecting right now.');
  }
}
