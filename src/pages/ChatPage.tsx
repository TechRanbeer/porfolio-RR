import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

interface ChatPageProps {
  fetchGeminiData: (message: string) => Promise<string>;
}

const ChatPage: React.FC<ChatPageProps> = ({ fetchGeminiData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const botResponse = await fetchGeminiData(userMessage.content);
      const botMessage: Message = { role: 'bot', content: botResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Error fetching Gemini data:', err);
      setError('Something went wrong while talking to Gemini.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="h-[70vh] overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4 space-y-3 bg-white dark:bg-zinc-900 shadow">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 dark:bg-blue-900 text-left'
                : 'bg-green-100 dark:bg-green-900 text-left'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong> {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-zinc-500 italic">Gemini is typing...</div>
        )}
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatPage;
