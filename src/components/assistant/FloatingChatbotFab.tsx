import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, X, Maximize2, Send, Sparkles, 
  HelpCircle, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { askPibAssistant } from '../../services/assistantService';
import { AssistantMessageView } from './AssistantMessageView';
import type { AssistantMessage } from '../../types';

export const FloatingChatbotFab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'fab-welcome',
      sender: 'assistant',
      text: `Namaste! I am the **Official PIB AI Assistant**, powered by live Google Gemini API and grounded in authentic Government of India gazette records.\n\n- Ask about railway recruitments (CEN 06/2026), Ayushman Bharat, or Union Budget.\n- Request key dates, statistics, and eligibility criteria.\n- Answers cite authentic Press Information Bureau PRIDs.`,
      timestamp: new Date().toISOString()
    }
  ]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || query).trim();
    if (!text || isTyping) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    try {
      const response = await askPibAssistant(text);
      setMessages(prev => [...prev, response]);
    } catch {
      // handled inside askPibAssistant
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'Explain Ayushman Bharat 70+ in simple language',
    'What are the eligibility criteria for RRB NTPC 3,548 posts?',
    'Summarise latest Union Budget announcements'
  ];

  return (
    <>
      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#0b3558] text-white p-3.5 flex items-center justify-between border-b border-sky-900">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-lg bg-white/10 flex items-center justify-center">
                <img src="/assets/brand/pib-official-logo.png" alt="PIB" className="w-5 h-5 rounded-full object-contain bg-white p-0.5" />
              </span>
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <span>PIB AI Assistant</span>
                  <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-mono">
                    Grounded
                  </span>
                </div>
                <div className="text-[10px] text-sky-200">Official Government Releases</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/assistant"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-sky-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Expand to Full Page Assistant"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-sky-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize Chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'user' ? (
                  <div className="bg-[#0b3558] text-white px-3 py-2 rounded-2xl rounded-br-xs max-w-[85%] font-medium">
                    {msg.text}
                  </div>
                ) : (
                  <div className="w-full">
                    <AssistantMessageView message={msg} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#0b3558] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200" />
                <span className="text-[11px] font-medium ml-1">PIB AI Assistant is reasoning with Gemini...</span>
              </div>
            )}
          </div>

          {/* Quick prompt suggestions (shown if few messages) */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Prompts:
              </div>
              <div className="flex flex-col gap-1">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qp)}
                    className="text-left text-[11px] p-1.5 rounded bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#0b3558] dark:hover:text-sky-300 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{qp}</span>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about releases, schemes, figures..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0b3558]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!query.trim()}
              className="p-2 rounded-lg bg-[#0b3558] hover:bg-[#164e7c] text-white disabled:opacity-40 cursor-pointer transition-colors shadow-2xs"
              aria-label="Send query"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-[#0b3558] hover:bg-[#164e7c] text-white shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 group cursor-pointer border-2 border-white dark:border-slate-800"
        aria-label="Open PIB AI Assistant"
      >
        <span className="relative flex items-center justify-center">
          <img 
            src="/assets/brand/pib-official-logo.png" 
            alt="PIB AI" 
            className="w-7 h-7 rounded-full object-contain bg-white p-0.5 group-hover:scale-110 transition-transform shadow-xs" 
          />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
        </span>
        <span className="hidden sm:inline text-xs font-bold font-sans tracking-wide pr-1">
          PIB AI
        </span>
      </button>
    </>
  );
};
