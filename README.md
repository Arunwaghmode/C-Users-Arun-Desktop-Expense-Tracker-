# 💰 Expense Tracker

An AI-powered expense tracker that automatically extracts data from receipt images using OpenAI's Vision API. Upload receipts, get structured expense data instantly, and manage your expenses—all stored locally in your browser.

## ✨ Features

- 📸 **Drag & Drop Upload** - Easy receipt image upload
- 🤖 **AI Extraction** - Automatically extracts merchant, amount, and date using OpenAI GPT-4 Vision
- 💾 **Local Storage** - All data stored in browser localStorage (no database needed)
- 📊 **Expense Management** - View, search, and delete expenses
- 🎨 **Clean UI** - Modern, responsive design
- ⚡ **Fast** - Data extraction in 5-10 seconds

## 🚀 Tech Stack

### Backend
- Node.js + Express
- OpenAI Vision API (GPT-4o)
- Multer (file upload)

### Frontend
- React 18
- Vite
- CSS3 (no framework)
- localStorage API

## 📋 Prerequisites

- Node.js 16+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
cd "Expense Tracker"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3000
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Start the frontend dev server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Open in Browser

Navigate to `http://localhost:5173` and start uploading receipts! 🎉

## 📱 Usage

1. **Upload Receipt**
   - Drag and drop a receipt image, or click to browse
   - Supported formats: JPG, PNG, WebP (max 5MB)

2. **Review Extracted Data**
   - Wait 5-10 seconds for AI extraction
   - Review merchant name, amount, and date
   - Edit if needed (coming soon)

3. **Save Expense**
   - Click "Save" to add to your expense list
   - Data persists in browser localStorage

4. **Manage Expenses**
   - View all expenses in the list
   - Click "View Receipt" to see original image
   - Delete expenses you no longer need

## 🎯 API Endpoints

### `GET /api/health`
Health check endpoint
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T12:00:00.000Z"
}
```

### `POST /api/extract`
Extract expense data from receipt image

**Request:** `multipart/form-data` with `receipt` file

**Response:**
```json
{
  "success": true,
  "data": {
    "merchant": "Starbucks",
    "amount": 15.50,
    "currency": "USD",
    "date": "2025-10-03"
  }
}
```

## 🏗️ Project Structure

```
expense-tracker/
├── backend/
│   ├── server.js           # Express server + OpenAI integration
│   ├── package.json
│   └── env.example.txt     # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── App.css
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── UploadZone.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExpenseModal.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   └── utils/
│   │       └── localStorage.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── design.md              # UI/UX design specification
├── mvp.md                # MVP scope and features
├── scope.md              # Full project scope
└── README.md
```

## 🚢 Deployment (Railway)

### Build Command:
```bash
cd backend && npm install && cd ../frontend && npm install && npm run build
```

### Start Command:
```bash
cd backend && npm start
```

### Environment Variables:
- `OPENAI_API_KEY` - Your OpenAI API key
- `PORT` - Port number (Railway provides this)
- `NODE_ENV` - Set to `production`

## 💡 Tips

- **Better Results**: Use clear, well-lit receipt images
- **Storage**: localStorage has ~5-10MB limit (roughly 50-100 receipts with images)
- **API Costs**: Each extraction costs ~$0.01-0.03 via OpenAI
- **Privacy**: All data stays in your browser—nothing is stored on servers

## 🔧 Troubleshooting

### "API key not configured" error
- Make sure you've created a `.env` file in the `backend` directory
- Add your OpenAI API key: `OPENAI_API_KEY=sk-...`
- Restart the backend server

### Receipt extraction fails
- Ensure image is clear and text is readable
- Try a different image format
- Check backend logs for detailed error messages

### localStorage quota exceeded
- Delete old expenses to free up space
- Each receipt image (base64) takes ~50-200KB

## 🎨 Design Philosophy

- **Simple & Fast**: Core action (upload → extract → save) takes 2 clicks
- **User-Friendly**: Clear visual feedback at every step
- **Professional**: Clean design that builds trust for financial data
- **Accessible**: Keyboard navigation, screen reader support

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

- OpenAI for the amazing GPT-4 Vision API
- React team for the excellent framework
- Everyone who contributed to the design and testing

---

**Made with ❤️ for easier expense tracking**




