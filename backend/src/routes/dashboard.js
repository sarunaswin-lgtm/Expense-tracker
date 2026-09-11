import express from 'express';
import { getProfile, getTransactions, getRecurringBills, updateProfile } from '../db.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const profile = await getProfile();
    const transactions = await getTransactions();
    const recurringBills = await getRecurringBills();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Days calculation
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const currentDay = now.getDate();
    const daysLeftInMonth = Math.max(1, totalDaysInMonth - currentDay);
    const daysPassed = Math.max(1, currentDay);

    const salary = Number(profile?.monthly_salary) || 50000;
    const currency = profile?.currency || 'INR';

    // Current month transactions
    const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthlyTxs = transactions.filter(t => t.date && t.date.startsWith(currentMonthPrefix));

    // Calculate totals
    let totalExpenses = 0;
    let extraIncome = 0;
    let wasteExpenses = 0;
    let wasteCount = 0;
    const categoryTotals = {};
    const dailySpendMap = {};

    // Initialize all days of current month for chart
    for (let d = 1; d <= currentDay; d++) {
      const dayKey = `${currentMonthPrefix}-${String(d).padStart(2, '0')}`;
      dailySpendMap[dayKey] = { date: dayKey, day: d, total: 0, waste: 0, essential: 0 };
    }

    monthlyTxs.forEach(tx => {
      const amt = Number(tx.amount);
      if (tx.type === 'expense') {
        totalExpenses += amt;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;

        if (tx.is_waste) {
          wasteExpenses += amt;
          wasteCount++;
        }

        if (dailySpendMap[tx.date]) {
          dailySpendMap[tx.date].total += amt;
          if (tx.is_waste) {
            dailySpendMap[tx.date].waste += amt;
          } else {
            dailySpendMap[tx.date].essential += amt;
          }
        }
      } else if (tx.type === 'income') {
        // Additional income outside base monthly salary
        if (tx.category && tx.category.toLowerCase() !== 'salary') {
          extraIncome += amt;
        }
      }
    });

    // Active fixed recurring expenses
    const activeRecurring = recurringBills.filter(b => b.is_active);
    const totalFixedCosts = activeRecurring.reduce((sum, b) => sum + Number(b.amount), 0);

    // Effective income is user's monthly salary + any extra logged income
    const effectiveIncome = salary + extraIncome;
    const remainingBalance = effectiveIncome - totalExpenses;
    const wastePercentage = totalExpenses > 0 ? (wasteExpenses / totalExpenses) * 100 : 0;
    const burnRatePerDay = Math.round(totalExpenses / daysPassed);
    const safeDailyAllowance = Math.max(0, Math.round(remainingBalance / daysLeftInMonth));
    const projectedTotalExpense = Math.round(totalExpenses + (burnRatePerDay * daysLeftInMonth));
    const projectedMonthEndBalance = Math.round(effectiveIncome - projectedTotalExpense);

    // Sorted categories
    const categoryList = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Daily chart data
    const dailyTrend = Object.values(dailySpendMap).sort((a, b) => a.day - b.day);

    // Top recent waste transactions
    const recentWasteTxs = monthlyTxs.filter(t => t.is_waste).slice(0, 5);

    res.json({
      success: true,
      data: {
        profile,
        currency,
        metrics: {
          salary,
          effectiveIncome,
          totalExpenses,
          totalFixedCosts,
          wasteExpenses,
          wasteCount,
          wastePercentage,
          remainingBalance,
          burnRatePerDay,
          safeDailyAllowance,
          projectedMonthEndBalance,
          daysPassed,
          daysLeftInMonth,
          totalDaysInMonth,
          savingsRatePercent: Math.max(0, Math.round(((effectiveIncome - totalExpenses) / effectiveIncome) * 100))
        },
        recurringBills,
        categoryBreakdown: categoryList,
        dailyTrend,
        recentWasteTxs
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update user profile/salary
router.patch('/profile', async (req, res) => {
  try {
    const updated = await updateProfile(req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
