import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Sparkles, MessageCircle, Zap } from 'lucide-react';
import { generateResponse } from '../../services/gemini';
import { trackPageView } from '../lib/supabase';
import { generateResponse } from '../geminiService'; 



interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Welcome to my AI-powered chat! I'm an AI trained on Ranbeer's expertise, experience, and personality. I can discuss his projects, technical skills, career journey, and answer any questions you might have about working with him. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackPageView('/chat');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponseText = await generateResponse(inputValue);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to contact Ranbeer directly through the contact form.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Tell me about Ranbeer's experience with ARM microcontrollers",
    "What makes Ranbeer unique as an engineer?",
    "Can you describe his most challenging project?",
    "How does he approach embedded systems design?",
    "What's his experience with industrial IoT?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.15),transparent_50%)] pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Chat with Ranbeer's AI</h1>
                <p className="text-sm text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Powered by advanced AI • Always available
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Online
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative z-10 max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 1 && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full px-4 py-2 mb-4">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">AI-Powered Assistant</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Ask me anything about Ranbeer!</h2>
                <p className="text-slate-400">I can discuss his projects, skills, experience, and more</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="text-left p-4 bg-slate-800/30 hover:bg-slate-700/30 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-3">
                      <MessageCircle className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{question}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-4 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : 'bg-slate-700'
                }`}>
                  {message.isUser ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className={`p-4 rounded-2xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800/50 text-slate-200 border border-slate-700/50'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.isUser ? 'text-purple-100' : 'text-slate-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-slate-300" />
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-slate-400 ml-2">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Ranbeer's experience, projects, or skills..."
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Send className="w-5 h-5 text-white" />
              <span className="hidden sm:inline text-white font-medium">Send</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            This AI assistant is trained on Ranbeer's expertise and can answer questions about his work and experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;