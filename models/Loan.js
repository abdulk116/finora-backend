import mongoose from "mongoose";

// 2. Scheduled EMI Sub-Schema (For Bank/EMI/App Loans)
const emiScheduleSchema = new mongoose.Schema({
  dueDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  installmentNo: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending'
  },
  paidDate: { type: Date },
});

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    loanDetails: { type: String, required: true },
    lenderName: { type: String, required: true },
    loanType: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    remainingAmount: { type: Number },
    emiAmount: { type: Number, default: 0 },
    emiSchedule: [emiScheduleSchema], // Pre-generated list of expected EMIs
    tenureMonths: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    startDate: { type: Date, default: Date.now },
    paymentType: { type: String },
    interestAmount: { type: Number, default: 0 },
    totalPaidAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
)

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;