import { useEffect } from 'react';
import './ExpenseModal.css';

function ExpenseModal({ expense, onClose, onDelete }) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Expense Details</h2>
          <button onClick={onClose} className="btn-close">
            ✖
          </button>
        </div>

        <div className="modal-body">
          <div className="receipt-image-container">
            <img 
              src={expense.imageData} 
              alt={`Receipt from ${expense.merchant}`}
              className="receipt-image"
            />
          </div>

          <div className="expense-details">
            <div className="detail-row">
              <span className="detail-label">🏪 Merchant:</span>
              <span className="detail-value">{expense.merchant}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">💵 Amount:</span>
              <span className="detail-value">
                ${expense.amount.toFixed(2)} {expense.currency}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">📅 Date:</span>
              <span className="detail-value">
                {new Date(expense.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">🕒 Added:</span>
              <span className="detail-value">
                {new Date(expense.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onDelete} className="btn-delete-modal">
            🗑 Delete Expense
          </button>
          <button onClick={onClose} className="btn-close-modal">
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseModal;




