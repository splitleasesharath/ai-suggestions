/**
 * AISuggestionsModal Component
 * Main modal/popup for reviewing AI-generated suggestions
 */

import React, { useEffect, useState } from 'react';
import type { AISuggestionsModalProps, ProgressStage } from '../types';
import { useAISuggestions } from '../hooks/useAISuggestions';
import { SuggestionCard } from './SuggestionCard';
import { TranscriptPopup } from './TranscriptPopup';

// Progress stage display messages
const PROGRESS_MESSAGES: Record<ProgressStage, string> = {
  idle: 'Ready',
  transcribing: "We're transcribing your call now...",
  analyzing: "We're analyzing the content...",
  generating: 'Generating AI suggestions...',
  ready: 'Suggestions ready for review',
  complete: 'All suggestions reviewed',
  error: 'An error occurred',
};

export function AISuggestionsModal({
  houseManualId,
  isOpen,
  onClose,
  onSuggestionsAccepted,
}: AISuggestionsModalProps) {
  const {
    houseManual,
    pendingSuggestions,
    isLoading,
    isProcessing,
    isEmpty,
    error,
    showTranscript,
    acceptSuggestion,
    ignoreSuggestion,
    combineSuggestion,
    acceptAll,
    reusePrevious,
    toggleTranscript,
  } = useAISuggestions(isOpen ? houseManualId : null);

  const [copyNotification, setCopyNotification] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAcceptAll = async () => {
    await acceptAll();
    onSuggestionsAccepted?.(pendingSuggestions);
  };

  const handleCopyTranscript = () => {
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2000);
  };

  const progressStage = houseManual?.progress_stage || 'idle';
  const progressMessage = PROGRESS_MESSAGES[progressStage];

  if (!isOpen) return null;

  return (
    <div
      className="ai-suggestions-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-suggestions-title"
    >
      <div className="ai-suggestions-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <h2 id="ai-suggestions-title" className="modal-title">
              Review AI Suggestions
            </h2>
            {houseManual?.transcript && (
              <button
                className="view-transcript-btn"
                onClick={toggleTranscript}
                aria-label="View transcript"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                View Transcript
              </button>
            )}
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="progress-section">
          <div className={`progress-badge ${progressStage}`}>
            {progressStage === 'transcribing' ||
            progressStage === 'analyzing' ||
            progressStage === 'generating' ? (
              <span className="spinner" />
            ) : null}
            <span>{progressMessage}</span>
          </div>
          {pendingSuggestions.length > 0 && (
            <span className="suggestions-count">
              {pendingSuggestions.length} suggestion
              {pendingSuggestions.length !== 1 ? 's' : ''} to review
            </span>
          )}
        </div>

        {/* Main Content Area */}
        <div className="modal-content">
          {/* Loading State */}
          {isLoading && (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading suggestions...</p>
            </div>
          )}

          {/* Processing State */}
          {!isLoading && isProcessing && (
            <div className="processing-state">
              <div className="processing-animation">
                <div className="processing-spinner" />
              </div>
              <h3>Processing Your Content</h3>
              <p>{progressMessage}</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isProcessing && !error && isEmpty && (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <h3>No Suggestions to Review</h3>
              <p>
                You've reviewed all current suggestions, or there are no new
                suggestions available.
              </p>
              <button className="reuse-btn" onClick={reusePrevious}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Reuse from Previous House Manual
              </button>
            </div>
          )}

          {/* Suggestions List */}
          {!isLoading &&
            !isProcessing &&
            !error &&
            !isEmpty &&
            pendingSuggestions.length > 0 && (
              <div className="suggestions-list">
                {pendingSuggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    onAccept={acceptSuggestion}
                    onIgnore={ignoreSuggestion}
                    onCombine={combineSuggestion}
                    isProcessing={suggestion.being_processed}
                  />
                ))}
              </div>
            )}
        </div>

        {/* Footer Actions */}
        {!isLoading && !isProcessing && pendingSuggestions.length > 0 && (
          <div className="modal-footer">
            <button className="accept-all-btn" onClick={handleAcceptAll}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Accept All Suggestions
            </button>
          </div>
        )}

        {/* Copy Notification Toast */}
        {copyNotification && (
          <div className="copy-toast">Transcript copied to clipboard!</div>
        )}
      </div>

      {/* Transcript Popup */}
      {houseManual?.transcript && (
        <TranscriptPopup
          transcript={houseManual.transcript}
          isOpen={showTranscript}
          onClose={toggleTranscript}
          onCopy={handleCopyTranscript}
        />
      )}

      <style>{`
        .ai-suggestions-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .ai-suggestions-modal {
          background: #f9fafb;
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
        }

        .view-transcript-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #eff6ff;
          color: #3b82f6;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-transcript-btn:hover {
          background: #dbeafe;
        }

        .modal-close-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #6b7280;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .progress-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .progress-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .progress-badge.idle,
        .progress-badge.ready,
        .progress-badge.complete {
          background: #d1fae5;
          color: #065f46;
        }

        .progress-badge.transcribing,
        .progress-badge.analyzing,
        .progress-badge.generating {
          background: #fef3c7;
          color: #92400e;
        }

        .progress-badge.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .suggestions-count {
          font-size: 13px;
          color: #6b7280;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .loading-state p {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        /* Processing State */
        .processing-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .processing-animation {
          margin-bottom: 24px;
        }

        .processing-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .processing-state h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .processing-state p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Error State */
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .error-state h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #991b1b;
        }

        .error-state p {
          margin: 0 0 24px 0;
          font-size: 14px;
          color: #6b7280;
          max-width: 400px;
        }

        .retry-btn {
          padding: 10px 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .retry-btn:hover {
          background: #dc2626;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 14px;
          color: #6b7280;
          max-width: 400px;
        }

        .reuse-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .reuse-btn:hover {
          background: #2563eb;
        }

        /* Suggestions List */
        .suggestions-list {
          display: flex;
          flex-direction: column;
        }

        /* Footer */
        .modal-footer {
          padding: 16px 24px;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }

        .accept-all-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .accept-all-btn:hover {
          background: #7c3aed;
        }

        /* Toast */
        .copy-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #111827;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.3s ease-out;
          z-index: 1300;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 640px) {
          .ai-suggestions-overlay {
            padding: 0;
          }

          .ai-suggestions-modal {
            max-height: 100vh;
            border-radius: 0;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .progress-section {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default AISuggestionsModal;
