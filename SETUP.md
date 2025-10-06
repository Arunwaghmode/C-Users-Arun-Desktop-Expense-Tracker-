# 🚀 Quick Setup Guide

Follow these steps to get the Expense Tracker running on your local machine.

## Prerequisites

✅ Node.js 16 or higher ([Download](https://nodejs.org/))  
✅ npm (comes with Node.js)  
✅ OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation Steps

### 1️⃣ Install Dependencies

From the root directory, run:

```bash
npm run install:all
```

Or manually:
```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2️⃣ Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
```

Create `.env` with this content:
```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
PORT=3000
NODE_ENV=development
```

**⚠️ Important**: Replace `sk-your-actual-openai-api-key-here` with your real OpenAI API key!

### 3️⃣ Start the Backend Server

In the `backend` directory:

```bash
npm run dev
```

You should see:
```
🚀 Expense Tracker server running on port 3000
📍 API endpoint: http://localhost:3000/api/extract
💡 Health check: http://localhost:3000/api/health
✅ OpenAI API key configured
```

### 4️⃣ Start the Frontend Server

Open a **new terminal** and from the root directory:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5️⃣ Open in Browser

Navigate to: **http://localhost:5173**

🎉 You should see the Expense Tracker interface!

## Testing the App

1. **Upload a receipt image** (drag & drop or click to browse)
2. **Click "Extract Data"** button
3. Wait 5-10 seconds for AI processing
4. **Review** the extracted merchant, amount, and date
5. **Click "Save"** to add to your expense list

## Troubleshooting

### ❌ "OPENAI_API_KEY not set" warning

**Solution**: 
- Make sure `.env` file exists in `backend` directory
- Check that `OPENAI_API_KEY=sk-...` is set correctly
- Restart the backend server

### ❌ "Failed to extract data" error

**Possible causes**:
- Invalid API key
- Poor quality receipt image
- Network connection issues
- API rate limits

**Solution**:
- Check backend logs for detailed error
- Try a clearer receipt image
- Verify your OpenAI API key is active
- Check your OpenAI account has credits

### ❌ Frontend can't connect to backend

**Solution**:
- Ensure backend is running on port 3000
- Check that frontend proxy is configured correctly
- Look for CORS errors in browser console

### ❌ localStorage quota exceeded

**Solution**:
- Delete some old expenses from the list
- Each receipt image takes 50-200KB in storage
- Browser localStorage limit is typically 5-10MB

## Development Tips

### Backend (Express + OpenAI)
- Located in `backend/server.js`
- Uses `nodemon` for auto-restart on changes
- Logs appear in terminal
- Test API directly: `curl http://localhost:3000/api/health`

### Frontend (React + Vite)
- Located in `frontend/src/`
- Hot reload enabled (changes appear instantly)
- React DevTools recommended for debugging
- Check browser console for errors

## File Structure

```
expense-tracker/
├── backend/
│   ├── server.js              # Main Express server
│   ├── package.json
│   ├── .env                   # Your environment variables (create this!)
│   └── env.example.txt        # Template
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── components/       # UI components
│   │   └── utils/            # Helper functions
│   ├── package.json
│   └── vite.config.js
│
└── package.json              # Root package (scripts)
```

## What's Next?

- Upload your first receipt! 📸
- Try different receipt types (restaurant, gas station, retail)
- Check localStorage persistence (refresh the page)
- View receipt images in the modal
- Delete expenses you don't need

## Need Help?

- Check `README.md` for detailed documentation
- Review `mvp.md` for feature scope
- Check `design.md` for UI specifications
- Look at browser console for frontend errors
- Check terminal for backend errors

---

**Happy expense tracking! 💰**




