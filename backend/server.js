const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Configure multer for memory storage (no disk writes)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Receipt extraction endpoint
app.post('/api/extract', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        details: 'Please upload a receipt image'
      });
    }

    console.log(`Processing receipt: ${req.file.originalname} (${req.file.size} bytes)`);

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o for better vision capabilities
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this receipt image and extract the following information. Return ONLY valid JSON with no additional text or markdown formatting:

{
  "merchant": "store or vendor name",
  "amount": 0.00,
  "currency": "USD",
  "date": "YYYY-MM-DD"
}

Instructions:
- merchant: Extract the business/store name (e.g., "Starbucks", "Target", "Shell")
- amount: Extract the TOTAL amount as a number (e.g., 15.50)
- currency: Identify the currency code (USD, EUR, GBP, etc.) - default to USD if unclear
- date: Extract the transaction date in YYYY-MM-DD format
- If any field is completely unclear or not visible, use null
- Be precise with the total amount - look for "Total", "Amount Due", or final sum
- Return ONLY the JSON object, no explanations`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.1 // Low temperature for consistent extraction
    });

    const content = response.choices[0].message.content.trim();
    console.log('OpenAI Response:', content);

    // Parse the JSON response
    let extractedData;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      extractedData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw content:', content);
      throw new Error('Failed to parse extracted data. OpenAI response was not valid JSON.');
    }

    // Validate extracted data
    if (!extractedData.merchant && !extractedData.amount && !extractedData.date) {
      return res.status(400).json({
        success: false,
        error: 'Could not extract expense data from the image',
        details: 'The image may not be a valid receipt or the text is not clear enough. Please try a clearer image.'
      });
    }

    // Format the response
    const result = {
      merchant: extractedData.merchant || 'Unknown Merchant',
      amount: typeof extractedData.amount === 'number' ? extractedData.amount : parseFloat(extractedData.amount) || 0,
      currency: extractedData.currency || 'USD',
      date: extractedData.date || new Date().toISOString().split('T')[0],
      raw_response: content // Include raw response for debugging
    };

    console.log('Extracted data:', result);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error processing receipt:', error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API configuration error',
        details: 'Please check your API key configuration'
      });
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        details: 'Receipt image must be smaller than 5MB'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to extract data from receipt',
      details: error.message || 'An unexpected error occurred. Please try again.'
    });
  }
});

// Serve React frontend for all other routes (for deployment)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Expense Tracker server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/extract`);
  console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set in environment variables!');
  } else {
    console.log('✅ OpenAI API key configured');
  }
});



