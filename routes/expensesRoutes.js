import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
import { createExpenses, deleteExpense, getExpensesByUserId, updateExpense, updateExpenseStatus } from '../controllers/expensesController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getExpensesByUserId)
  .post(createExpenses)

router.route('/status')
  .post(updateExpenseStatus)

router.route('/delete')
  .post(deleteExpense)

router.route('/update')
  .post(updateExpense)


export default router;