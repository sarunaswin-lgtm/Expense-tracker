import express from 'express';
import { generateRealityCheck, askFinancialCoach } from '../gemini.js';
import { getProfile, getTransactions, getRecurringBills } from '../db.js';

const router = express.Router();

// Generate Reality Check & Roast
router.post('/reality-check', async (req, res) => {
  try {
    const { tone = 'savage' } = req.body;

    const profile = await getProfile();
    const transactions = await getTransactions();
    const recurringBills = await getRecurringBills();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysLeftInMonth = Math.max(1, totalDaysInMonth - currentDay);
    const daysPassed = Math.max(1, currentDay);

    const salary = Number(profile?.monthly_salary) || 50000;
    const currency = profile?.currency || 'INR';

    const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthlyTxs = transactions.filter(t => t.date && t.date.startsWith(currentMonthPrefix));

    let totalSpent = 0;
    let wasteSpent = 0;
    const categoryTotals = {};
    const wasteList = [];

    monthlyTxs.forEach(t => {
      const amt = Number(t.amount);
      if (t.type === 'expense') {
        totalSpent += amt;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amt;
        if (t.is_waste) {
          wasteSpent += amt;
          wasteList.push({
            notes: t.notes || t.category,
            amount: amt,
            date: t.date,
            category: t.category
          });
        }
      }
    });

    const activeRecurring = recurringBills.filter(b => b.is_active);
    const fixedCosts = activeRecurring.reduce((sum, b) => sum + Number(b.amount), 0);

    const remainingBalance = salary - totalSpent;
    const wastePercentage = totalSpent > 0 ? (wasteSpent / totalSpent) * 100 : 0;
    const burnRatePerDay = Math.round(totalSpent / daysPassed);
    const projectedMonthEndBalance = Math.round(salary - (totalSpent + (burnRatePerDay * daysLeftInMonth)));

    const topCategories = Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    const realityCheck = await generateRealityCheck({
      salary,
      totalSpent,
      totalIncome: salary,
      wasteSpent,
      wastePercentage,
      fixedCosts,
      remainingBalance,
      daysLeftInMonth,
      burnRatePerDay,
      projectedMonthEndBalance,
      topCategories,
      wasteTransactions: wasteList,
      currency,
      tone
    });

    res.json({
      success: true,
      data: realityCheck
    });
  } catch (err) {
    console.error('AI Reality check route error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Interactive Financial Coach Chat
router.post('/coach', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question is required.' });
    }

    const profile = await getProfile();
    const transactions = await getTransactions();
    const recurringBills = await getRecurringBills();

    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeftInMonth = Math.max(1, totalDaysInMonth - now.getDate());

    const salary = Number(profile?.monthly_salary) || 50000;
    const currency = profile?.currency || 'INR';

    let totalSpent = 0;
    let wasteSpent = 0;
    transactions.forEach(t => {
      if (t.type === 'expense') {
        totalSpent += Number(t.amount);
        if (t.is_waste) wasteSpent += Number(t.amount);
      }
    });

    const remainingBalance = salary - totalSpent;
    const safeDailySpend = Math.max(0, Math.round(remainingBalance / daysLeftInMonth));

    const response = await askFinancialCoach({
      question: question.trim(),
      financialSummary: {
        salary,
        totalSpent,
        wasteSpent,
        remainingBalance,
        daysLeftInMonth,
        safeDailySpend,
        currency
      }
    });

    res.json({ success: true, data: response });
  } catch (err) {
    console.error('AI Coach chat error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
