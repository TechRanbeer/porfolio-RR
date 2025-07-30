// File: src/components/ChatBot.tsx

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(uuidv4());

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          sessionId,
        }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: 'Something went wrong.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to server.' }]);
    }

    setInputValue('');
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white shadow rounded-lg">
      <div className="h-96 overflow-y-auto space-y-3 p-2 border-b">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md w-fit max-w-[80%] ${
              msg.sender === 'user' ? 'ml-auto bg-blue-100' : 'mr-auto bg-gray-200'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-sm italic text-gray-500">Ranbeer Raja is typing...</div>
        )}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded-l-md"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
