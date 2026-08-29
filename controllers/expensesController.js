import { createExpensesService, deleteExpenseService, getExpenseses, updateExpensesService, updateExpenseStatusService } from "../services/expensesService.js";

export const getExpensesByUserId = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const expenses = await getExpenseses(req.user.id, startDate, endDate);
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExpenses = async (req, res) => {
  try {
    const expenses = await createExpensesService(req.user.id, req.body);
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExpenseStatus = async (req, res) => {
  try {
    const expenses = await updateExpenseStatusService(req.user.id, req.body);
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expenses = await deleteExpenseService(req.user.id, req.body.expenseId);
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expenses = await updateExpensesService(req.user.id, req.body);
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};