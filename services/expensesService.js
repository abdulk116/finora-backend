import Expenses from "../models/Expenses.js";

export const getExpenseses = async (userId) => {
  const expeneseData = await Expenses.find({ userId }).sort({ dueDate: 1 });
  return expeneseData;
}

export const createExpensesService = async (userId, expensesData) => {
  const {
    dueDate,
    related,
    amount,
    status,
    paidDate,
    notes
  } = expensesData

  const newExpenses = new Expenses({
    userId,
    dueDate,
    related,
    amount,
    status,
    paidDate,
    notes
  })

  return await newExpenses.save();
}

export const updateExpenseStatusService = async (userId, expeneseData) => {
  const { expenseId, status, notes } = expeneseData;

  const updatedData = await Expenses.findOne({ _id: expenseId, userId });
  updatedData.status = status;

  if (status === "Completed") {
    updatedData.paidDate = new Date();
  }

  return await updatedData.save();
}