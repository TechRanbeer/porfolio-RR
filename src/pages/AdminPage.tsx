import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Calendar, User, Eye, EyeOff, Trash2, RefreshCw, Search, Filter } from 'lucide-react';
import { getAllMessages, markMessageAsRead, deleteMessage, ContactMessage } from '../lib/firebase';

const AdminPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Simple password authentication
  const ADMIN_PASSWORD = 'ranbeer2025admin';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    setIsAuthenticated(isAuth);
    
    if (isAuth) {
      fetchMessages();
    }
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log('Fetching messages from Firebase...');
      const fetchedMessages = await getAllMessages();
      console.log('Messages fetched:', fetchedMessages.length);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Error fetching messages: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string, read: boolean) => {
    try {
      await markMessageAsRead(messageId, read);
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read } : msg
        )
      );

      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, read } : null);
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await deleteMessage(messageId);
      
      // Update local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterRead === 'all' ||
      (filterRead === 'read' && message.read) ||
      (filterRead === 'unread' && !message.read);

    return matchesSearch && matchesFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg transition-all duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.15),transparent_50%)] pointer-events-none"></div>
      
      {/* Header */}
      <div className="relative z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Admin Dashboard (Firebase)</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchMessages}
              disabled={loading}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold">{messages.length}</p>
                <p className="text-slate-400">Total Messages</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <EyeOff className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold">{messages.filter(m => !m.read).length}</p>
                <p className="text-slate-400">Unread Messages</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">{messages.filter(m => m.read).length}</p>
                <p className="text-slate-400">Read Messages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value as 'all' | 'read' | 'unread')}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-bold">Messages ({filteredMessages.length})</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-400" />
                  <p>Loading messages from Firebase...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 border-b border-slate-700/30 cursor-pointer transition-colors hover:bg-slate-700/30 ${
                        selectedMessage?.id === message.id ? 'bg-slate-700/50' : ''
                      } ${!message.read ? 'border-l-4 border-l-purple-500' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium">{message.name}</span>
                          {!message.read && (
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {message.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mb-1">{message.email}</p>
                      <p className="font-medium text-sm mb-2">{message.subject}</p>
                      <p className="text-sm text-slate-400 line-clamp-2">
                        {message.message.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            {selectedMessage ? (
              <>
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Message Details</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkAsRead(selectedMessage.id!, !selectedMessage.read)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                          selectedMessage.read 
                            ? 'bg-orange-600/20 text-orange-300 hover:bg-orange-600/30' 
                            : 'bg-green-600/20 text-green-300 hover:bg-green-600/30'
                        }`}
                      >
                        {selectedMessage.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id!)}
                        className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">From</label>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Email</label>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Subject</label>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Date</label>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {selectedMessage.createdAt?.toDate?.()?.toLocaleString() || 'Unknown date'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Message</label>
                    <div className="bg-slate-700/30 p-4 rounded-lg mt-2">
                      <p className="whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <Mail className="w-4 h-4" />
                      Reply via Email
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-slate-400 h-full flex items-center justify-center">
                <div>
                  <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;