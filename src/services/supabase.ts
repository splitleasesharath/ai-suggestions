/**
 * Supabase Service Layer for AI Suggestions
 * Handles all database operations for suggestions and house manuals
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  AISuggestion,
  HouseManual,
  SuggestionDecision,
  AcceptSuggestionResponse,
  ReusePreviousHouseManualResponse,
} from '../types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch a house manual with its AI suggestions
 */
export async function fetchHouseManualWithSuggestions(
  houseManualId: string
): Promise<HouseManual | null> {
  const { data, error } = await supabase
    .from('house_manuals')
    .select(`
      *,
      ai_suggestions (
        *
      )
    `)
    .eq('id', houseManualId)
    .single();

  if (error) {
    console.error('Error fetching house manual:', error);
    throw new Error(`Failed to fetch house manual: ${error.message}`);
  }

  return data as HouseManual;
}

/**
 * Fetch AI suggestions for a house manual
 * Filtered to exclude processed and ignored suggestions
 */
export async function fetchPendingSuggestions(
  houseManualId: string
): Promise<AISuggestion[]> {
  const { data, error } = await supabase
    .from('ai_suggestions')
    .select('*')
    .eq('house_manual_id', houseManualId)
    .eq('being_processed', false)
    .neq('decision', 'ignored')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching suggestions:', error);
    throw new Error(`Failed to fetch suggestions: ${error.message}`);
  }

  return data as AISuggestion[];
}

/**
 * Accept a single AI suggestion
 */
export async function acceptSuggestion(
  suggestionId: string
): Promise<AcceptSuggestionResponse> {
  // Mark suggestion as being processed
  const { error: updateError } = await supabase
    .from('ai_suggestions')
    .update({
      being_processed: true,
      decision: 'accepted' as SuggestionDecision,
      modified_at: new Date().toISOString(),
    })
    .eq('id', suggestionId);

  if (updateError) {
    throw new Error(`Failed to accept suggestion: ${updateError.message}`);
  }

  // Call edge function to process acceptance and update house manual
  const { data, error } = await supabase.functions.invoke('accept-house-manual-fields', {
    body: { suggestion_id: suggestionId },
  });

  if (error) {
    throw new Error(`Failed to process accepted suggestion: ${error.message}`);
  }

  return data as AcceptSuggestionResponse;
}

/**
 * Accept all pending AI suggestions for a house manual
 */
export async function acceptAllSuggestions(
  houseManualId: string
): Promise<AcceptSuggestionResponse[]> {
  // Fetch all pending suggestions
  const suggestions = await fetchPendingSuggestions(houseManualId);

  // Accept each suggestion
  const results: AcceptSuggestionResponse[] = [];
  for (const suggestion of suggestions) {
    const result = await acceptSuggestion(suggestion.id);
    results.push(result);
  }

  return results;
}

/**
 * Ignore a single AI suggestion
 */
export async function ignoreSuggestion(suggestionId: string): Promise<AISuggestion> {
  const { data, error } = await supabase
    .from('ai_suggestions')
    .update({
      decision: 'ignored' as SuggestionDecision,
      modified_at: new Date().toISOString(),
    })
    .eq('id', suggestionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to ignore suggestion: ${error.message}`);
  }

  return data as AISuggestion;
}

/**
 * Combine suggestion with previous content
 */
export async function combineSuggestion(
  suggestionId: string,
  combinedContent: string
): Promise<AISuggestion> {
  const { data, error } = await supabase
    .from('ai_suggestions')
    .update({
      content: combinedContent,
      decision: 'combined' as SuggestionDecision,
      being_processed: true,
      modified_at: new Date().toISOString(),
    })
    .eq('id', suggestionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to combine suggestion: ${error.message}`);
  }

  // Process the combined suggestion
  await supabase.functions.invoke('accept-house-manual-fields', {
    body: { suggestion_id: suggestionId },
  });

  return data as AISuggestion;
}

/**
 * Reuse suggestions from a previous house manual
 */
export async function reusePreviousHouseManual(
  currentHouseManualId: string,
  hostId: string,
  listingId?: string
): Promise<ReusePreviousHouseManualResponse> {
  const { data, error } = await supabase.functions.invoke('reuse-previous-house-manuals', {
    body: {
      current_house_manual_id: currentHouseManualId,
      host_id: hostId,
      listing_id: listingId,
    },
  });

  if (error) {
    throw new Error(`Failed to reuse previous house manual: ${error.message}`);
  }

  return data as ReusePreviousHouseManualResponse;
}

/**
 * Update house manual progress stage
 */
export async function updateProgressStage(
  houseManualId: string,
  stage: string
): Promise<void> {
  const { error } = await supabase
    .from('house_manuals')
    .update({
      progress_stage: stage,
      modified_at: new Date().toISOString(),
    })
    .eq('id', houseManualId);

  if (error) {
    throw new Error(`Failed to update progress stage: ${error.message}`);
  }
}

/**
 * Subscribe to real-time updates for suggestions
 */
export function subscribeToSuggestionUpdates(
  houseManualId: string,
  callback: (suggestion: AISuggestion) => void
) {
  const subscription = supabase
    .channel(`suggestions:${houseManualId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ai_suggestions',
        filter: `house_manual_id=eq.${houseManualId}`,
      },
      (payload) => {
        callback(payload.new as AISuggestion);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Subscribe to real-time updates for house manual progress
 */
export function subscribeToProgressUpdates(
  houseManualId: string,
  callback: (houseManual: HouseManual) => void
) {
  const subscription = supabase
    .channel(`house_manual:${houseManualId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'house_manuals',
        filter: `id=eq.${houseManualId}`,
      },
      (payload) => {
        callback(payload.new as HouseManual);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}
