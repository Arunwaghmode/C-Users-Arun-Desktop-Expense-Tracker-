const STORAGE_KEY = 'expense-tracker-data';

/**
 * Save expenses to localStorage
 * @param {Array} expenses - Array of expense objects
 */
export function saveExpenses(expenses) {
  try {
    const data = JSON.stringify(expenses);
    localStorage.setItem(STORAGE_KEY, data);
    console.log(`Saved ${expenses.length} expenses to localStorage`);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      alert('Storage limit reached! Please delete some old expenses to free up space.');
    }
  }
}

/**
 * Load expenses from localStorage
 * @returns {Array} Array of expense objects
 */
export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    const expenses = JSON.parse(data);
    console.log(`Loaded ${expenses.length} expenses from localStorage`);
    return expenses;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
}

/**
 * Clear all expenses from localStorage
 */
export function clearExpenses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared all expenses from localStorage');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Get storage usage statistics
 * @returns {Object} Storage stats
 */
export function getStorageStats() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const sizeInBytes = new Blob([data || '']).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    
    return {
      sizeInBytes,
      sizeInKB,
      sizeInMB,
      expenseCount: data ? JSON.parse(data).length : 0
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
}




