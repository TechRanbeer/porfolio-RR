import React, { useState, useEffect } from 'react';
import { X, Send, Mail, Github, Linkedin, Instagram, CheckCircle } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

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

  // Formspree hook - replace 'YOUR_FORM_ID' with actual Formspree form ID
  const [state, handleSubmit] = useForm("xzzvybrb"); // Your actual Formspree form ID

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== FORMSPREE CONTACT FORM SUBMISSION START ===');
    console.log('Form data:', { ...formData, message: formData.message.substring(0, 50) + '...' });
    
    // Create FormData object for Formspree
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('email', formData.email);
    formDataObj.append('subject', formData.subject);
    formDataObj.append('message', formData.message);
    
    // Submit to Formspree
    await handleSubmit(formDataObj);
  };

  // Handle success
  useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        onClose();
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.succeeded, onClose]);

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
          {state.succeeded ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
              <p className="text-slate-300 mb-4">Thank you for reaching out. I'll get back to you soon!</p>
              <p className="text-sm text-slate-400">Your message has been delivered via Formspree. You can also reach me directly at ranbeerraja1@gmail.com</p>
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
                <form onSubmit={onSubmit} className="space-y-4">
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
                      <ValidationError 
                        prefix="Name" 
                        field="name"
                        errors={state.errors}
                        className="text-red-400 text-sm mt-1"
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
                      <ValidationError 
                        prefix="Email" 
                        field="email"
                        errors={state.errors}
                        className="text-red-400 text-sm mt-1"
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
                    <ValidationError 
                      prefix="Subject" 
                      field="subject"
                      errors={state.errors}
                      className="text-red-400 text-sm mt-1"
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
                    <ValidationError 
                      prefix="Message" 
                      field="message"
                      errors={state.errors}
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 text-white font-medium"
                  >
                    {state.submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending via Formspree...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                  <ValidationError 
                    errors={state.errors}
                    className="text-red-400 text-sm text-center"
                  />
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};