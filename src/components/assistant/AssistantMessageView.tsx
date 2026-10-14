import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Copy, Check, BookOpen, 
  Sparkles, HelpCircle, Calendar, 
  ChevronRight, Bookmark, Tag, ListOrdered, ListFilter
} from 'lucide-react';
import { EmblemOfIndia } from '../brand/EmblemOfIndia';
import type { AssistantMessage } from '../../types';
import { toggleSaveRelease } from '../../services/bookmarkService';
import { normalizeAssistantContent } from '../../services/assistantService';

interface AssistantMessageViewProps {
  message: AssistantMessage;
  onSuggestedPrompt?: (prompt: string) => void;
}

export const AssistantMessageView: React.FC<AssistantMessageViewProps> = ({ 
  message, 
  onSuggestedPrompt 
}) => {
  const [copied, setCopied] = useState(false);
  const [savedSources, setSavedSources] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'list' | 'detailed'>('list');

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSource = (id: string) => {
    const next = toggleSaveRelease(id);
    setSavedSources(prev => ({ ...prev, [id]: next }));
  };

  // Helper parser for structured blocks in clean List View
  const renderFormattedContent = (content: string) => {
    const normalized = normalizeAssistantContent(content);
    const blocks = normalized.split('\n\n');

    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Heading 3
      if (trimmed.startsWith('### ')) {
        const titleText = trimmed.replace(/^###\s+/, '').replace(/^\*\*|\*\*$/g, '');
        return (
          <h3 
            key={idx} 
            className="text-sm sm:text-base font-bold font-serif text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1.5 mt-2.5 mb-2 flex items-center gap-2"
          >
            <span className="w-1.5 h-4 bg-[#0b3558] dark:bg-sky-400 rounded-full inline-block shrink-0" />
            <span>{titleText}</span>
          </h3>
        );
      }

      // Heading 4
      if (trimmed.startsWith('#### ')) {
        const titleText = trimmed.replace(/^####\s+/, '').replace(/^\*\*|\*\*$/g, '');
        return (
          <h4 
            key={idx} 
            className="text-xs sm:text-sm font-bold text-[#0b3558] dark:text-sky-300 mt-2.5 mb-1.5 flex items-center gap-1.5"
          >
            <span className="text-amber-500 font-bold">•</span>
            <span>{titleText}</span>
          </h4>
        );
      }

      // Blockquote / Plain Language callout (Rendered as a clear citizen note list item)
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s*/gm, '');
        return (
          <div 
            key={idx} 
            className="my-2.5 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-xs text-amber-900 dark:text-amber-100 flex items-start gap-2.5 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Citizen Note:</strong> {quoteText}
            </div>
          </div>
        );
      }

      // Markdown Table
      if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
        const rows = trimmed.split('\n').filter(r => r.trim().length > 0);
        return (
          <div key={idx} className="overflow-x-auto my-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                {rows.slice(0, 1).map((r, rIdx) => {
                  const cells = r.split('|').filter(c => c.trim().length > 0);
                  return (
                    <tr key={rIdx} className="bg-[#0b3558] text-white">
                      {cells.map((cell, cIdx) => (
                        <th key={cIdx} className="p-2 font-semibold border-b border-sky-800">
                          {cell.trim()}
                        </th>
                      ))}
                    </tr>
                  );
                })}
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {rows.slice(1).map((r, rIdx) => {
                  if (r.includes('---')) return null;
                  const cells = r.split('|').filter(c => c.trim().length > 0);
                  return (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800 last:border-r-0">
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      // Numbered Announcement Card (List View for releases, updates, vacancies)
      const isNumberedCard = /^(\*\*\d{1,2}\.|\d{1,2}\.\s+\*\*|\d{1,2}\.\s+[A-Za-z])/.test(trimmed);
      if (isNumberedCard) {
        const lines = trimmed.split('\n').filter(l => l.trim().length > 0);
        const firstLine = lines[0];
        const subLines = lines.slice(1);

        const numMatch = firstLine.match(/\b(\d{1,2})\./);
        const itemNum = numMatch ? numMatch[1] : '•';
        const title = firstLine
          .replace(/^\*+\s*|\s*\*+$/g, '')
          .replace(/^\d{1,2}\.\s*|\*\*\d{1,2}\.\s*/, '')
          .replace(/\*+/g, '')
          .trim();

        return (
          <div 
            key={idx} 
            className="my-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/60 shadow-2xs space-y-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
          >
            {/* Header with Number Pill in List View */}
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-md bg-[#0b3558] text-amber-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5 shadow-2xs">
                {itemNum}
              </span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                {title}
              </h4>
            </div>

            {/* Sub-item metadata list */}
            {subLines.length > 0 && (
              <ul className="pl-7 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {subLines.map((sLine, sIdx) => {
                  const cleanLine = sLine.replace(/^[-*]\s+/, '');
                  return (
                    <li key={sIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                      <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cleanLine) }} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      }

      // Standard Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const lines = trimmed.split('\n').filter(l => l.trim().length > 0);
        return (
          <ul key={idx} className="space-y-1.5 my-2.5 pl-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {lines.map((line, lIdx) => {
              const cleaned = line.replace(/^[-*]\s+/, '');
              return (
                <li key={lIdx} className="pt-1.5 first:pt-0 flex items-start gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-[#0b3558] dark:text-sky-300 flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700">
                    {lIdx + 1}
                  </span>
                  <span className="leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cleaned) }} />
                </li>
              );
            })}
          </ul>
        );
      }

      // If text has heavy content and viewMode is 'list', split multi-sentence paragraphs into clean List View
      if (viewMode === 'list' && trimmed.length > 160) {
        const sentences = trimmed.split(/(?<=[.?!])\s+(?=[A-Z0-9])/).filter(s => s.trim().length > 0);
        if (sentences.length >= 2) {
          return (
            <div key={idx} className="my-2.5 p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 mb-1">
                <ListFilter className="w-3 h-3 text-[#0b3558] dark:text-sky-400" />
                <span>Executive Summary (List View)</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                {sentences.map((sent, sIdx) => (
                  <li key={sIdx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2 leading-relaxed">
                    <span className="text-[#0b3558] dark:text-sky-400 font-bold shrink-0 mt-0.5">•</span>
                    <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(sent) }} />
                  </li>
                ))}
              </ul>
            </div>
          );
        }
      }

      // Regular Paragraph
      return (
        <p 
          key={idx} 
          className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed my-2"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
        />
      );
    });
  };

  // Inline markdown helper for bold, code
  const formatInlineMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs text-sky-700 dark:text-sky-300">$1</code>');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
      {/* 1. Official Header Banner with Interactive List View Toggle */}
      <div className="bg-slate-100/90 dark:bg-slate-950 px-3.5 py-2 sm:px-4 sm:py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#0b3558] text-white flex items-center justify-center p-0.5 shrink-0">
            <EmblemOfIndia size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0b3558] dark:text-sky-400">
              PIB Policy Briefing
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.2 rounded-full border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Grounded</span>
            </span>
          </div>
        </div>

        {/* Toolbar with List View interactive toggle and Copy */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode(prev => prev === 'list' ? 'detailed' : 'list')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-sky-100 text-[#0b3558] border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle List View formatting"
          >
            <ListFilter className="w-3 h-3 text-[#0b3558] dark:text-sky-400" />
            <span>List View</span>
            {viewMode === 'list' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-50 cursor-pointer transition-colors"
            title="Copy briefing to clipboard"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 2. Structured Content Body in List View */}
      <div className="p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-4">
        {/* Extracted Key Figures in List View */}
        {message.extractedFigures && message.extractedFigures.length > 0 && (
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50/60 dark:bg-slate-800/50">
            <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Key Figures & Quantitative Targets (List View)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{message.extractedFigures.length} Items</span>
            </div>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {message.extractedFigures.map((fig, fIdx) => (
                <li key={fIdx} className="px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{fig.metric}</span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {fig.value}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">{fig.context}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Extracted Key Dates / Deadlines in List View */}
        {message.extractedDates && message.extractedDates.length > 0 && (
          <div className="rounded-lg border border-blue-200 dark:border-blue-900 overflow-hidden bg-blue-50/30 dark:bg-slate-900">
            <div className="px-3.5 py-2 bg-blue-100/70 dark:bg-blue-950/80 text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between border-b border-blue-200 dark:border-blue-900">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Official Timelines & Deadlines (List View)</span>
              </span>
              <span className="text-[10px] text-blue-700 dark:text-blue-300 font-mono">{message.extractedDates.length} Dates</span>
            </div>
            <ul className="divide-y divide-blue-100 dark:divide-blue-950/60">
              {message.extractedDates.map((d, dIdx) => (
                <li key={dIdx} className="px-3.5 py-2 flex items-center justify-between gap-3 text-xs hover:bg-blue-50/50 dark:hover:bg-slate-850 transition-colors">
                  <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{d.label}</span>
                  </span>
                  <span className="font-bold text-[#0b3558] dark:text-sky-300 font-mono">{d.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Formatted Text Content */}
        <div className="prose-container">
          {renderFormattedContent(message.text)}
        </div>

        {/* 3. Official Grounded Citations in List View */}
        {message.sourceCitations && message.sourceCitations.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0b3558] dark:text-sky-400" />
                <span>Referenced Official Press Releases (List View):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {message.sourceCitations.length} Records Verified
              </span>
            </div>

            <div className="space-y-2">
              {message.sourceCitations.map(source => {
                const isBookmarked = savedSources[source.id];
                return (
                  <div 
                    key={source.id} 
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 max-w-xl">
                      <Link 
                        to={`/release/${source.id}`}
                        className="font-bold text-[#0b3558] dark:text-sky-300 hover:underline line-clamp-1"
                      >
                        {source.title}
                      </Link>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {source.ministry} • PRID: <span className="font-mono">{source.prid}</span> • {new Date(source.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveSource(source.id)}
                        className={`p-1.5 rounded border transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                          isBookmarked 
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200' 
                            : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title="Save this referenced release"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                      </button>

                      <Link 
                        to={`/release/${source.id}`}
                        className="flex items-center gap-1 px-3 py-1 bg-[#0b3558] hover:bg-[#164e7c] text-white rounded font-medium text-xs transition-colors"
                      >
                        <span>View Record</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Suggested Follow-Ups in List View */}
        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && onSuggestedPrompt && (
          <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              <span>Recommended Follow-Up Inquiries:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {message.suggestedFollowUps.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => onSuggestedPrompt(prompt)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-300 transition-colors text-left cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
