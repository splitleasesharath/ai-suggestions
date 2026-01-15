/**
 * Demo App for AI Suggestions Preview
 */

import React, { useState, useCallback } from 'react';
import { AISuggestionsModal } from '../components/AISuggestionsModal';
import { mockHouseManual, mockSuggestions, delay } from './mockData';
import type { AISuggestion, HouseManual, ProgressStage } from '../types';

// Override the Supabase services with mock implementations
// This is done by providing a context or by mocking at the module level
// For simplicity in this demo, we'll create a standalone version

function DemoApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<AISuggestion[]>([]);
  const [demoMode, setDemoMode] = useState<'normal' | 'processing' | 'empty'>('normal');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuggestionsAccepted = (suggestions: AISuggestion[]) => {
    setAcceptedSuggestions(prev => [...prev, ...suggestions]);
    console.log('Suggestions accepted:', suggestions);
  };

  return (
    <div className="demo-container">
      {/* Header */}
      <header className="demo-header">
        <div className="header-content">
          <h1>AI Suggestions Component</h1>
          <p>Split Lease - House Manual Content Review</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="demo-main">
        {/* Demo Controls */}
        <section className="demo-controls">
          <h2>Demo Controls</h2>
          <div className="control-group">
            <label>Demo Mode:</label>
            <div className="button-group">
              <button
                className={`mode-btn ${demoMode === 'normal' ? 'active' : ''}`}
                onClick={() => setDemoMode('normal')}
              >
                Normal (5 suggestions)
              </button>
              <button
                className={`mode-btn ${demoMode === 'processing' ? 'active' : ''}`}
                onClick={() => setDemoMode('processing')}
              >
                Processing State
              </button>
              <button
                className={`mode-btn ${demoMode === 'empty' ? 'active' : ''}`}
                onClick={() => setDemoMode('empty')}
              >
                Empty State
              </button>
            </div>
          </div>

          <button className="open-modal-btn" onClick={handleOpenModal}>
            Open AI Suggestions Modal
          </button>
        </section>

        {/* Info Cards */}
        <section className="info-section">
          <div className="info-card">
            <h3>Mock House Manual</h3>
            <dl>
              <dt>ID:</dt>
              <dd>{mockHouseManual.id}</dd>
              <dt>Progress Stage:</dt>
              <dd>{mockHouseManual.progress_stage}</dd>
              <dt>Total Suggestions:</dt>
              <dd>{mockSuggestions.length}</dd>
              <dt>Has Transcript:</dt>
              <dd>{mockHouseManual.transcript ? 'Yes' : 'No'}</dd>
            </dl>
          </div>

          <div className="info-card">
            <h3>Accepted Suggestions</h3>
            {acceptedSuggestions.length === 0 ? (
              <p className="empty-text">No suggestions accepted yet</p>
            ) : (
              <ul className="accepted-list">
                {acceptedSuggestions.map(s => (
                  <li key={s.id}>
                    <strong>{s.field_suggested_house?.field_name || 'Suggestion'}</strong>
                    <span className="decision-badge">{s.decision}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Suggestions Preview */}
        <section className="suggestions-preview">
          <h2>Available Suggestions Preview</h2>
          <div className="suggestions-grid">
            {mockSuggestions.map(suggestion => (
              <div key={suggestion.id} className="preview-card">
                <div className="preview-header">
                  <span className="source-icon">
                    {suggestion.source_flags.from_call && '📞'}
                    {suggestion.source_flags.from_audio && '🎙️'}
                    {suggestion.source_flags.from_free_text_form && '✍️'}
                    {suggestion.source_flags.from_google_doc && '📝'}
                  </span>
                  <h4>{suggestion.field_suggested_house?.field_name}</h4>
                </div>
                <p className="preview-content">
                  {suggestion.content.substring(0, 100)}...
                </p>
                {suggestion.previous_content && (
                  <div className="has-previous">Has previous content</div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      <DemoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuggestionsAccepted={handleSuggestionsAccepted}
        mode={demoMode}
      />

      <style>{`
        .demo-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .demo-header {
          background: white;
          padding: 24px 32px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header-content h1 {
          margin: 0;
          font-size: 28px;
          color: #1f2937;
        }

        .header-content p {
          margin: 4px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .demo-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px;
        }

        .demo-controls {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .demo-controls h2 {
          margin: 0 0 16px;
          font-size: 18px;
          color: #1f2937;
        }

        .control-group {
          margin-bottom: 20px;
        }

        .control-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
        }

        .button-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .mode-btn {
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn:hover {
          border-color: #8b5cf6;
        }

        .mode-btn.active {
          background: #8b5cf6;
          border-color: #8b5cf6;
          color: white;
        }

        .open-modal-btn {
          padding: 14px 28px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .open-modal-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .info-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .info-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .info-card h3 {
          margin: 0 0 16px;
          font-size: 16px;
          color: #1f2937;
        }

        .info-card dl {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 8px 16px;
        }

        .info-card dt {
          font-weight: 500;
          color: #6b7280;
          font-size: 14px;
        }

        .info-card dd {
          margin: 0;
          color: #1f2937;
          font-size: 14px;
        }

        .empty-text {
          color: #9ca3af;
          font-size: 14px;
          font-style: italic;
        }

        .accepted-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .accepted-list li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .accepted-list li:last-child {
          border-bottom: none;
        }

        .decision-badge {
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 12px;
          background: #d1fae5;
          color: #065f46;
        }

        .suggestions-preview {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .suggestions-preview h2 {
          margin: 0 0 20px;
          font-size: 18px;
          color: #1f2937;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .preview-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .source-icon {
          font-size: 18px;
        }

        .preview-header h4 {
          margin: 0;
          font-size: 14px;
          color: #1f2937;
        }

        .preview-content {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          margin: 0;
        }

        .has-previous {
          margin-top: 8px;
          font-size: 11px;
          color: #92400e;
          background: #fef3c7;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

// Demo Modal with mock data
interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggestionsAccepted: (suggestions: AISuggestion[]) => void;
  mode: 'normal' | 'processing' | 'empty';
}

function DemoModal({ isOpen, onClose, onSuggestionsAccepted, mode }: DemoModalProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(
    mode === 'empty' ? [] : [...mockSuggestions]
  );
  const [houseManual, setHouseManual] = useState<HouseManual>({
    ...mockHouseManual,
    progress_stage: mode === 'processing' ? 'analyzing' : 'ready',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);

  // Reset state when mode changes
  React.useEffect(() => {
    setSuggestions(mode === 'empty' ? [] : [...mockSuggestions]);
    setHouseManual({
      ...mockHouseManual,
      progress_stage: mode === 'processing' ? 'analyzing' : 'ready',
    });
  }, [mode, isOpen]);

  // Simulate processing progress
  React.useEffect(() => {
    if (mode === 'processing' && isOpen) {
      const stages: ProgressStage[] = ['transcribing', 'analyzing', 'generating', 'ready'];
      let index = 0;

      const interval = setInterval(() => {
        index++;
        if (index < stages.length) {
          setHouseManual(prev => ({ ...prev, progress_stage: stages[index] }));
        }
        if (index >= stages.length - 1) {
          clearInterval(interval);
          setSuggestions([...mockSuggestions]);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [mode, isOpen]);

  const pendingSuggestions = suggestions.filter(
    s => !s.being_processed && s.decision === 'pending'
  );

  const isProcessing = ['transcribing', 'analyzing', 'generating'].includes(
    houseManual.progress_stage
  );

  const handleAccept = async (id: string) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, being_processed: true } : s))
    );
    await delay(600);
    setSuggestions(prev =>
      prev.map(s =>
        s.id === id ? { ...s, decision: 'accepted', being_processed: false } : s
      )
    );
    const accepted = suggestions.find(s => s.id === id);
    if (accepted) onSuggestionsAccepted([{ ...accepted, decision: 'accepted' }]);
  };

  const handleIgnore = async (id: string) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, being_processed: true } : s))
    );
    await delay(400);
    setSuggestions(prev =>
      prev.map(s =>
        s.id === id ? { ...s, decision: 'ignored', being_processed: false } : s
      )
    );
  };

  const handleCombine = async (id: string, combinedContent: string) => {
    setSuggestions(prev =>
      prev.map(s => (s.id === id ? { ...s, being_processed: true } : s))
    );
    await delay(700);
    setSuggestions(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, content: combinedContent, decision: 'combined', being_processed: false }
          : s
      )
    );
    const combined = suggestions.find(s => s.id === id);
    if (combined)
      onSuggestionsAccepted([{ ...combined, content: combinedContent, decision: 'combined' }]);
  };

  const handleAcceptAll = async () => {
    setIsLoading(true);
    for (const suggestion of pendingSuggestions) {
      await handleAccept(suggestion.id);
    }
    setIsLoading(false);
  };

  const handleReuse = async () => {
    setIsLoading(true);
    await delay(1000);
    setSuggestions([...mockSuggestions]);
    setIsLoading(false);
  };

  const handleCopyTranscript = () => {
    navigator.clipboard.writeText(houseManual.transcript || '');
    setCopyNotification(true);
    setTimeout(() => setCopyNotification(false), 2000);
  };

  const progressMessages: Record<ProgressStage, string> = {
    idle: 'Ready',
    transcribing: "We're transcribing your call now...",
    analyzing: "We're analyzing the content...",
    generating: 'Generating AI suggestions...',
    ready: 'Suggestions ready for review',
    complete: 'All suggestions reviewed',
    error: 'An error occurred',
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="header-left">
            <h2>Review AI Suggestions</h2>
            {houseManual.transcript && (
              <button className="transcript-btn" onClick={() => setShowTranscript(true)}>
                📄 View Transcript
              </button>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Progress */}
        <div className="progress-bar">
          <div className={`progress-badge ${houseManual.progress_stage}`}>
            {isProcessing && <span className="spinner" />}
            {progressMessages[houseManual.progress_stage]}
          </div>
          {pendingSuggestions.length > 0 && (
            <span className="count">{pendingSuggestions.length} suggestions to review</span>
          )}
        </div>

        {/* Content */}
        <div className="modal-content">
          {isLoading && (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading...</p>
            </div>
          )}

          {!isLoading && isProcessing && (
            <div className="processing-state">
              <div className="processing-spinner" />
              <h3>Processing Your Content</h3>
              <p>{progressMessages[houseManual.progress_stage]}</p>
            </div>
          )}

          {!isLoading && !isProcessing && pendingSuggestions.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">✨</span>
              <h3>No Suggestions to Review</h3>
              <p>You've reviewed all suggestions or none are available.</p>
              <button className="reuse-btn" onClick={handleReuse}>
                🔄 Reuse from Previous House Manual
              </button>
            </div>
          )}

          {!isLoading && !isProcessing && pendingSuggestions.length > 0 && (
            <div className="suggestions-list">
              {pendingSuggestions.map(suggestion => (
                <SuggestionCardDemo
                  key={suggestion.id}
                  suggestion={suggestion}
                  onAccept={handleAccept}
                  onIgnore={handleIgnore}
                  onCombine={handleCombine}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !isProcessing && pendingSuggestions.length > 0 && (
          <div className="modal-footer">
            <button className="accept-all-btn" onClick={handleAcceptAll}>
              ✓ Accept All Suggestions
            </button>
          </div>
        )}

        {/* Copy notification */}
        {copyNotification && (
          <div className="copy-toast">Transcript copied!</div>
        )}
      </div>

      {/* Transcript Popup */}
      {showTranscript && (
        <div className="transcript-overlay" onClick={() => setShowTranscript(false)}>
          <div className="transcript-modal" onClick={e => e.stopPropagation()}>
            <div className="transcript-header">
              <h3>Transcribed Call by Split Bot</h3>
              <button onClick={() => setShowTranscript(false)}>✕</button>
            </div>
            <div className="transcript-content">
              <pre>{houseManual.transcript}</pre>
            </div>
            <div className="transcript-footer">
              <button onClick={handleCopyTranscript}>📋 Copy Transcript</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: #f9fafb;
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .transcript-btn {
          padding: 8px 12px;
          background: #eff6ff;
          color: #3b82f6;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
          padding: 8px;
        }

        .progress-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .progress-badge.ready, .progress-badge.complete {
          background: #d1fae5;
          color: #065f46;
        }

        .progress-badge.transcribing, .progress-badge.analyzing, .progress-badge.generating {
          background: #fef3c7;
          color: #92400e;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .count {
          font-size: 13px;
          color: #6b7280;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .loading-state, .processing-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .loading-spinner, .processing-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3, .processing-state h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }

        .empty-state p, .processing-state p {
          color: #6b7280;
          margin: 0 0 24px;
        }

        .reuse-btn {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .modal-footer {
          padding: 16px 24px;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }

        .accept-all-btn {
          padding: 12px 24px;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .copy-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #111827;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          z-index: 1100;
        }

        /* Transcript Modal */
        .transcript-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
        }

        .transcript-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 700px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .transcript-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .transcript-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .transcript-header button {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
        }

        .transcript-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .transcript-content pre {
          margin: 0;
          white-space: pre-wrap;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.6;
        }

        .transcript-footer {
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }

        .transcript-footer button {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// Simplified SuggestionCard for demo
interface SuggestionCardDemoProps {
  suggestion: AISuggestion;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onCombine: (id: string, content: string) => void;
}

function SuggestionCardDemo({ suggestion, onAccept, onIgnore, onCombine }: SuggestionCardDemoProps) {
  const [showCombine, setShowCombine] = useState(false);
  const [combinedContent, setCombinedContent] = useState('');

  const getSourceIcon = () => {
    if (suggestion.source_flags.from_call) return '📞';
    if (suggestion.source_flags.from_audio) return '🎙️';
    if (suggestion.source_flags.from_free_text_form) return '✍️';
    if (suggestion.source_flags.from_google_doc) return '📝';
    return '🤖';
  };

  const handleCombineClick = () => {
    setCombinedContent(`${suggestion.previous_content || ''}\n\n${suggestion.content}`.trim());
    setShowCombine(true);
  };

  return (
    <div className={`suggestion-card ${suggestion.being_processed ? 'processing' : ''}`}>
      <div className="card-header">
        <span>{getSourceIcon()}</span>
        <h4>{suggestion.field_suggested_house?.field_name || 'AI Suggestion'}</h4>
        {suggestion.being_processed && <span className="processing-tag">Processing...</span>}
      </div>

      {suggestion.previous_content && (
        <div className="previous-section">
          <label>Previously recorded:</label>
          <p>{suggestion.previous_content}</p>
        </div>
      )}

      <div className="content-section">
        <label>AI Suggestion:</label>
        <textarea value={suggestion.content} readOnly rows={5} />
      </div>

      <div className="card-actions">
        <button className="btn-ignore" onClick={() => onIgnore(suggestion.id)} disabled={suggestion.being_processed}>
          Ignore
        </button>
        {suggestion.previous_content && (
          <button className="btn-combine" onClick={handleCombineClick} disabled={suggestion.being_processed}>
            Combine
          </button>
        )}
        <button className="btn-accept" onClick={() => onAccept(suggestion.id)} disabled={suggestion.being_processed}>
          Accept
        </button>
      </div>

      {showCombine && (
        <div className="combine-overlay" onClick={() => setShowCombine(false)}>
          <div className="combine-modal" onClick={e => e.stopPropagation()}>
            <h4>Combine Content</h4>
            <p>Edit the combined content:</p>
            <textarea
              value={combinedContent}
              onChange={e => setCombinedContent(e.target.value)}
              rows={8}
            />
            <div className="combine-actions">
              <button className="btn-ignore" onClick={() => setShowCombine(false)}>Cancel</button>
              <button className="btn-accept" onClick={() => { onCombine(suggestion.id, combinedContent); setShowCombine(false); }}>
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
        }

        .suggestion-card.processing {
          opacity: 0.6;
          pointer-events: none;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .card-header h4 {
          margin: 0;
          flex: 1;
          font-size: 16px;
        }

        .processing-tag {
          font-size: 12px;
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .previous-section {
          background: #fef3c7;
          border-left: 3px solid #f59e0b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .previous-section label, .content-section label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .previous-section p {
          margin: 0;
          font-size: 14px;
          color: #92400e;
        }

        .content-section textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          resize: none;
          background: #f9fafb;
        }

        .card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 16px;
        }

        .btn-ignore, .btn-combine, .btn-accept {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-ignore { background: #f3f4f6; color: #4b5563; }
        .btn-combine { background: #3b82f6; color: white; }
        .btn-accept { background: #8b5cf6; color: white; }

        .btn-ignore:disabled, .btn-combine:disabled, .btn-accept:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .combine-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
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
        }

        .combine-modal h4 {
          margin: 0 0 8px;
        }

        .combine-modal p {
          color: #6b7280;
          margin: 0 0 16px;
        }

        .combine-modal textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          resize: vertical;
          margin-bottom: 16px;
        }

        .combine-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}

export default DemoApp;
