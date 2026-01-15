# AI Suggestions Component

A React component for reviewing AI-generated suggestions for Split Lease house manual content.

## Overview

The AI Suggestions modal component presents AI-generated suggestions for house manual content. Users can:
- **Accept** suggestions as-is
- **Combine** suggestions with previously recorded content
- **Ignore** suggestions (discard and keep previous content)
- **Reuse** suggestions from earlier house manuals
- **View Transcript** of the original call

## Installation

```bash
npm install @split-lease/ai-suggestions
```

## Usage

```tsx
import { AISuggestionsModal } from '@split-lease/ai-suggestions';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AISuggestionsModal
      houseManualId="your-house-manual-id"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuggestionsAccepted={(suggestions) => {
        console.log('Accepted suggestions:', suggestions);
      }}
    />
  );
}
```

## Components

### AISuggestionsModal
Main modal component for reviewing suggestions.

**Props:**
- `houseManualId: string` - ID of the house manual
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal is closed
- `onSuggestionsAccepted?: (suggestions) => void` - Called when suggestions are accepted

### SuggestionCard
Individual suggestion card with accept/ignore/combine actions.

### TranscriptPopup
Overlay popup for viewing the original call transcript.

## Hooks

### useAISuggestions
Custom hook for managing suggestion state and operations.

```tsx
const {
  houseManual,
  pendingSuggestions,
  isLoading,
  isProcessing,
  acceptSuggestion,
  ignoreSuggestion,
  combineSuggestion,
  acceptAll,
  reusePrevious,
} = useAISuggestions(houseManualId);
```

## Data Types

### AISuggestion
```typescript
interface AISuggestion {
  id: string;
  content: string;
  previous_content: string | null;
  being_processed: boolean;
  decision: 'pending' | 'accepted' | 'ignored' | 'combined';
  field_suggested_house: AIFieldsHouseManual | null;
  source_flags: SuggestionSourceFlags;
  // ... more fields
}
```

### ProgressStage
```typescript
type ProgressStage =
  | 'idle'
  | 'transcribing'
  | 'analyzing'
  | 'generating'
  | 'ready'
  | 'complete'
  | 'error';
```

## Environment Variables

Configure Supabase connection:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

This component expects the following Supabase tables:

### ai_suggestions
- `id` (uuid, primary key)
- `house_manual_id` (uuid, foreign key)
- `content` (text)
- `previous_content` (text, nullable)
- `being_processed` (boolean)
- `decision` (text)
- `field_suggested_house` (jsonb)
- `source_flags` (jsonb)
- `created_at` (timestamp)
- `modified_at` (timestamp)

### house_manuals
- `id` (uuid, primary key)
- `progress_stage` (text)
- `transcript` (text, nullable)
- `host_id` (uuid)
- `listing_id` (uuid)

## Edge Functions

Required Supabase Edge Functions:
- `accept-house-manual-fields` - Processes accepted suggestions
- `reuse-previous-house-manuals` - Fetches suggestions from previous manuals

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

## License

MIT
