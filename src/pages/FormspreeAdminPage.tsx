import React from 'react';
import { ArrowLeft, Mail, ExternalLink, Globe, Settings, MessageCircle, BarChart3 } from 'lucide-react';

const FormspreeAdminPage: React.FC = () => {
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
            <h1 className="text-xl font-bold">Message Management</h1>
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ranbeer Raja
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Contact Form Management</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Your contact form is now powered by Formspree - a reliable, professional service designed specifically for contact forms.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Reliable Delivery</h3>
                <p className="text-slate-300 leading-relaxed">
                  All messages are delivered directly to your email inbox (ranbeerraja1@gmail.com) instantly and reliably.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-slate-300 leading-relaxed">
                  View submission statistics, manage forms, and track performance through Formspree's dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Easy Management</h3>
                <p className="text-slate-300 leading-relaxed">
                  Configure spam protection, auto-responses, and form settings through the Formspree interface.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Professional Service</h3>
                <p className="text-slate-300 leading-relaxed">
                  Trusted by thousands of developers worldwide. No more connection issues or database problems.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Access Formspree Dashboard */}
        <div className="bg-slate-800/30 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 text-center">
          <h3 className="text-2xl font-bold mb-4">Access Your Messages</h3>
          <p className="text-slate-300 mb-6 leading-relaxed">
            To view and manage all your contact form submissions, access your Formspree dashboard. 
            You'll be able to see all messages, configure settings, and set up notifications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://formspree.io/forms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-white font-medium"
            >
              <ExternalLink className="w-5 h-5" />
              Open Formspree Dashboard
            </a>
            <a
              href="mailto:ranbeerraja1@gmail.com"
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 text-white font-medium"
            >
              <Mail className="w-5 h-5" />
              Check Email Inbox
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
          <h4 className="text-lg font-bold mb-3">How It Works:</h4>
          <div className="space-y-2 text-slate-300">
            <p>1. <strong>Contact Form Submissions:</strong> All messages are sent directly to your email</p>
            <p>2. <strong>Email Notifications:</strong> You'll receive instant email notifications for new messages</p>
            <p>3. <strong>Dashboard Access:</strong> View all submissions and analytics at formspree.io</p>
            <p>4. <strong>Spam Protection:</strong> Built-in spam filtering keeps your inbox clean</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormspreeAdminPage;