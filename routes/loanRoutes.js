import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
import { addTransactions, createLoan, getLoanById, getLoans, getTransactionByLoanId, markEmiPaid } from '../controllers/loanController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createLoan)
  .get(getLoans)

router.route('/:id')
  .get(getLoanById);

router.route('/:id/transactions')
  .post(addTransactions)
  .get(getTransactionByLoanId)

router.route('/:loanId/emi/:installmentNo/pay')
  .patch(markEmiPaid)

export default router;