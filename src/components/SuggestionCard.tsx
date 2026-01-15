/**
 * SuggestionCard Component
 * Displays individual AI suggestion with accept/ignore/combine actions
 */

import React, { useState } from 'react';
import type { SuggestionCardProps } from '../types';

export function SuggestionCard({
  suggestion,
  onAccept,
  onIgnore,
  onCombine,
  isProcessing,
}: SuggestionCardProps) {
  const [showCombineModal, setShowCombineModal] = useState(false);
  const [combinedContent, setCombinedContent] = useState('');

  // Get display text for the suggestion heading
  const getFieldDisplayName = () => {
    if (suggestion.field_suggested_house) {
      return suggestion.field_suggested_house.field_name;
    }
    return 'AI Suggestion';
  };

  // Get the formatted content for display
  const getDisplayContent = () => {
    if (suggestion.field_suggested_house) {
      return suggestion.field_suggested_house.display_value;
    }
    return suggestion.content;
  };

  const handleAccept = () => {
    onAccept(suggestion.id);
  };

  const handleIgnore = () => {
    onIgnore(suggestion.id);
  };

  const handleCombineClick = () => {
    // Pre-populate with combined content
    const combined = `${suggestion.previous_content || ''}\n\n${suggestion.content}`.trim();
    setCombinedContent(combined);
    setShowCombineModal(true);
  };

  const handleCombineConfirm = () => {
    onCombine(suggestion.id, combinedContent);
    setShowCombineModal(false);
  };

  const handleCombineCancel = () => {
    setShowCombineModal(false);
    setCombinedContent('');
  };

  // Source indicator
  const getSourceIcon = () => {
    if (suggestion.source_flags.from_call) return '📞';
    if (suggestion.source_flags.from_audio) return '🎙️';
    if (suggestion.source_flags.from_pdf) return '📄';
    if (suggestion.source_flags.from_google_doc) return '📝';
    if (suggestion.source_flags.from_listing) return '🏠';
    if (suggestion.source_flags.from_free_text_form) return '✍️';
    return '🤖';
  };

  return (
    <div className={`suggestion-card ${isProcessing ? 'processing' : ''}`}>
      {/* Header */}
      <div className="suggestion-card-header">
        <span className="suggestion-source-icon">{getSourceIcon()}</span>
        <h4 className="suggestion-field-name">{getFieldDisplayName()}</h4>
        {isProcessing && <span className="processing-indicator">Processing...</span>}
      </div>

      {/* Previous Content Section */}
      {suggestion.previous_content && (
        <div className="previous-content-section">
          <label className="section-label">Previously recorded:</label>
          <div className="previous-content-text">{suggestion.previous_content}</div>
        </div>
      )}

      {/* AI Suggestion Content */}
      <div className="suggestion-content-section">
        <label className="section-label">AI Suggestion:</label>
        <textarea
          className="suggestion-content-textarea"
          value={getDisplayContent()}
          readOnly
          rows={6}
        />
      </div>

      {/* Action Buttons */}
      <div className="suggestion-card-actions">
        <button
          className="suggestion-btn btn-ignore"
          onClick={handleIgnore}
          disabled={isProcessing}
        >
          Ignore
        </button>
        {suggestion.previous_content && (
          <button
            className="suggestion-btn btn-combine"
            onClick={handleCombineClick}
            disabled={isProcessing}
          >
            Combine
          </button>
        )}
        <button
          className="suggestion-btn btn-accept"
          onClick={handleAccept}
          disabled={isProcessing}
        >
          Accept
        </button>
      </div>

      {/* Combine Modal */}
      {showCombineModal && (
        <div className="combine-modal-overlay" onClick={handleCombineCancel}>
          <div
            className="combine-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="combine-modal-title">Combine Content</h4>
            <p className="combine-modal-description">
              Edit the combined content below before accepting:
            </p>
            <textarea
              className="combine-modal-textarea"
              value={combinedContent}
              onChange={(e) => setCombinedContent(e.target.value)}
              rows={10}
            />
            <div className="combine-modal-actions">
              <button
                className="suggestion-btn btn-ignore"
                onClick={handleCombineCancel}
              >
                Cancel
              </button>
              <button
                className="suggestion-btn btn-accept"
                onClick={handleCombineConfirm}
              >
                Accept Combined
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .suggestion-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          transition: opacity 0.2s, transform 0.2s;
        }

        .suggestion-card.processing {
          opacity: 0.6;
          pointer-events: none;
        }

        .suggestion-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .suggestion-source-icon {
          font-size: 20px;
        }

        .suggestion-field-name {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          flex: 1;
        }

        .processing-indicator {
          font-size: 12px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .section-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .previous-content-section {
          margin-bottom: 16px;
          padding: 12px;
          background: #fef3c7;
          border-radius: 8px;
          border-left: 3px solid #f59e0b;
        }

        .previous-content-text {
          font-size: 14px;
          color: #92400e;
          line-height: 1.5;
        }

        .suggestion-content-section {
          margin-bottom: 16px;
        }

        .suggestion-content-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          background: #f9fafb;
          resize: none;
          font-family: inherit;
        }

        .suggestion-content-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .suggestion-card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .suggestion-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .suggestion-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .btn-ignore {
          background: #f3f4f6;
          color: #4b5563;
        }

        .btn-ignore:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-combine {
          background: #3b82f6;
          color: white;
        }

        .btn-combine:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-accept {
          background: #8b5cf6;
          color: white;
        }

        .btn-accept:hover:not(:disabled) {
          background: #7c3aed;
        }

        /* Combine Modal Styles */
        .combine-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
        }

        .combine-modal {
          background: white;
          border-radius: 12px;
          padding: 24px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .combine-modal-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .combine-modal-description {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #6b7280;
        }

        .combine-modal-textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          resize: vertical;
          font-family: inherit;
          margin-bottom: 16px;
        }

        .combine-modal-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .combine-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}

export default SuggestionCard;
