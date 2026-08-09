// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    related: {
      type: String, // e.g., "Phone EMI", "Room Rent", "Seema sister"
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Overdue'],
      default: 'Pending',
    },
    paidDate: {
      type: Date,
    },
    notes: {
      type: String,
    }
  },
  { timestamps: true }
);

// Virtual or Helper to derive status dynamically based on current date
expenseSchema.methods.updateCalculatedStatus = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(this.dueDate);
  due.setHours(0, 0, 0, 0);

  if (this.status !== 'Completed') {
    if (due < today) {
      this.status = 'Overdue';
    } else {
      this.status = 'Pending';
    }
  }
};

const Expenses = mongoose.model('Expense', expenseSchema);
export default Expenses;