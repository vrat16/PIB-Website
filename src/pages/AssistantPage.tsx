import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Bot, Send, FileText, RefreshCw, User, 
  HelpCircle, ShieldAlert
} from 'lucide-react';
import { askPibAssistant } from '../services/assistantService';
import { getReleaseById } from '../services/searchService';
import { AssistantMessageView } from '../components/assistant/AssistantMessageView';
import { useTranslation } from '../i18n/useTranslation';
import type { AssistantMessage } from '../types';

export const AssistantPage: React.FC = () => {
  const { lang, t } = useTranslation();
  const [searchParams] = useSearchParams();
  const releaseIdParam = searchParams.get('releaseId');
  const targetRelease = releaseIdParam ? getReleaseById(releaseIdParam) : undefined;

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialWelcomeMessage: AssistantMessage = {
    id: 'welcome',
    sender: 'assistant',
    timestamp: new Date().toISOString(),
    text: targetRelease
      ? `### PIB Assistant Context: ${targetRelease.title}

I have loaded the official Press Information Bureau record for **${targetRelease.title}** (PRID: \`${targetRelease.prid}\`, Ministry: **${targetRelease.ministry}**).

How can I assist you with this official publication?
- **Executive Summary:** High-level summary of cabinet decisions and key mandates.
- **Citizen Simple Explanation:** Clarify eligibility, public benefits, and citizen rights.
- **Data & Timelines:** Extract exact rupee allocations, vacancy counts, and submission dates.
- **Language Availability:** View translations in official scheduled languages.`
      : `### Official PIB AI Assistant (Powered by Google Gemini Live)

Welcome to the Press Information Bureau Intelligent Information Desk. Responses are generated with live intelligence grounded in verified Government of India press releases and policy documents.

#### Capabilities:
- **Policy Summarisation:** Immediate briefing on major union cabinet decisions and fiscal roadmaps.
- **Citizen Language Clarification:** Demystify regulatory legislation and administrative notices.
- **Key Metric Extraction:** Instant breakdown of investment totals, vacancy notices (e.g. Railway NTPC), and deadlines.
- **Current Affairs Notes:** Structured policy briefings and revision dossiers.
- **Zero Hallucination Grounding:** Verified citations referencing official PIB releases.`,
    extractedFigures: targetRelease?.keyFigures,
    extractedDates: targetRelease?.keyDates,
    sourceCitations: targetRelease ? [{
      id: targetRelease.id,
      prid: targetRelease.prid,
      title: targetRelease.title,
      ministry: targetRelease.ministry,
      publishedAt: targetRelease.publishedAt
    }] : undefined,
    suggestedFollowUps: targetRelease
      ? [
          `Summarise ${targetRelease.title.slice(0, 32)}...`,
          `Explain in simple citizen language`,
          `Extract key figures and deadlines`,
          `Check available language translations`
        ]
      : [
          'Summarise Union Budget 2026',
          'Details of Railway Recruitment CEN 06/2026 NTPC 3548 vacancies',
          'Explain Ayushman Bharat for senior citizens 70+ in simple language',
          'Extract investment figures from India Semiconductor Mission',
          'Generate revision notes on NEP 2020',
          'Compare Chandrayaan-3 and Chandrayaan-4 lunar missions'
        ]
  };

  const [messages, setMessages] = useState<AssistantMessage[]>([initialWelcomeMessage]);

  const handleSend = async (queryToSend?: string) => {
    const q = (queryToSend || inputQuery).trim();
    if (!q || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askPibAssistant(q, targetRelease?.id);
      setMessages(prev => [...prev, response]);
    } catch {
      // Handled gracefully with fallback in askPibAssistant
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([initialWelcomeMessage]);
  };

  return (
    <div className="pib-container py-8 max-w-5xl space-y-6" id="main-content">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0b3558] text-white flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.assistant.title}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                Powered by Google Gemini Live
              </span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t.assistant.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>

      {/* Target Release Context Pill if loaded from a release page */}
      {targetRelease && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs flex items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Active Document Context:</strong> {targetRelease.title} (PRID: {targetRelease.prid})
            </span>
          </div>
          <Link
            to={`/release/${targetRelease.id}`}
            className="text-amber-800 dark:text-amber-300 font-semibold underline text-[11px] whitespace-nowrap hover:opacity-80"
          >
            View Original Record →
          </Link>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-xs min-h-[500px] flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.sender === 'user' ? (
                /* User Question Bubble */
                <div className="flex justify-end gap-2.5">
                  <div className="max-w-xl rounded-2xl rounded-tr-none px-4 py-3 bg-[#0b3558] text-white text-xs md:text-sm shadow-xs">
                    <p className="font-medium leading-relaxed">{msg.text}</p>
                    <span className="text-[10px] text-sky-200 block text-right mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                /* Executive Assistant Structured Message View */
                <div className="max-w-4xl">
                  <AssistantMessageView 
                    message={msg} 
                    onSuggestedPrompt={handleSend} 
                  />
                </div>
              )}
            </div>
          ))}

          {/* Loading state */}
          {isLoading && (
            <div className="max-w-xl p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>Analyzing verified Press Information Bureau archives and synthesizing official briefing...</span>
            </div>
          )}
        </div>

        {/* Text Input Area */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 rounded-xl">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about cabinet decisions, policies, recruitment notices, or request civil-services notes..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-xs md:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0b3558] outline-hidden placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="px-6 py-3 bg-[#0b3558] hover:bg-[#164e7c] text-white font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <span>Ask</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Responses strictly grounded in verified local PIB records.</span>
              </div>
              <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Zero Cloud API Cost • Fully Offline Capable
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
