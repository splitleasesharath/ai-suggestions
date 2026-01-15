/**
 * AI Suggestions Types
 * Based on Bubble ZAT-AI Suggestions data structure
 */

// Progress Stage enum for House Manual processing status
export type ProgressStage =
  | 'idle'
  | 'transcribing'
  | 'analyzing'
  | 'generating'
  | 'ready'
  | 'complete'
  | 'error';

// Source flags for suggestion origin
export interface SuggestionSourceFlags {
  from_audio: boolean;
  from_call: boolean;
  from_free_text_form: boolean;
  from_google_doc: boolean;
  from_listing: boolean;
  from_pdf: boolean;
}

// AI Fields formatted for display
export interface AIFieldsHouseManual {
  field_name: string;
  display_value: string;
  raw_value: string;
}

export interface AIFieldsListing {
  field_name: string;
  display_value: string;
  raw_value: string;
}

// Decision status for a suggestion
export type SuggestionDecision =
  | 'pending'
  | 'accepted'
  | 'ignored'
  | 'combined';

// Primary ZAT-AI Suggestions data type
export interface AISuggestion {
  id: string;
  slug: string;

  // Processing state
  being_processed: boolean;
  decision: SuggestionDecision;

  // Content fields
  content: string;
  previous_content: string | null;
  raw_text_sent: string | null;

  // Formatted display versions
  field_suggested_house: AIFieldsHouseManual | null;
  field_suggested_listing: AIFieldsListing | null;

  // Source flags
  source_flags: SuggestionSourceFlags;

  // Relationships
  house_manual_id: string;
  listing_id: string | null;

  // Metadata
  creator_id: string;
  created_at: string;
  modified_at: string;
}

// House Manual related data type
export interface HouseManual {
  id: string;
  slug: string;

  // AI Suggestions relationship
  ai_suggestions: AISuggestion[];
  ai_suggestions_creation: boolean;

  // Processing status
  progress_stage: ProgressStage;

  // Transcript data
  transcript: string | null;
  transcript_source: 'call' | 'audio' | 'document' | null;

  // Related entities
  host_id: string;
  listing_id: string;

  // Metadata
  created_at: string;
  modified_at: string;
}

// Listing type (simplified)
export interface Listing {
  id: string;
  name: string;
  address: string | null;
  host_id: string;
}

// UI State types
export interface AISuggestionsModalState {
  isOpen: boolean;
  isLoading: boolean;
  currentSuggestionIndex: number;
  suggestionDecisionMakingStarted: boolean;
  combineModalActive: boolean;
  editedContent: string;
  showTranscript: boolean;
  error: string | null;
}

// Action types for state management
export type AISuggestionsAction =
  | { type: 'OPEN_MODAL'; payload: { houseManualId: string } }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ACCEPT_SUGGESTION'; payload: { suggestionId: string } }
  | { type: 'IGNORE_SUGGESTION'; payload: { suggestionId: string } }
  | { type: 'COMBINE_SUGGESTION'; payload: { suggestionId: string; combinedContent: string } }
  | { type: 'ACCEPT_ALL_SUGGESTIONS' }
  | { type: 'SET_EDITED_CONTENT'; payload: string }
  | { type: 'TOGGLE_TRANSCRIPT' }
  | { type: 'NEXT_SUGGESTION' }
  | { type: 'PREVIOUS_SUGGESTION' }
  | { type: 'SET_SUGGESTIONS'; payload: AISuggestion[] }
  | { type: 'UPDATE_SUGGESTION'; payload: AISuggestion }
  | { type: 'SET_HOUSE_MANUAL'; payload: HouseManual };

// API Response types
export interface AcceptSuggestionResponse {
  success: boolean;
  suggestion: AISuggestion;
  house_manual: HouseManual;
}

export interface ReusePreviousHouseManualResponse {
  success: boolean;
  suggestions: AISuggestion[];
  source_house_manual_id: string;
}

// Props types for components
export interface AISuggestionsModalProps {
  houseManualId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuggestionsAccepted?: (suggestions: AISuggestion[]) => void;
}

export interface SuggestionCardProps {
  suggestion: AISuggestion;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onCombine: (id: string, combinedContent: string) => void;
  isProcessing: boolean;
}

export interface TranscriptPopupProps {
  transcript: string;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export interface ProgressIndicatorProps {
  stage: ProgressStage;
  message?: string;
}
