/**
 * Mock Data for AI Suggestions Preview
 */

import type { AISuggestion, HouseManual, ProgressStage } from '../types';

// Mock AI Suggestions
export const mockSuggestions: AISuggestion[] = [
  {
    id: 'sug-001',
    slug: 'check-in-instructions',
    being_processed: false,
    decision: 'pending',
    content: 'Check-in time is 3:00 PM. Upon arrival, please use the lockbox located on the front door. The code is 1234. Once inside, you\'ll find a welcome packet on the kitchen counter with WiFi details and local recommendations.',
    previous_content: 'Check-in is at 3 PM. Use the front door lockbox.',
    raw_text_sent: 'The guest asked about check-in and I told them it\'s at 3 PM...',
    field_suggested_house: {
      field_name: 'Check-in Instructions',
      display_value: 'Check-in time is 3:00 PM. Upon arrival, please use the lockbox located on the front door. The code is 1234.',
      raw_value: 'check_in_instructions',
    },
    field_suggested_listing: null,
    source_flags: {
      from_audio: false,
      from_call: true,
      from_free_text_form: false,
      from_google_doc: false,
      from_listing: false,
      from_pdf: false,
    },
    house_manual_id: 'hm-001',
    listing_id: 'lst-001',
    creator_id: 'user-001',
    created_at: '2024-01-15T10:30:00Z',
    modified_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'sug-002',
    slug: 'wifi-details',
    being_processed: false,
    decision: 'pending',
    content: 'WiFi Network: "Sunny Beach House"\nPassword: Welcome2024!\n\nThe router is located in the living room behind the TV if you need to reset it.',
    previous_content: null,
    raw_text_sent: null,
    field_suggested_house: {
      field_name: 'WiFi Information',
      display_value: 'Network: Sunny Beach House | Password: Welcome2024!',
      raw_value: 'wifi_info',
    },
    field_suggested_listing: null,
    source_flags: {
      from_audio: false,
      from_call: true,
      from_free_text_form: false,
      from_google_doc: false,
      from_listing: false,
      from_pdf: false,
    },
    house_manual_id: 'hm-001',
    listing_id: 'lst-001',
    creator_id: 'user-001',
    created_at: '2024-01-15T10:31:00Z',
    modified_at: '2024-01-15T10:31:00Z',
  },
  {
    id: 'sug-003',
    slug: 'parking-instructions',
    being_processed: false,
    decision: 'pending',
    content: 'Free parking is available in the driveway (fits 2 cars). Street parking is also available but please note the Tuesday street cleaning schedule - no parking 8 AM to 12 PM on Tuesdays.',
    previous_content: 'Park in the driveway. Street parking available.',
    raw_text_sent: 'Host mentioned parking in driveway and street cleaning on Tuesdays',
    field_suggested_house: {
      field_name: 'Parking Instructions',
      display_value: 'Driveway parking for 2 cars. Street parking available (no parking Tues 8AM-12PM for cleaning).',
      raw_value: 'parking',
    },
    field_suggested_listing: null,
    source_flags: {
      from_audio: true,
      from_call: false,
      from_free_text_form: false,
      from_google_doc: false,
      from_listing: false,
      from_pdf: false,
    },
    house_manual_id: 'hm-001',
    listing_id: 'lst-001',
    creator_id: 'user-001',
    created_at: '2024-01-15T10:32:00Z',
    modified_at: '2024-01-15T10:32:00Z',
  },
  {
    id: 'sug-004',
    slug: 'checkout-instructions',
    being_processed: false,
    decision: 'pending',
    content: 'Check-out time is 11:00 AM. Before leaving, please:\n• Strip the beds and leave linens in the laundry basket\n• Load and run the dishwasher\n• Take out trash to the bins by the garage\n• Lock all doors and windows\n• Return keys to the lockbox',
    previous_content: 'Checkout by 11 AM. Leave keys in lockbox.',
    raw_text_sent: null,
    field_suggested_house: {
      field_name: 'Check-out Instructions',
      display_value: 'Check-out by 11:00 AM. Strip beds, run dishwasher, take out trash, lock up, return keys to lockbox.',
      raw_value: 'check_out_instructions',
    },
    field_suggested_listing: null,
    source_flags: {
      from_audio: false,
      from_call: false,
      from_free_text_form: true,
      from_google_doc: false,
      from_listing: false,
      from_pdf: false,
    },
    house_manual_id: 'hm-001',
    listing_id: 'lst-001',
    creator_id: 'user-001',
    created_at: '2024-01-15T10:33:00Z',
    modified_at: '2024-01-15T10:33:00Z',
  },
  {
    id: 'sug-005',
    slug: 'emergency-contacts',
    being_processed: false,
    decision: 'pending',
    content: 'Emergency Contacts:\n• Property Manager: Sarah (555) 123-4567 - available 8 AM - 10 PM\n• Emergency: 911\n• Nearest Hospital: St. Mary\'s Medical Center - 2.5 miles away\n• Maintenance issues after hours: Text (555) 987-6543',
    previous_content: null,
    raw_text_sent: null,
    field_suggested_house: {
      field_name: 'Emergency Contacts',
      display_value: 'Property Manager: Sarah (555) 123-4567. Nearest Hospital: St. Mary\'s (2.5 mi)',
      raw_value: 'emergency_contacts',
    },
    field_suggested_listing: null,
    source_flags: {
      from_audio: false,
      from_call: false,
      from_free_text_form: false,
      from_google_doc: true,
      from_listing: false,
      from_pdf: false,
    },
    house_manual_id: 'hm-001',
    listing_id: 'lst-001',
    creator_id: 'user-001',
    created_at: '2024-01-15T10:34:00Z',
    modified_at: '2024-01-15T10:34:00Z',
  },
];

// Mock House Manual
export const mockHouseManual: HouseManual = {
  id: 'hm-001',
  slug: 'sunny-beach-house-manual',
  ai_suggestions: mockSuggestions,
  ai_suggestions_creation: true,
  progress_stage: 'ready',
  transcript: `Call Transcript - January 15, 2024

Host: Hi, this is Sarah from Sunny Beach House.

Split Bot: Hello Sarah! I'm here to help create your house manual. Let's start with check-in. What time can guests check in?

Host: Check-in is at 3 PM. We use a lockbox on the front door with code 1234.

Split Bot: Great! And what about WiFi?

Host: The network is called "Sunny Beach House" and the password is "Welcome2024!" with an exclamation mark.

Split Bot: Perfect. Any parking instructions?

Host: Yes, they can park in the driveway - fits 2 cars. Street parking is available too but we have street cleaning on Tuesdays from 8 AM to noon.

Split Bot: Good to know. What about check-out?

Host: Check-out is 11 AM. We ask guests to strip the beds, run the dishwasher, and take out the trash. Keys go back in the lockbox.

Split Bot: Excellent. Any emergency contacts to include?

Host: They can reach me at 555-123-4567 from 8 AM to 10 PM. For after-hours maintenance, they can text 555-987-6543. Nearest hospital is St. Mary's, about 2.5 miles away.

Split Bot: Thank you Sarah! I have all the information I need to create your house manual.

Host: Thank you! Looking forward to seeing it.

[End of Call]`,
  transcript_source: 'call',
  host_id: 'host-001',
  listing_id: 'lst-001',
  created_at: '2024-01-15T10:00:00Z',
  modified_at: '2024-01-15T10:35:00Z',
};

// Function to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock service functions
export const mockServices = {
  async fetchHouseManual(id: string): Promise<HouseManual> {
    await delay(800);
    return { ...mockHouseManual, id };
  },

  async fetchPendingSuggestions(houseManualId: string): Promise<AISuggestion[]> {
    await delay(500);
    return mockSuggestions.filter(s => !s.being_processed && s.decision === 'pending');
  },

  async acceptSuggestion(suggestionId: string): Promise<AISuggestion> {
    await delay(600);
    const suggestion = mockSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');
    return { ...suggestion, decision: 'accepted', being_processed: false };
  },

  async ignoreSuggestion(suggestionId: string): Promise<AISuggestion> {
    await delay(400);
    const suggestion = mockSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');
    return { ...suggestion, decision: 'ignored' };
  },

  async combineSuggestion(suggestionId: string, combinedContent: string): Promise<AISuggestion> {
    await delay(700);
    const suggestion = mockSuggestions.find(s => s.id === suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');
    return { ...suggestion, content: combinedContent, decision: 'combined', being_processed: false };
  },
};

// Progress stage simulator for demo
export function createProgressSimulator(
  onProgressChange: (stage: ProgressStage) => void
) {
  const stages: ProgressStage[] = ['transcribing', 'analyzing', 'generating', 'ready'];
  let currentIndex = 0;

  const interval = setInterval(() => {
    onProgressChange(stages[currentIndex]);
    currentIndex++;
    if (currentIndex >= stages.length) {
      clearInterval(interval);
    }
  }, 2000);

  return () => clearInterval(interval);
}
