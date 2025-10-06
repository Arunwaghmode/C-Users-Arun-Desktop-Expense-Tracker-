# Expense Tracker - Project Scope

## Project Overview
A web-based expense tracker that allows users to upload receipt images and automatically extract expense data using OpenAI's Vision API. The application provides a simple interface to manage and track expenses without requiring user authentication or a backend database.

## Core Objective
Enable users to quickly digitize their receipts by uploading images and getting structured expense data extracted automatically, with all data stored locally in the browser.

---

## Technical Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Service**: OpenAI Vision API (GPT-4 Vision)
- **Image Handling**: Multipart form data processing (multer or similar)
- **CORS**: Enable cross-origin requests from frontend

### Frontend
- **Framework**: React
- **Storage**: Browser localStorage (no database)
- **Styling**: CSS (or lightweight CSS framework)
- **Features**: Drag-and-drop file upload, data visualization

### Deployment
- **Platform**: Railway
- **Configuration**: Single deployment with both frontend and backend

---

## Core Features

### 1. Receipt Upload
- **Drag-and-drop interface** for uploading receipt images
- **Click-to-browse** alternative for file selection
- Supported formats: JPEG, PNG, WebP
- File size validation (max 5MB per image)
- Visual feedback during upload process
- Preview of uploaded image before processing

### 2. AI-Powered Data Extraction
- Send receipt image to OpenAI Vision API
- Extract the following fields:
  - **Merchant/Vendor name**
  - **Total amount** (with currency)
  - **Date** of transaction
  - **Category** (e.g., Food, Transport, Entertainment, Shopping, etc.)
  - **Items** (optional line items, if clearly visible)
- Handle extraction errors gracefully
- Display confidence or allow manual editing of extracted data

### 3. Expense Management
- **View all expenses** in a list/table format
- **Edit expense details** manually after extraction
- **Delete expenses** individually
- **Filter expenses** by:
  - Date range
  - Category
  - Merchant
- **Search functionality** across all expense fields
- **Sort expenses** by date, amount, or merchant

### 4. Data Display
- Summary dashboard showing:
  - Total expenses (current month, all time)
  - Spending by category (breakdown/chart)
  - Recent transactions
- Detailed view for each expense including:
  - Original receipt image (stored as base64 or blob URL)
  - All extracted fields
  - Timestamp of when it was added

### 5. Local Data Persistence
- Store all expense data in browser localStorage
- Include:
  - Extracted expense data
  - Original receipt image (base64 encoded)
  - Metadata (upload timestamp, edit history)
- **Export data** functionality (JSON or CSV download)
- **Import data** functionality (restore from JSON)
- **Clear all data** option with confirmation

---

## User Flows

### Primary Flow: Adding an Expense
1. User lands on home page
2. User drags receipt image onto drop zone OR clicks to browse
3. Image preview appears
4. User clicks "Extract Data" button
5. Loading indicator shows while API processes image
6. Extracted data appears in a form (merchant, amount, date, category)
7. User reviews and edits data if needed
8. User clicks "Save Expense"
9. Expense is added to list and stored in localStorage
10. Success message appears, form resets for next upload

### Secondary Flow: Managing Expenses
1. User views expense list on main dashboard
2. User can:
   - Click on expense to see details and original receipt
   - Edit expense fields inline or in modal
   - Delete expense with confirmation
   - Filter/search expenses
   - Export data for backup

### Error Handling Flow
1. If API fails (network error, API error, invalid image):
   - Show clear error message
   - Allow user to retry or manually enter data
   - Don't lose the uploaded image

---

## API Endpoints

### Backend (Express)

#### POST `/api/extract`
- **Purpose**: Extract expense data from receipt image
- **Request**: 
  - Multipart form data with image file
  - Content-Type: `multipart/form-data`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "merchant": "Starbucks",
      "amount": 15.50,
      "currency": "USD",
      "date": "2025-10-03",
      "category": "Food & Dining",
      "items": [
        {"name": "Latte", "price": 5.50},
        {"name": "Sandwich", "price": 10.00}
      ],
      "raw_text": "Original OCR text..."
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "success": false,
    "error": "Failed to extract data from image",
    "details": "..."
  }
  ```

#### GET `/api/health`
- **Purpose**: Check if backend is running
- **Response**: `{ "status": "ok" }`

---

## Data Models

### Expense Object (Frontend)
```javascript
{
  id: "unique-uuid",
  merchant: "Starbucks",
  amount: 15.50,
  currency: "USD",
  date: "2025-10-03",
  category: "Food & Dining",
  items: [
    {name: "Latte", price: 5.50},
    {name: "Sandwich", price: 10.00}
  ],
  imageData: "data:image/jpeg;base64,...", // base64 encoded
  createdAt: "2025-10-03T14:30:00Z",
  updatedAt: "2025-10-03T14:30:00Z",
  notes: "" // User-added notes
}
```

### localStorage Structure
```javascript
{
  "expenses": [/* array of Expense objects */],
  "settings": {
    "defaultCurrency": "USD",
    "categories": ["Food & Dining", "Transport", "Shopping", "Entertainment", "Bills", "Other"]
  }
}
```

---

## OpenAI Vision API Integration

### Prompt Strategy
Send receipt image with a structured prompt like:
```
Analyze this receipt image and extract the following information in JSON format:
- merchant: name of the store/vendor
- amount: total amount paid (number only)
- currency: currency code (USD, EUR, etc.)
- date: transaction date in YYYY-MM-DD format
- category: expense category (Food & Dining, Transport, Shopping, Entertainment, Bills, or Other)
- items: array of line items with name and price (if visible)

Return only valid JSON. If any field is unclear, use null.
```

### API Configuration
- Model: `gpt-4-vision-preview` or latest vision model
- Max tokens: 500-1000
- Temperature: 0.2 (for more consistent extraction)
- Response format: JSON mode if available

---

## UI/UX Requirements

### Components Needed

1. **UploadZone**
   - Drag-and-drop area
   - Click to browse button
   - File type validation
   - Image preview

2. **ExtractedDataForm**
   - Editable fields for all expense data
   - Category dropdown
   - Date picker
   - Currency selector
   - Save/Cancel buttons

3. **ExpenseList**
   - Table or card view of expenses
   - Sort and filter controls
   - Action buttons (view, edit, delete)
   - Empty state message

4. **ExpenseDetail**
   - Modal or side panel
   - Display receipt image
   - Show all extracted fields
   - Edit mode

5. **Dashboard**
   - Summary statistics
   - Category breakdown (pie/bar chart optional)
   - Recent expenses
   - Quick actions (upload, export)

6. **FilterBar**
   - Date range picker
   - Category filter
   - Search input
   - Clear filters button

### Design Principles
- Clean, minimal interface
- Mobile-responsive design
- Clear visual hierarchy
- Instant feedback on actions
- Accessible (ARIA labels, keyboard navigation)
- Loading states and error messages

---

## Non-Functional Requirements

### Performance
- Receipt processing should complete within 5-10 seconds
- UI should remain responsive during API calls
- localStorage should handle at least 100 expenses with images

### Security
- Validate file types and sizes on both client and server
- Sanitize user inputs
- Secure OpenAI API key (environment variable, not exposed to frontend)
- CORS properly configured

### Error Handling
- Network failures
- API rate limits
- Invalid images
- localStorage quota exceeded
- Malformed API responses

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Deployment Considerations

### Environment Variables
```
OPENAI_API_KEY=sk-...
PORT=3000
NODE_ENV=production
```

### Railway Configuration
- Single service deployment
- Serve React build folder from Express
- Health check endpoint
- Auto-deploy from Git repository

### Build Process
1. Build React frontend (npm run build)
2. Copy build to backend public folder
3. Start Express server
4. Express serves frontend and handles API routes

---

## Out of Scope (For Initial Version)

- User authentication/login
- Multi-user support
- Database persistence
- Receipt editing/annotation tools
- Automatic categorization rules
- Budget tracking/alerts
- Email receipt forwarding
- Mobile app
- Receipt splitting
- Tax calculation
- Integration with accounting software
- Receipt templates
- Bulk upload

---

## Success Criteria

1. ✅ User can upload a receipt image via drag-and-drop
2. ✅ OpenAI API successfully extracts merchant, amount, and date with >80% accuracy
3. ✅ Extracted data can be edited before saving
4. ✅ All expenses persist in localStorage across browser sessions
5. ✅ User can view, edit, and delete expenses
6. ✅ User can filter expenses by date and category
7. ✅ Application is fully functional when deployed on Railway
8. ✅ Basic error handling works for common failure scenarios
9. ✅ UI is responsive and works on desktop and tablet screens

---

## Future Enhancements (Post-MVP)

- Real database (PostgreSQL/MongoDB)
- User accounts and authentication
- Cloud storage for receipt images
- Advanced analytics and insights
- Budget setting and tracking
- Recurring expense detection
- Multi-currency support with conversion
- Receipt sharing/export to PDF
- Dark mode
- PWA support for offline access
- Automated backup to cloud storage

---

## Development Timeline Estimate

- **Phase 1**: Backend Setup (Express + OpenAI integration) - 1-2 days
- **Phase 2**: Frontend Core (React, upload, display) - 2-3 days
- **Phase 3**: Expense Management (CRUD, filters) - 1-2 days
- **Phase 4**: Testing & Refinement - 1 day
- **Phase 5**: Deployment to Railway - 0.5 day

**Total**: 5-8 days for a functional MVP

---

## Dependencies & Tools

### Backend Dependencies
- express
- multer (file upload)
- cors
- dotenv
- openai (official SDK)

### Frontend Dependencies
- react
- react-dom
- axios (API calls)
- date-fns (date formatting)
- uuid (unique IDs)

### Development Tools
- nodemon (backend dev server)
- vite or create-react-app (React setup)
- ESLint + Prettier (code quality)

---

## Notes

- localStorage has a ~5-10MB limit; with base64 images, this equals roughly 50-100 receipts
- Consider image compression before storing in localStorage
- OpenAI Vision API costs: ~$0.01-0.03 per image depending on size/quality
- Railway free tier should be sufficient for personal use/testing
- Consider adding a warning when localStorage is nearly full



