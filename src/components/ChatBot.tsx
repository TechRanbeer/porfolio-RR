import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Markdown parser function
const parseMarkdown = (text: string): string => {
  return text
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_ (but not inside words)
    .replace(/(?<!\w)\*(.+?)\*(?!\w)/g, '<em>$1</em>')
    .replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')
    // Code blocks: ```code```
    .replace(/```[\s\S]*?```/g, (match) => {
      const code = match.slice(3, -3).trim();
      return `<pre class="bg-gray-800 text-white p-2 rounded text-xs overflow-x-auto my-2"><code>${code}</code></pre>`;
    })
    // Inline code: `code`
    .replace(/`(.+?)`/g, '<code class="bg-gray-200 px-1 rounded text-sm">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="font-bold text-lg mt-2 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-bold text-xl mt-2 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-bold text-2xl mt-2 mb-1">$1</h1>')
    // Lists with bullets
    .replace(/^\*   (.+)$/gm, '<li class="ml-8">$1</li>')
    .replace(/^[\*\-] (.+)$/gm, '<li class="ml-4">$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li.*?<\/li>\s*)+/g, (match) => `<ul class="list-disc my-1">${match}</ul>`)
    // Numbered lists
    .replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4">$1</li>')
    // Line breaks - double newline for paragraphs
    .replace(/\n\n/g, '</p><p class="mb-2">')
    // Single line breaks
    .replace(/\n/g, '<br>');
};

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Ranbeer's AI assistant. I can answer questions about his background, projects, and expertise. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from server');
      }

      const data = await response.json();
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: content,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again or contact Ranbeer directly at ranbeerraja1@gmail.com",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error during fetch request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Chat with AI Ranbeer</span>
        </div>
        <button onClick={onToggle} className="text-white hover:text-gray-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${message.isUser ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <div className="flex items-start space-x-2">
                {!message.isUser && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {message.isUser ? (
                  <p className="text-sm">{message.text}</p>
                ) : (
                  <div 
                    className="text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }}
                  />
                )}
                {message.isUser && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Ranbeer..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};