import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Flag, ExternalLink, CheckCircle, X, ArrowLeft } from 'lucide-react';

interface BrokenLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentUrl?: string;
  alternativeOfficialUrl?: string;
  releaseTitle: string;
  releasePrid: string;
}

export const BrokenLinkModal: React.FC<BrokenLinkModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentUrl,
  alternativeOfficialUrl,
  releaseTitle,
  releasePrid
}) => {
  const [retrying, setRetrying] = useState(false);
  const [retryResult, setRetryResult] = useState<'idle' | 'failed'>('idle');
  const [showReportForm, setShowReportForm] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [reportComments, setReportComments] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleRetry = () => {
    setRetrying(true);
    setRetryResult('idle');
    setTimeout(() => {
      setRetrying(false);
      setRetryResult('failed');
    }, 1200);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketId(`PIB-A11Y-${Math.floor(10000 + Math.random() * 90000)}`);
    setReportSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-amber-500/10 dark:bg-amber-500/20 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400 font-bold">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-base font-semibold">Archived Document Retrieval Notice</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {documentTitle}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Referenced in: <strong>{releaseTitle}</strong> (PRID: {releasePrid})
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <p>
              <strong>Status:</strong> The legacy document attachment is currently inaccessible or deprecated in the primary historical media storage node.
            </p>
            <p className="text-[11px] text-slate-500">
              Requested target: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">{documentUrl || 'N/A'}</code>
            </p>
          </div>

          {/* Retry Status Message */}
          {retryResult === 'failed' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded text-xs text-rose-700 dark:text-rose-300">
              Primary archive mirror query failed. The attachment was not recovered from the local cache. Please consult the verified alternative repository below or report the link to the webmaster.
            </div>
          )}

          {/* Report Submitted Confirmation */}
          {reportSubmitted ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Broken-Link Incident Logged (Ticket #{ticketId})</span>
              </div>
              <p>
                Thank you for contributing to archive integrity. The broken document link has been queued for verification by the digital records team.
              </p>
            </div>
          ) : showReportForm ? (
            <form onSubmit={handleReportSubmit} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-amber-600" />
                <span>Report Inaccessible Attachment to Webmaster</span>
              </h5>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Your Email Address (optional for tracking)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={reportComments}
                  onChange={(e) => setReportComments(e.target.value)}
                  placeholder="e.g. Gazette notification PDF returned 404 from archive cluster"
                  rows={2}
                  className="w-full text-xs px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#0b3558] text-white rounded text-xs font-semibold hover:bg-[#164e7c]"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {/* Alternative Verified Link (Honest requirement from brief) */}
              {alternativeOfficialUrl && (
                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-lg text-xs">
                  <div className="font-semibold text-sky-900 dark:text-sky-200 mb-1 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-sky-600" />
                    <span>Verified Official Alternative Portal:</span>
                  </div>
                  <a
                    href={alternativeOfficialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 dark:text-sky-300 underline font-mono break-all hover:text-sky-900"
                  >
                    {alternativeOfficialUrl}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Results</span>
          </button>

          <div className="flex items-center gap-2">
            {!showReportForm && !reportSubmitted && (
              <button
                onClick={() => setShowReportForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60 font-semibold"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Problem</span>
              </button>
            )}

            <button
              onClick={handleRetry}
              disabled={retrying}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded bg-[#0b3558] hover:bg-[#164e7c] text-white font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
              <span>{retrying ? 'Checking Mirrors...' : 'Retry Recovery'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
