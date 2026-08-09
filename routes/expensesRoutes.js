import express from 'express';

import { protect } from '../middleware/authMiddleware.js';
import { createExpenses, getExpensesByUserId, updateExpenseStatus } from '../controllers/expensesController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getExpensesByUserId)
  .post(createExpenses)

router.route('/status')
  .post(updateExpenseStatus)


export default router;