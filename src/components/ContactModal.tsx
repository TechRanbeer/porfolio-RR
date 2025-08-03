import React, { useState } from 'react';
import { X, Send, Mail, Github, Linkedin, Instagram, CheckCircle } from 'lucide-react';
import { submitContactMessage } from '../lib/supabase';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== CONTACT FORM SUBMISSION START ===');
    console.log('Form data:', { ...formData, message: formData.message.substring(0, 50) + '...' });
    setIsSubmitting(true);

    try {
      console.log('Making fetch request to contact function...');
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response received:');
      console.log('- Status:', response.status);
      console.log('- Status Text:', response.statusText);
      console.log('- Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${errorText}` };
        }
        
        console.error('Parsed error:', errorData);
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();
      console.log('Success response:', result);
      
      setIsSubmitted(true);
      console.log('Form submitted successfully, showing success message');
      
      setTimeout(() => {
        console.log('Closing modal and resetting form');
        onClose();
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 2000);
      
    } catch (error) {
      console.error('=== CONTACT FORM ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error sending message: ${errorMessage}`);
    } finally {
      console.log('Setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Get In Touch</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-slate-300">Thank you for reaching out. I'll get back to you soon!</p>
            </div>
          ) : (
            <>
              {/* Social Links */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Connect with me</h3>
                <div className="flex gap-4">
                  <a
                    href="mailto:ranbeerraja1@gmail.com"
                    className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-xl transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="font-medium text-white">Email</div>
                      <div className="text-sm text-slate-400">ranbeerraja1@gmail.com</div>
                    </div>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/ranbeer-raja-10626532a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-xl transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <Linkedin className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-white">LinkedIn</div>
                      <div className="text-sm text-slate-400">Professional</div>
                    </div>
                  </a>
                </div>
                <div className="flex gap-4 mt-4">
                  <a
                    href="https://github.com/TechRanbeer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-xl transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <Github className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">GitHub</div>
                      <div className="text-sm text-slate-400">Code & Projects</div>
                    </div>
                  </a>
                  <a
                    href="https://www.instagram.com/ranbe3r.24_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-600/50 p-4 rounded-xl transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <Instagram className="w-5 h-5 text-pink-400" />
                    <div>
                      <div className="font-medium text-white">Instagram</div>
                      <div className="text-sm text-slate-400">Personal</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Send me a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Project Discussion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                      placeholder="Tell me about your project or how I can help..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-white font-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};