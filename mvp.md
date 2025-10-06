# Expense Tracker - MVP Specification

## The Core Magic ✨
**Upload a receipt image → Get structured data in 10 seconds**

That's it. That's the MVP. Everything else is secondary.

---

## What We're Building

A single-page web app where:
1. User drops/uploads a receipt image
2. Backend sends it to OpenAI Vision API
3. Frontend displays extracted: **Merchant**, **Amount**, **Date**
4. Data saves to localStorage automatically
5. User sees a simple list of all expenses below

**Goal**: Prove the concept works and feels magical before adding complexity.

---

## MVP Features (In Priority Order)

### 1. Receipt Upload & Extraction (THE CORE)
- **Drag-and-drop zone** for receipt images
- **Alternative**: Click to browse button
- Accept: JPG, PNG, WebP (max 5MB)
- Show loading spinner during extraction
- Display extracted data in ~5-10 seconds
- **Fields extracted**:
  - Merchant name
  - Total amount (with currency)
  - Transaction date

### 2. Simple Expense List
- Show all expenses in a basic list/table
- Display: Merchant, Amount, Date
- Most recent first
- **Actions per expense**:
  - View receipt image (click to expand)
  - Delete button

### 3. Local Storage
- Auto-save every expense to localStorage
- Store receipt image as base64
- Persist across browser sessions
- **That's it** - no export, no import, no backup

### 4. Basic Error Handling
- File too large → friendly error
- Network error → retry button
- API failure → show error, allow manual entry fallback
- Invalid image → clear message

---

## What We're NOT Building (Yet)

❌ Edit expense details  
❌ Categories/tags  
❌ Filters or search  
❌ Date range selection  
❌ Dashboard/analytics  
❌ Export/import  
❌ Charts or visualizations  
❌ Line items extraction  
❌ Manual expense entry form  
❌ Settings page  
❌ Multiple currencies  

**Why skip these?** They don't prove the core value prop. Add them in v2 after validating the magic works.

---

## Technical Implementation

### Backend (Express)

#### Single Endpoint That Matters
```
POST /api/extract
```
- Accepts multipart form data (receipt image)
- Sends to OpenAI Vision API with optimized prompt
- Returns JSON with merchant, amount, date
- **Response time goal**: < 8 seconds

#### The Prompt (Keep It Simple)
```
Extract expense data from this receipt and return ONLY valid JSON:
{
  "merchant": "store name",
  "amount": 0.00,
  "currency": "USD",
  "date": "YYYY-MM-DD"
}

If any field is unclear, use null. Do not include explanations.
```

#### OpenAI Config
- Model: `gpt-4o` or `gpt-4-vision-preview`
- Max tokens: 300 (we only need 4 fields)
- Temperature: 0.1 (consistent results)

#### That's The Whole Backend
- One route for extraction
- Optional: `GET /health` for Railway health checks
- Serve React build from Express static middleware
- **Total backend code**: ~100 lines

### Frontend (React)

#### Components (Minimal)
1. **App** - Main container
2. **UploadZone** - Drag-drop + file picker
3. **LoadingSpinner** - Shows during API call
4. **ResultCard** - Display extracted data
5. **ExpenseList** - Simple table of past expenses

#### State Management
```javascript
// That's all the state we need
const [expenses, setExpenses] = useState([]) // from localStorage
const [uploading, setUploading] = useState(false)
const [error, setError] = useState(null)
```

#### localStorage Schema
```javascript
[
  {
    id: "uuid",
    merchant: "Starbucks",
    amount: 15.50,
    currency: "USD",
    date: "2025-10-03",
    imageData: "data:image/jpeg;base64,...",
    timestamp: "2025-10-03T14:30:00Z"
  }
]
```

#### User Flow (The Happy Path)
1. Page loads → Show upload zone + list of expenses
2. User drops image → Preview appears
3. Click "Extract" → Spinner shows
4. API returns data → Show merchant, amount, date
5. Auto-save to localStorage → Add to list
6. Reset → Ready for next receipt

**Total interactions**: 2 clicks (upload + extract)

---

## UI/UX (Bare Minimum)

### Layout
```
┌─────────────────────────────────────┐
│     EXPENSE TRACKER                 │
├─────────────────────────────────────┤
│                                     │
│   [Drag & Drop Receipt Here]        │
│   [or click to browse]              │
│                                     │
├─────────────────────────────────────┤
│   Recent Expenses                   │
│                                     │
│   Starbucks      $15.50   Oct 3     │
│   [View] [Delete]                   │
│                                     │
│   Target          $45.20   Oct 2    │
│   [View] [Delete]                   │
└─────────────────────────────────────┘
```

### Styling
- Clean, minimal CSS (no framework needed)
- Mobile-responsive basics
- Clear visual feedback
- **No fancy animations** - just functional

### States to Handle
- **Empty state**: "No expenses yet. Upload your first receipt!"
- **Loading state**: Spinner + "Extracting data..."
- **Success state**: Brief "Saved!" message
- **Error state**: Red text + retry button

---

## Success Criteria (MVP)

The MVP is successful if:

1. ✅ User can upload a receipt image
2. ✅ Extraction completes in < 10 seconds
3. ✅ Merchant, amount, and date are extracted correctly >70% of the time
4. ✅ Data persists after browser refresh
5. ✅ User can delete an expense
6. ✅ User can view the original receipt image
7. ✅ Basic errors are handled gracefully
8. ✅ App deploys successfully on Railway

**If all 8 work → MVP complete → Iterate**

---

## File Structure

```
expense-tracker/
├── backend/
│   ├── server.js           # Express app (~100 lines)
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── components/
│   │   │   ├── UploadZone.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── utils/
│   │   │   └── localStorage.js
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## Development Order (Do This First)

### Day 1: Backend + OpenAI
1. ✅ Set up Express server
2. ✅ Install OpenAI SDK
3. ✅ Create `/api/extract` endpoint
4. ✅ Test with Postman/curl using sample receipt
5. ✅ Verify extraction quality

### Day 2: Frontend Core
1. ✅ Set up React with Vite
2. ✅ Build UploadZone component
3. ✅ Connect to backend API
4. ✅ Display extracted data
5. ✅ Implement localStorage save

### Day 3: Polish + Deploy
1. ✅ Build ExpenseList component
2. ✅ Add delete functionality
3. ✅ Handle errors properly
4. ✅ Test with 5+ receipts
5. ✅ Deploy to Railway

**Total**: 3 days max for MVP

---

## Dependencies (Minimal)

### Backend
```json
{
  "express": "^4.18.2",
  "multer": "^1.4.5-lts.1",
  "openai": "^4.20.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.0"
}
```

**That's it.** No UI frameworks, no charts, no extras.

---

## Testing the MVP

### Manual Tests
1. **Happy path**: Upload Starbucks receipt → verify merchant/amount/date correct
2. **Bad image**: Upload non-receipt → should handle gracefully
3. **Network issue**: Disconnect wifi during upload → show error
4. **Persistence**: Refresh page → expenses still there
5. **Delete**: Remove expense → gone from localStorage
6. **Multiple receipts**: Upload 3-5 in a row → all save correctly

### Edge Cases (Handle These)
- Very large image (10MB+)
- Image with no text
- Sideways/upside-down receipt
- Very faded/poor quality receipt
- Non-receipt image (e.g., random photo)

---

## Performance Targets

- **Upload to extraction**: < 10 seconds (target: 5-7s)
- **Save to localStorage**: < 100ms
- **Load expenses on mount**: < 200ms
- **Page load (initial)**: < 2 seconds

---

## Cost Estimate (MVP Testing)

- OpenAI Vision API: ~$0.01-0.03 per image
- Testing with 50 receipts: ~$1-1.50
- Railway free tier: $0/month (with limits)

**Total MVP cost**: < $5

---

## The "Wow" Moment

When you drop a crumpled Starbucks receipt and see:

```
✨ Extracted!

Merchant: Starbucks
Amount: $15.50
Date: October 3, 2025

✅ Saved to your expenses
```

**That's the magic.** Everything else is just support.

---

## What Makes This MVP Special

1. **Fast**: 10 seconds from upload to data
2. **Accurate**: GPT-4 Vision is scary good at OCR
3. **Simple**: 3 fields, no complexity
4. **Instant value**: See your expenses immediately
5. **No setup**: No login, no config, just works

---

## Iteration Plan (Post-MVP)

Once MVP works and users love it:

**v1.1**: Add manual edit capability  
**v1.2**: Add category tags  
**v1.3**: Add filters and search  
**v1.4**: Add simple monthly totals  
**v1.5**: Add export to CSV  

But don't build these until MVP proves people want the core feature.

---

## Key Decisions Made

✅ **No edit mode** → Keeps MVP simple, AI should be good enough  
✅ **No categories** → Can't agree on categorization rules yet  
✅ **No manual entry** → Forces us to nail the extraction  
✅ **Auto-save** → One less button, better UX  
✅ **No line items** → Just total matters for MVP  
✅ **localStorage only** → Deploy in 1 day not 5  

---

## The One Thing That Must Work

**If the extraction feels slow or inaccurate, nothing else matters.**

Optimize for:
1. Speed (< 10s)
2. Accuracy (merchant + amount + date)
3. Error recovery

Get these right, and the MVP succeeds.

---

## Deployment Checklist

- [ ] Environment variable for `OPENAI_API_KEY`
- [ ] Build React frontend
- [ ] Serve frontend from Express static
- [ ] Set PORT from environment
- [ ] Test on Railway staging
- [ ] Deploy to production
- [ ] Test with real phone + real receipt

---

## MVP Complete When...

You can:
1. Take a photo of a receipt on your phone
2. Upload it to the deployed app
3. See correct merchant, amount, and date in < 10 seconds
4. See it in your expense list
5. Refresh and it's still there
6. Show it to a friend and they say "wow, that's cool"

**Then you have an MVP worth iterating on.**



