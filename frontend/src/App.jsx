import { useState, useEffect } from 'react';
import UploadZone from './components/UploadZone';
import ExpenseList from './components/ExpenseList';
import LoadingSpinner from './components/LoadingSpinner';
import { saveExpenses, loadExpenses } from './utils/localStorage';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loaded = loadExpenses();
    setExpenses(loaded);
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (expenses.length > 0 || expenses.length === 0) {
      saveExpenses(expenses);
    }
  }, [expenses]);

  const handleFileSelected = async (file, imageDataUrl) => {
    setError(null);
    setExtractedData(null);
    setCurrentImage(imageDataUrl);
    setUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('receipt', file);

      // Call backend API (works in dev and production)
      const API_URL = import.meta.env.DEV 
        ? 'http://localhost:3000/api/extract'
        : '/api/extract';
      
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to extract data');
      }

      // Set extracted data for user review
      setExtractedData(result.data);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to process receipt. Please try again.');
      setCurrentImage(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveExpense = () => {
    if (!extractedData || !currentImage) return;

    const newExpense = {
      id: crypto.randomUUID(),
      merchant: extractedData.merchant,
      amount: extractedData.amount,
      currency: extractedData.currency,
      date: extractedData.date,
      imageData: currentImage,
      timestamp: new Date().toISOString()
    };

    setExpenses([newExpense, ...expenses]);
    
    // Reset state
    setExtractedData(null);
    setCurrentImage(null);
    setError(null);
  };

  const handleCancelExtraction = () => {
    setExtractedData(null);
    setCurrentImage(null);
    setError(null);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const handleRetry = () => {
    setError(null);
    setCurrentImage(null);
    setExtractedData(null);
  };

  // Calculate total
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Expense Tracker</h1>
        {expenses.length > 0 && (
          <div className="total-amount">
            Total: ${totalAmount.toFixed(2)}
          </div>
        )}
      </header>

      <main className="app-main">
        {uploading && (
          <div className="upload-status">
            <LoadingSpinner />
            <p>Extracting expense data...</p>
            <p className="subtext">This usually takes 5-10 seconds</p>
          </div>
        )}

        {error && !uploading && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={handleRetry} className="btn-retry">
              🔄 Try Again
            </button>
          </div>
        )}

        {extractedData && !uploading && (
          <div className="extracted-data">
            <h2>✨ Extracted!</h2>
            <div className="data-card">
              <div className="data-row">
                <span className="data-label">🏪 Merchant:</span>
                <span className="data-value">{extractedData.merchant}</span>
              </div>
              <div className="data-row">
                <span className="data-label">💵 Amount:</span>
                <span className="data-value">
                  ${extractedData.amount.toFixed(2)} {extractedData.currency}
                </span>
              </div>
              <div className="data-row">
                <span className="data-label">📅 Date:</span>
                <span className="data-value">
                  {new Date(extractedData.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <div className="action-buttons">
              <button onClick={handleCancelExtraction} className="btn-cancel">
                ✖ Cancel
              </button>
              <button onClick={handleSaveExpense} className="btn-save">
                ✅ Save
              </button>
            </div>
          </div>
        )}

        {!uploading && !extractedData && !error && (
          <UploadZone onFileSelected={handleFileSelected} />
        )}

        <ExpenseList 
          expenses={expenses} 
          onDeleteExpense={handleDeleteExpense}
        />
      </main>
    </div>
  );
}

export default App;

