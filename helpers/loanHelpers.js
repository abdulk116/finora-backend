// services/loanHelpers.js

/**
 * Calculates monthly EMI using standard formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (!annualRate || annualRate === 0) {
    return Math.round(principal / tenureMonths);
  }
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

/**
 * Generates an array of scheduled EMI objects starting from a given date
 */
export const generateEMISchedule = (amount, tenureMonths, startDate, emiAmount) => {
  const schedule = [];
  const start = new Date(startDate || Date.now());

  for (let i = 1; i <= tenureMonths; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      dueDate,
      amount: emiAmount,
      status: 'pending',
    });
  }

  return schedule;
};