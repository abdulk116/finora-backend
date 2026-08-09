import { addTransactionService, createLoanService, getLoanByIdService, getLoansByUserService, getTransactionsByloanIdService, markEmiPaidService } from "../services/loanService.js";

export const createLoan = async (req, res) => {
  try {
    // req.user.id populated by Auth Middleware
    const loan = await createLoanService(req.user.id, req.body);
    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLoans = async (req, res) => {
  try {
    const { category } = req.query;
    const loans = await getLoansByUserService(req.user.id, category);
    res.status(200).json({ success: true, count: loans.length, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const loan = await getLoanByIdService(req.params.id, req.user.id);
    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getTransactionByLoanId = async (req, res) => {
  try {
    const transactions = await getTransactionsByloanIdService(req.user.id, req?.params?.id);
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const addTransactions = async (req, res) => {
  try {
    const transactions = await addTransactionService(req.user.id, req?.params?.id, req?.body);
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const markEmiPaid = async (req, res) => {
  try {
    const { loanId, installmentNo } = req.params;

    const {
      amount,
      paidDate,
      notes,
    } = req.body;

    const userId = req.user.id;

    const result = await markEmiPaidService(
      userId,
      loanId,
      installmentNo,
      {
        amount,
        paidDate,
        notes,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'EMI payment recorded successfully',
      data: result,
    });

  } catch (error) {
    console.error(
      'Mark EMI paid error:',
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};