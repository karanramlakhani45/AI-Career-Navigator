import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am your AI Career Navigator. Ask me anything about interviews, resumes, or career paths!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot/chat', { 
        message: input,
        history: messages
      });
      
      setMessages(prev => [...prev, { role: 'model', text: res.data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl flex-grow flex flex-col overflow-hidden">
        <div className="bg-slate-900 border-b border-slate-700 p-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="text-pink-400" /> CareerNav AI Assistant
          </h2>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 flex gap-3 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-700 text-slate-200 rounded-tl-sm border border-slate-600'
              }`}>
                {msg.role === 'model' && <Bot className="w-6 h-6 flex-shrink-0 mt-1 text-pink-400" />}
                <div className="prose prose-invert max-w-none">
                  {msg.text}
                </div>
                {msg.role === 'user' && <User className="w-6 h-6 flex-shrink-0 mt-1 text-blue-200" />}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-400 rounded-2xl rounded-tl-sm p-4 border border-slate-600 flex gap-2 items-center">
                <Bot className="w-5 h-5 text-pink-400" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 bg-slate-900 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about interview prep, skills, etc..."
              className="flex-grow bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
