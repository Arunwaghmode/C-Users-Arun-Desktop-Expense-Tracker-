import { useState } from 'react';
import ExpenseModal from './ExpenseModal';
import './ExpenseList.css';

function ExpenseList({ expenses, onDeleteExpense }) {
  const [selectedExpense, setSelectedExpense] = useState(null);

  if (expenses.length === 0) {
    return (
      <div className="expense-list empty">
        <div className="empty-state">
          <div className="empty-icon">🧾</div>
          <h3>No expenses yet!</h3>
          <p>Upload your first receipt above</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="expense-list">
        <h2>Recent Expenses ({expenses.length})</h2>
        <div className="expense-cards">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-card">
              <div className="expense-header">
                <div className="expense-merchant">
                  <span className="merchant-icon">🏪</span>
                  <span className="merchant-name">{expense.merchant}</span>
                </div>
                <div className="expense-amount">
                  ${expense.amount.toFixed(2)} {expense.currency}
                </div>
              </div>
              
              <div className="expense-date">
                <span className="date-icon">📅</span>
                {new Date(expense.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="expense-actions">
                <button 
                  onClick={() => setSelectedExpense(expense)}
                  className="btn-view"
                >
                  👁 View Receipt
                </button>
                <button 
                  onClick={() => onDeleteExpense(expense.id)}
                  className="btn-delete"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedExpense && (
        <ExpenseModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onDelete={() => {
            onDeleteExpense(selectedExpense.id);
            setSelectedExpense(null);
          }}
        />
      )}
    </>
  );
}

export default ExpenseList;




