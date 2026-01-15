/**
 * TranscriptPopup Component
 * Displays the original call transcript in an overlay popup
 */

import React from 'react';
import type { TranscriptPopupProps } from '../types';

export function TranscriptPopup({
  transcript,
  isOpen,
  onClose,
  onCopy,
}: TranscriptPopupProps) {
  if (!isOpen) return null;

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      onCopy();
    } catch (error) {
      console.error('Failed to copy transcript:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="transcript-popup-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transcript-title"
    >
      <div className="transcript-popup-container">
        {/* Header */}
        <div className="transcript-popup-header">
          <h3 id="transcript-title" className="transcript-popup-title">
            Transcribed Call by Split Bot
          </h3>
          <button
            className="transcript-popup-close"
            onClick={onClose}
            aria-label="Close transcript"
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

        {/* Transcript Content */}
        <div className="transcript-popup-content">
          <pre className="transcript-text">{transcript}</pre>
        </div>

        {/* Footer Actions */}
        <div className="transcript-popup-footer">
          <button
            className="transcript-copy-btn"
            onClick={handleCopyClick}
            aria-label="Copy transcript to clipboard"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy from Transcript
          </button>
        </div>
      </div>

      <style>{`
        .transcript-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
        }

        .transcript-popup-container {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 700px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .transcript-popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .transcript-popup-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .transcript-popup-close {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          color: #6b7280;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .transcript-popup-close:hover {
          background-color: #f3f4f6;
          color: #374151;
        }

        .transcript-popup-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .transcript-text {
          margin: 0;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .transcript-popup-footer {
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }

        .transcript-copy-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .transcript-copy-btn:hover {
          background-color: #2563eb;
        }

        .transcript-copy-btn:active {
          background-color: #1d4ed8;
        }
      `}</style>
    </div>
  );
}

export default TranscriptPopup;
