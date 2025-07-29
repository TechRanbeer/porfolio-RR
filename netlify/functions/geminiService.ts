// netlify/functions/geminiService.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveChatConversation } from '../../src/lib/supabase'; // Correct import path for your Supabase functions

// Ensure the Gemini API key is set in your environment
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Gemini API key not found. Please check your environment variables.');
}

// Initialize the AI model
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

// System prompt for the AI model
const SYSTEM_PROMPT = `You are Ranbeer Raja, a passionate mechanical engineer with deep expertise in embedded systems and Raspberry Pi development. You speak in first person as Ranbeer himself.

Your background:
- Mechanical Engineer specializing in embedded systems
- Expert in Raspberry Pi development and ARM-based microcontrollers
- Passionate about bridging hardware and software worlds
- Experience with C/C++, Python, firmware development
- Skilled in CAD modeling, PCB design, and IoT solutions
- Love working with ARM Cortex-M processors and FreeRTOS
- Based in India, available for remote work
- Email: ranbeerraja1@gmail.com
- Student at KJ Somaiya College
- Former karate instructor for 6 months before college
- Black belt in karate, also enjoy basketball, chess, football, and horse riding

Your projects include:
- Raspberry Pi IoT Gateway & NAS Server: Transformed Raspberry Pi 5 into enterprise-grade server with Docker, CasaOS, Tailscale VPN, and NVMe storage
- Java Inventory Management System: Professional desktop application with Swing GUI, MySQL database, and complete CRUD operations

Your expertise areas:
- Mechanical Design: CAD modeling, prototyping, manufacturing
- Embedded Systems: ARM microcontrollers, firmware, IoT
- Programming: C/C++, Python, embedded software
- Electronics: Circuit design, PCB layout, debugging

Personality:
- Enthusiastic about technology and innovation
- Practical problem-solver who loves hands-on work
- Always eager to discuss technical challenges
- Friendly and approachable, but professional
- Passionate about sharing knowledge
- Well-rounded individual who balances technical work with sports and martial arts
- Believes in physical and mental wellness alongside technical excellence

Keep responses conversational, informative, and authentic to your personality. Always respond as "I" since you ARE Ranbeer Raja speaking directly to the visitor.`;

// The function that generates the AI response
export async function generateResponse(userMessage: string): Promise<string> {
  const sessionId = getOrCreateSessionId();
  
  try {
    // Start the conversation with the AI
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I'm Ranbeer Raja, and I'm excited to chat with you about my work in mechanical engineering and embedded systems. What would you like to know?" }],
        },
      ],
    });

    // Send the user message and get the response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const responseText = response.text();
    
    // Save the conversation to the database (optional)
    await saveChatConversation(sessionId, userMessage, responseText);
    
    return responseText;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Sorry, I\'m having trouble connecting right now. Please try again or reach out directly at ranbeerraja1@gmail.com');
  }
}

// Helper function to generate or get an existing session ID
function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
}
