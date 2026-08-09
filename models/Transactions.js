import mongoose from "mongoose";

// 1. Transaction Sub-Schema (Tracks partial payments & additional borrowings)
const transactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['borrowed', 'paid'],
      required: true
    }, // 'borrowed' = added to debt, 'paid' = repaid
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String, trim: true }, // e.g., "Paid back via UPI", "Borrowed extra for groceries"
  },
  { _id: true }
);

const transactionsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanNew',
      required: true
    },
    loanTitle: {
      type: String,
      required: true
    },
    loanType: {
      type: String,
      enum: ['loan', 'debt'],
      default: 'loan'
    },
    // History Tracking (Used heavily for personal_debt & lump-sum payments)
    transactions: [transactionSchema],
  },
  { timestamps: true }
)

const Transactions = mongoose.model('Transactions', transactionsSchema);
export default Transactions;