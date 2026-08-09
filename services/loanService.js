import Loan from '../models/Loan.js'
import Transactions from '../models/Transactions.js';

export const createLoanService = async (userId, loanData) => {
  const {
    loanDetails,
    lenderName,
    loanType,
    totalAmount,
    startDate,
    emiAmount = 0,
    tenureMonths = 0,
    paymentType = '',
    interestAmount = 0,
    emiSchedule
  } = loanData;

  // ---------------------------------
  // Validation
  // ---------------------------------
  if (!userId) {
    throw new Error('User ID is required.');
  }

  if (!loanDetails?.trim()) {
    throw new Error('Loan details are required.');
  }

  if (!lenderName?.trim()) {
    throw new Error('Lender name is required.');
  }

  if (!loanType) {
    throw new Error('Loan type is required.');
  }

  const amount = Number(totalAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Total amount must be greater than 0.');
  }

  // ---------------------------------
  // Normalize values
  // ---------------------------------
  const loanStartDate = startDate
    ? new Date(startDate)
    : new Date();

  if (Number.isNaN(loanStartDate.getTime())) {
    throw new Error('Invalid start date.');
  }

  const normalizedEmiAmount = Number(emiAmount) || 0;
  const normalizedTenureMonths = Number(tenureMonths) || 0;
  const normalizedInterestAmount = Number(interestAmount) || 0;

  // ---------------------------------
  // Create Loan
  // ---------------------------------
  const newLoan = new Loan({
    userId,
    loanDetails: loanDetails.trim(),
    lenderName: lenderName.trim(),
    loanType,
    totalAmount: amount,
    remainingAmount: amount,

    emiAmount: normalizedEmiAmount,
    tenureMonths: normalizedTenureMonths,
    emiSchedule,

    startDate: loanStartDate,

    paymentType,
    interestAmount: normalizedInterestAmount,
  });

  const savedLoan = await newLoan.save();

  // ---------------------------------
  // Create Initial Transaction
  // ---------------------------------
  const initialTransaction = new Transactions({
    userId,
    loanId: savedLoan._id,
    loanTitle: savedLoan.loanDetails,
    loanType: savedLoan.loanType,

    transactions: [
      {
        title: 'Initial loan creation',
        type: 'borrowed',
        amount,
        date: loanStartDate,
        notes: 'Initial loan creation',
      },
    ],
  });

  await initialTransaction.save();

  // ---------------------------------
  // Return Created Loan
  // ---------------------------------
  return savedLoan;
};

export const getLoansByUserService = async (userId, filterCategory) => {
  const query = { userId: userId };
  if (filterCategory) {
    query.category = filterCategory;
  }
  return await Loan.find(query).sort({ createdAt: -1 });
};

export const getLoanByIdService = async (loanId, userId) => {
  const loan = await Loan.findOne({ _id: loanId, userId: userId });
  if (!loan) {
    throw new Error('Loan record not found');
  }
  return loan;
};

export const getTransactionsByloanIdService = async (userId, loanId) => {
  const transactions = await Transactions.findOne({ userId, loanId })
  if (!transactions) {
    throw new Error('Transaction record not found');
  }
  return transactions;
}

export const addTransactionService = async (
  userId,
  loanId,
  {
    title,
    type,
    amount,
    notes = '',
    date,
    amountType = '',
  }
) => {
  const loan = await Loan.findOne({
    _id: loanId,
    userId,
  });

  if (!loan) {
    throw new Error('Loan record not found.');
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Transaction amount must be greater than 0.');
  }

  const transactionDate = date ? new Date(date) : new Date();

  if (Number.isNaN(transactionDate.getTime())) {
    throw new Error('Invalid transaction date.');
  }

  // Current loan values
  const currentRemaining = Number(loan.remainingAmount) || 0;
  const currentTotal = Number(loan.totalAmount) || 0;
  const currentPaid = Number(loan.totalPaidAmount) || 0;

  let remainingAmount = currentRemaining;
  let totalAmount = currentTotal;
  let totalPaidAmount = currentPaid;

  // --------------------------------
  // PAID
  // --------------------------------

  if (type === 'paid') {
    if (numericAmount > currentRemaining) {
      throw new Error(
        'Payment amount cannot exceed remaining balance.'
      );
    }

    totalPaidAmount += numericAmount;

    // Interest-only loan
    if (
      loan.loanType === 'loan' &&
      loan.paymentType === 'interest'
    ) {
      // Only principal payment reduces remaining balance
      if (amountType === 'principal') {
        remainingAmount -= numericAmount;
      }
    } else {
      // Normal loan / EMI
      remainingAmount -= numericAmount;
    }
  }

  // --------------------------------
  // BORROWED
  // --------------------------------

  if (type === 'borrowed') {
    remainingAmount += numericAmount;
    totalAmount += numericAmount;
  }

  // Prevent floating-point negative values
  if (remainingAmount < 0) {
    remainingAmount = 0;
  }

  // --------------------------------
  // STATUS
  // --------------------------------

  loan.remainingAmount = remainingAmount;
  loan.totalAmount = totalAmount;
  loan.totalPaidAmount = totalPaidAmount;

  loan.status =
    remainingAmount === 0
      ? 'closed'
      : 'active';

  // --------------------------------
  // Save loan
  // --------------------------------

  await loan.save();

  // --------------------------------
  // Find transaction ledger
  // --------------------------------

  const transactionData = await Transactions.findOne({
    userId,
    loanId,
  });

  if (!transactionData) {
    throw new Error(
      'Transaction ledger not found for this loan.'
    );
  }

  // --------------------------------
  // Add transaction
  // --------------------------------

  transactionData.transactions.push({
    title: title?.trim(),
    type,
    amount: numericAmount,
    date: transactionDate,
    notes: notes?.trim() || '',
    amountType,
  });

  await transactionData.save();

  return {
    loan,
    transaction: transactionData,
  };
};

export const markEmiPaidService = async (
  userId,
  loanId,
  installmentNo,
  paymentData
) => {
  const {
    amount,
    paidDate = new Date(),
    notes = 'EMI scheduled payment',
  } = paymentData;

  // ---------------------------------------
  // 1. Validate payment amount
  // ---------------------------------------

  const paidAmount = Number(amount);

  if (!Number.isFinite(paidAmount) || paidAmount <= 0) {
    throw new Error('Invalid payment amount');
  }

  // ---------------------------------------
  // 2. Find loan
  // ---------------------------------------

  const loan = await Loan.findOne({
    _id: loanId,
    userId,
  });

  if (!loan) {
    throw new Error('Loan record not found');
  }

  // ---------------------------------------
  // 3. Validate EMI loan
  // ---------------------------------------

  if (
    loan.loanType !== 'loan' ||
    loan.paymentType !== 'emi'
  ) {
    throw new Error(
      'This loan does not have an EMI schedule'
    );
  }

  if (!Array.isArray(loan.emiSchedule)) {
    throw new Error('EMI schedule not found');
  }

  // ---------------------------------------
  // 4. Find EMI installment
  // ---------------------------------------

  const installmentIndex = loan.emiSchedule.findIndex(
    (emi) =>
      Number(emi.installmentNo) === Number(installmentNo)
  );

  if (installmentIndex === -1) {
    throw new Error('EMI installment not found');
  }

  const emi = loan.emiSchedule[installmentIndex];

  // ---------------------------------------
  // 5. Prevent duplicate payment
  // ---------------------------------------

  if (emi.status === 'paid') {
    throw new Error(
      `EMI installment #${installmentNo} is already paid`
    );
  }

  // ---------------------------------------
  // 6. Validate payment against balance
  // ---------------------------------------

  const remainingAmount = Number(
    loan.remainingAmount || 0
  );

  if (paidAmount > remainingAmount) {
    throw new Error(
      'Payment amount cannot exceed remaining loan balance'
    );
  }

  // ---------------------------------------
  // 7. Validate payment date
  // ---------------------------------------

  const paymentDate = new Date(paidDate);

  if (Number.isNaN(paymentDate.getTime())) {
    throw new Error('Invalid payment date');
  }

  // ---------------------------------------
  // 8. Update EMI
  // ---------------------------------------

  emi.status = 'paid';
  emi.paidAmount = paidAmount;
  emi.paidDate = paymentDate;

  // ---------------------------------------
  // 9. Update loan balance
  // ---------------------------------------

  loan.remainingAmount =
    Number(loan.remainingAmount || 0) - paidAmount;

  loan.totalPaidAmount =
    Number(loan.totalPaidAmount || 0) + paidAmount;

  // Avoid floating point issues
  loan.remainingAmount =
    Math.max(0, Number(loan.remainingAmount.toFixed(2)));

  loan.totalPaidAmount =
    Number(loan.totalPaidAmount.toFixed(2));

  // ---------------------------------------
  // 10. Check whether loan is completely paid
  // ---------------------------------------

  if (loan.remainingAmount === 0) {
    loan.status = 'closed';
  } else {
    loan.status = 'active';
  }

  // ---------------------------------------
  // 11. Save loan
  // ---------------------------------------

  await loan.save();

  // ---------------------------------------
  // 12. Find transaction ledger
  // ---------------------------------------

  const transactionData = await Transactions.findOne({
    userId,
    loanId,
  });

  if (!transactionData) {
    throw new Error(
      'Transaction record not found for this loan'
    );
  }

  // ---------------------------------------
  // 13. Add payment transaction
  // ---------------------------------------

  transactionData.transactions.push({
    title: `EMI Payment #${installmentNo}`,
    type: 'paid',
    amount: paidAmount,
    date: paymentDate,
    notes:
      notes ||
      `EMI installment #${installmentNo} payment`,
  });

  await transactionData.save();

  // ---------------------------------------
  // 14. Return updated data
  // ---------------------------------------

  return {
    loan,
    transaction: transactionData,
  };
};