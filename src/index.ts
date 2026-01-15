/**
 * AI Suggestions Module
 * Main entry point for the AI Suggestions component
 */

// Components
export { AISuggestionsModal, SuggestionCard, TranscriptPopup } from './components';

// Hooks
export { useAISuggestions } from './hooks';

// Types
export type {
  AISuggestion,
  HouseManual,
  Listing,
  ProgressStage,
  SuggestionDecision,
  SuggestionSourceFlags,
  AIFieldsHouseManual,
  AIFieldsListing,
  AISuggestionsModalState,
  AISuggestionsAction,
  AcceptSuggestionResponse,
  ReusePreviousHouseManualResponse,
  AISuggestionsModalProps,
  SuggestionCardProps,
  TranscriptPopupProps,
  ProgressIndicatorProps,
} from './types';

// Services (for advanced usage)
export {
  supabase,
  fetchHouseManualWithSuggestions,
  fetchPendingSuggestions,
  acceptSuggestion,
  acceptAllSuggestions,
  ignoreSuggestion,
  combineSuggestion,
  reusePreviousHouseManual,
  updateProgressStage,
  subscribeToSuggestionUpdates,
  subscribeToProgressUpdates,
} from './services';
