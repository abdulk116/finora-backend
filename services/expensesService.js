import Expenses from "../models/Expenses.js";

const parseDateUTC = (dateString) => {
  const [day, month, year] = dateString.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
};

export const getExpenseses = async (userId, startDate, endDate) => {
  const start = parseDateUTC(startDate);
  const end = parseDateUTC(endDate);

  end.setUTCDate(end.getUTCDate() + 1);

  const expenseData = await Expenses.find({
    userId,
    dueDate: {
      $gte: start,
      $lt: end,
    },
  }).sort({ dueDate: 1 });

  return expenseData;
};

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

export const deleteExpenseService = async (userId, expenseId) => {
  const deletedExpense = await Expenses.findOneAndDelete({
    _id: expenseId,
    userId,
  });

  if (!deletedExpense) {
    throw new Error("Expense not found");
  }

  return deletedExpense;
};

export const updateExpensesService = async (userId, expensesData) => {
  const {
    expenseId,
    dueDate,
    related,
    amount,
    status,
    paidDate,
    notes,
  } = expensesData;

  const updatedExpense = await Expenses.findOneAndUpdate(
    {
      _id: expenseId,
      userId,
    },
    {
      dueDate,
      related,
      amount,
      status,
      paidDate,
      notes,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedExpense) {
    throw new Error("Expense not found");
  }

  return updatedExpense;
};