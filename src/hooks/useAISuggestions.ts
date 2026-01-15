/**
 * Custom Hook: useAISuggestions
 * Manages AI suggestions state and operations
 */

import { useReducer, useEffect, useCallback } from 'react';
import type {
  AISuggestion,
  HouseManual,
  AISuggestionsModalState,
  AISuggestionsAction,
} from '../types';
import {
  fetchHouseManualWithSuggestions,
  fetchPendingSuggestions,
  acceptSuggestion,
  acceptAllSuggestions,
  ignoreSuggestion,
  combineSuggestion,
  reusePreviousHouseManual,
  subscribeToSuggestionUpdates,
  subscribeToProgressUpdates,
} from '../services/supabase';

// Initial state
const initialState: AISuggestionsModalState = {
  isOpen: false,
  isLoading: false,
  currentSuggestionIndex: 0,
  suggestionDecisionMakingStarted: false,
  combineModalActive: false,
  editedContent: '',
  showTranscript: false,
  error: null,
};

// Extended state to include data
interface AISuggestionsState extends AISuggestionsModalState {
  houseManual: HouseManual | null;
  suggestions: AISuggestion[];
  pendingSuggestions: AISuggestion[];
}

const initialFullState: AISuggestionsState = {
  ...initialState,
  houseManual: null,
  suggestions: [],
  pendingSuggestions: [],
};

// Reducer function
function suggestionsReducer(
  state: AISuggestionsState,
  action: AISuggestionsAction
): AISuggestionsState {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        ...state,
        isOpen: true,
        isLoading: true,
        error: null,
      };

    case 'CLOSE_MODAL':
      return {
        ...initialFullState,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'SET_HOUSE_MANUAL':
      return {
        ...state,
        houseManual: action.payload,
        suggestions: action.payload.ai_suggestions || [],
        pendingSuggestions: (action.payload.ai_suggestions || []).filter(
          (s) => !s.being_processed && s.decision !== 'ignored'
        ),
        isLoading: false,
      };

    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload,
        pendingSuggestions: action.payload.filter(
          (s) => !s.being_processed && s.decision !== 'ignored'
        ),
      };

    case 'UPDATE_SUGGESTION': {
      const updatedSuggestions = state.suggestions.map((s) =>
        s.id === action.payload.id ? action.payload : s
      );
      return {
        ...state,
        suggestions: updatedSuggestions,
        pendingSuggestions: updatedSuggestions.filter(
          (s) => !s.being_processed && s.decision !== 'ignored'
        ),
      };
    }

    case 'ACCEPT_SUGGESTION':
    case 'IGNORE_SUGGESTION':
    case 'COMBINE_SUGGESTION': {
      const updatedSuggestions = state.suggestions.map((s) =>
        s.id === action.payload.suggestionId
          ? { ...s, being_processed: true }
          : s
      );
      return {
        ...state,
        suggestions: updatedSuggestions,
        pendingSuggestions: updatedSuggestions.filter(
          (s) => !s.being_processed && s.decision !== 'ignored'
        ),
        suggestionDecisionMakingStarted: true,
      };
    }

    case 'ACCEPT_ALL_SUGGESTIONS':
      return {
        ...state,
        suggestions: state.suggestions.map((s) => ({
          ...s,
          being_processed: true,
        })),
        pendingSuggestions: [],
        suggestionDecisionMakingStarted: true,
      };

    case 'SET_EDITED_CONTENT':
      return {
        ...state,
        editedContent: action.payload,
      };

    case 'TOGGLE_TRANSCRIPT':
      return {
        ...state,
        showTranscript: !state.showTranscript,
      };

    case 'NEXT_SUGGESTION':
      return {
        ...state,
        currentSuggestionIndex: Math.min(
          state.currentSuggestionIndex + 1,
          state.pendingSuggestions.length - 1
        ),
      };

    case 'PREVIOUS_SUGGESTION':
      return {
        ...state,
        currentSuggestionIndex: Math.max(state.currentSuggestionIndex - 1, 0),
      };

    default:
      return state;
  }
}

export function useAISuggestions(houseManualId: string | null) {
  const [state, dispatch] = useReducer(suggestionsReducer, initialFullState);

  // Load house manual and suggestions when ID changes
  useEffect(() => {
    if (!houseManualId) return;

    async function loadData() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const houseManual = await fetchHouseManualWithSuggestions(houseManualId);
        if (houseManual) {
          dispatch({ type: 'SET_HOUSE_MANUAL', payload: houseManual });
        }
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to load data',
        });
      }
    }

    loadData();
  }, [houseManualId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!houseManualId || !state.isOpen) return;

    const unsubscribeSuggestions = subscribeToSuggestionUpdates(
      houseManualId,
      (suggestion) => {
        dispatch({ type: 'UPDATE_SUGGESTION', payload: suggestion });
      }
    );

    const unsubscribeProgress = subscribeToProgressUpdates(
      houseManualId,
      (houseManual) => {
        dispatch({ type: 'SET_HOUSE_MANUAL', payload: houseManual });
      }
    );

    return () => {
      unsubscribeSuggestions();
      unsubscribeProgress();
    };
  }, [houseManualId, state.isOpen]);

  // Action handlers
  const openModal = useCallback(() => {
    if (houseManualId) {
      dispatch({ type: 'OPEN_MODAL', payload: { houseManualId } });
    }
  }, [houseManualId]);

  const closeModal = useCallback(() => {
    dispatch({ type: 'CLOSE_MODAL' });
  }, []);

  const handleAcceptSuggestion = useCallback(async (suggestionId: string) => {
    dispatch({ type: 'ACCEPT_SUGGESTION', payload: { suggestionId } });
    try {
      await acceptSuggestion(suggestionId);
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to accept suggestion',
      });
    }
  }, []);

  const handleIgnoreSuggestion = useCallback(async (suggestionId: string) => {
    dispatch({ type: 'IGNORE_SUGGESTION', payload: { suggestionId } });
    try {
      await ignoreSuggestion(suggestionId);
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to ignore suggestion',
      });
    }
  }, []);

  const handleCombineSuggestion = useCallback(
    async (suggestionId: string, combinedContent: string) => {
      dispatch({
        type: 'COMBINE_SUGGESTION',
        payload: { suggestionId, combinedContent },
      });
      try {
        await combineSuggestion(suggestionId, combinedContent);
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to combine suggestion',
        });
      }
    },
    []
  );

  const handleAcceptAll = useCallback(async () => {
    if (!houseManualId) return;
    dispatch({ type: 'ACCEPT_ALL_SUGGESTIONS' });
    try {
      await acceptAllSuggestions(houseManualId);
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to accept all suggestions',
      });
    }
  }, [houseManualId]);

  const handleReusePrevious = useCallback(async () => {
    if (!houseManualId || !state.houseManual) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await reusePreviousHouseManual(
        houseManualId,
        state.houseManual.host_id,
        state.houseManual.listing_id
      );
      dispatch({ type: 'SET_SUGGESTIONS', payload: result.suggestions });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to reuse previous content',
      });
    }
  }, [houseManualId, state.houseManual]);

  const toggleTranscript = useCallback(() => {
    dispatch({ type: 'TOGGLE_TRANSCRIPT' });
  }, []);

  const setEditedContent = useCallback((content: string) => {
    dispatch({ type: 'SET_EDITED_CONTENT', payload: content });
  }, []);

  const nextSuggestion = useCallback(() => {
    dispatch({ type: 'NEXT_SUGGESTION' });
  }, []);

  const previousSuggestion = useCallback(() => {
    dispatch({ type: 'PREVIOUS_SUGGESTION' });
  }, []);

  // Computed values
  const currentSuggestion = state.pendingSuggestions[state.currentSuggestionIndex] || null;
  const hasMoreSuggestions = state.currentSuggestionIndex < state.pendingSuggestions.length - 1;
  const hasPreviousSuggestion = state.currentSuggestionIndex > 0;
  const isProcessing =
    state.houseManual?.progress_stage === 'transcribing' ||
    state.houseManual?.progress_stage === 'analyzing' ||
    state.houseManual?.progress_stage === 'generating';
  const isEmpty = state.pendingSuggestions.length === 0 && !isProcessing;

  return {
    // State
    ...state,
    currentSuggestion,
    hasMoreSuggestions,
    hasPreviousSuggestion,
    isProcessing,
    isEmpty,

    // Actions
    openModal,
    closeModal,
    acceptSuggestion: handleAcceptSuggestion,
    ignoreSuggestion: handleIgnoreSuggestion,
    combineSuggestion: handleCombineSuggestion,
    acceptAll: handleAcceptAll,
    reusePrevious: handleReusePrevious,
    toggleTranscript,
    setEditedContent,
    nextSuggestion,
    previousSuggestion,
  };
}

export default useAISuggestions;
