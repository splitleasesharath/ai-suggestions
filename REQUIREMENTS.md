COMPREHENSIVE REQUIREMENTS DOCUMENTATION

Bubble Reusable Element: ♥️💥 ai-suggestionsPage Type: Reusable Element (Custom Component)  
Application: Split Lease \- Production

EXECUTIVE SUMMARY

The ai-suggestions reusable element is a modal/popup component that presents AI-generated suggestions for house manual content. Users can accept, ignore, combine suggestions with previous content, or reuse suggestions from earlier house manuals. The element manages the complete suggestion review workflow including progress tracking, content comparison, and decision making.

CORE FUNCTIONALITY

1\. Accept Suggestions \- User approves AI suggestion as-is  
2\. Combine Suggestions \- Merge AI suggestion with previously recorded content  
3\. Ignore Suggestions \- Discard suggestion, keep previous content  
4\. Reuse Previous Content \- Pull suggestions from earlier house manuals  
5\. View Transcript \- Open popup showing original call transcript  
6\. Progress Tracking \- Monitor House Manual processing status

DATA TYPES

ZAT-AI Suggestions (Primary Data Type)  
Fields:  
\- being\_processed? (yes/no) \- Indicates if suggestion is being generated  
\- Content (text) \- Raw or final suggestion content  
\- Field\_suggested\_house (AI fields house manual) \- Formatted display version for house manual  
\- Field\_suggested\_listing (AI Fields Listing) \- Formatted display version for listing  
\- from\_audio? / from\_call? / from\_free\_text\_form? / from\_google\_doc? / from\_listing? / from\_PDF? (yes/no) \- Source flags  
\- House\_Manual (House manual) \- Link to parent House Manual record  
\- Listing (Listing) \- Associated Listing  
\- Previous\_Content (text) \- Previously recorded content for comparison  
\- raw\_text\_sent (text) \- Original/unprocessed input text  
\- Creator (User) \- User who created suggestion (built-in)  
\- Modified\_Date (date) \- Last modification timestamp (built-in)  
\- Created\_Date (date) \- Creation timestamp (built-in)  
\- Slug (text) \- Identifier slug (built-in)

House Manual (Related Data Type)  
Key Relevant Fields:  
\- AI Suggestions (List of ZAT-AI Suggestions) \- One-to-many relationship  
\- AI suggestions creation (yes/no) \- Flag for AI workflow initiation  
\- Progress Stage (text/option) \- Current processing stage

UI ELEMENT STRUCTURE

Root Element: ai-suggestions (Popup, Type of Content: House manual)

Child Elements:  
1\. Group House manual \- Contains header with title "Review AI Suggestions"  
2\. G: Wait Notification \- Shows loading state with message "We're processing your Arbitrary text now..."  
3\. G: Container of RG of AI suggestions \- Main suggestion review area  
   \- Contains Repeating Group of suggestions  
   \- Shows suggestion heading, previous content, and full content textarea  
   \- Action buttons: Ignore, Combine, Accept  
4\. G: Empty view, no more suggestions \- Shows when no data to review  
5\. GF: House manual transcript INSIDE POPUP \- Overlay popup for viewing transcript

Key UI Components:  
\- "Review AI Suggestions" Title  
\- "Transcribed Call by Split Bot" Label  
\- Progress Stage Display (dynamic text showing processing status)  
\- Large textarea showing current suggestion content (readonly)  
\- "Previously recorded:" label with previous content text  
\- Three action buttons: Ignore (gray), Combine (blue), Accept (purple)  
\- "Accept All Suggestions" button  
\- "Reuse" button (in empty state)  
\- "View Transcript" button/icon  
\- "Close" button (X)

FRONTEND WORKFLOWS (19 Total)

1\. B: Accept AI Suggestions is clicked  
   \- Sets being\_processed? \= yes on ZAT-AI Suggestions  
   \- Shows success alert  
   \- Schedules API workflow \[2-accept-house-manual\]-fields  
   \- Sets custom state for decision tracking

2\. B: Accept All AI Suggestions is clicked  
   \- Batch accepts all suggestions  
   \- Calls backend workflow

3\. B: combine AI suggestions is clicked  
   \- Combines Field suggested \+ Previous Content  
   \- Merges into single content  
   \- Updates ZAT-AI Suggestions

4\. B: Ignore AI Suggestions is clicked  
   \- Marks suggestion as ignored  
   \- Advances to next suggestion

5\. B: Reuse previous HM is clicked  
   \- Searches previous House Manuals for same host/listing  
   \- Creates new ZAT-AI Suggestions from reused content  
   \- Updates UI to show new suggestion

6\. G: Copy from Transcript is clicked  
   \- Copies transcript to clipboard

7\. T: view transcript is clicked  
   \- Shows GF: House manual transcript INSIDE POPUP

8\. I: Close suggestions popup is clicked  
   \- Hides popup/modal  
   \- Resets states

9-19. Additional workflows for:  
   \- Photo uploader management  
   \- Content editing  
   \- Review actions  
   \- Close actions  
   \- Custom events and conditional workflows

BACKEND WORKFLOWS

1\. \[2-accept-house-manual\]-fields API Workflow  
   \- Triggered by: Accept suggestion action  
   \- Purpose: Process accepted suggestion and update House Manual  
   \- Actions: Update House Manual field with accepted content

2\. Reuse-Previous-House-Manuals Workflow  
   \- Searches previous House Manuals by host/listing  
   \- Extracts relevant fields  
   \- Creates new ZAT-AI Suggestions from previous content  
   \- Returns result to frontend

3\. AI Suggestion Generation (Inferred)  
   \- External AI API call (likely OpenAI)  
   \- Collects source data (transcript, text, PDFs, etc.)  
   \- Creates ZAT-AI Suggestions records  
   \- Updates Progress Stage

CONDITIONAL VISIBILITY RULES

\- G: Wait Notification: Visible when Progress Stage \= "transcribing" or "analyzing"  
\- G: Container of RG of AI suggestions: Visible when suggestions exist AND not processing  
\- G: Empty view \#1: Visible when no suggestions exist  
\- G: Empty view \#2 \+ Reuse button: Visible when no suggestions to review  
\- Buttons (Ignore, Combine, Accept): Enabled when suggestion data exists

DATA BINDINGS

Dynamic Text Expressions:  
\- "Parent group's ZAT-AI Suggestions's Field suggested house manual's Display on screen" \- Shows formatted suggestion  
\- "Parent group's ZAT-AI Suggestions's Previous Content" \- Shows previous recorded content for comparison  
\- "Parent group's ZAT-AI Suggestions's Content" \- Shows full suggestion in textarea  
\- "ai-suggestions's House manual's Progress Stage's Display" \- Shows processing status

REPEATING GROUP

\- Type of content: ZAT-AI Suggestions  
\- Data source: House Manual's AI Suggestions (filtered)  
\- Filters: being\_processed \= false, status \!= ignored  
\- Pagination: Load suggestions as user progresses

CUSTOM STATES (Inferred)

\- suggestion\_decision\_making\_started (boolean) \- Tracks if user is making decisions  
\- current\_suggestion\_index (number) \- Tracks position in suggestion list  
\- combine\_mode\_active (boolean) \- Tracks if combining  
\- edited\_content (text) \- Stores temp edits

KEY MIGRATION CONSIDERATIONS

1\. State Machine Pattern: Element states (processing, reviewing, empty, complete)  
2\. Modal/Popup Pattern: Component shown/hidden via workflows  
3\. Side-by-side Comparison: Display new \+ previous content simultaneously  
4\. Cascading Workflows: Frontend action triggers backend API  
5\. Data Binding: Dynamic expressions referencing parent/related data  
6\. Error Handling: Handle API failures, empty data, timeouts  
7\. Progress Tracking: Reflect House Manual status through UI  
8\. Performance: Lazy load suggestions, avoid excessive re-renders

GAPS REQUIRING FURTHER ANALYSIS

\- Exact combine algorithm (concatenation vs AI-assisted vs structured)  
\- Detailed conditional expressions for each element  
\- Complete backend workflow parameter lists  
\- Transcript popup configuration details  
\- Edit content workflow specifics  
\- Photo uploader integration details  
\- Option set values for Progress Stage  
\- Error handling and retry logic  
\- API endpoint details and request/response structures  
\- Custom state initialization and lifecycle

For Complete Analysis:  
1\. Inspect each element's Conditional tab for exact expressions  
2\. Document all "Make changes to..." workflow steps with field names  
3\. Review Backend Workflows tab for API configurations  
4\. Check Data tab Option Sets for Progress Stage values  
5\. Test in Preview mode for actual behavioral flows

