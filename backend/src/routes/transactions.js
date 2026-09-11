import express from 'express';
import { getTransactions, addTransaction, deleteTransaction, resetToDemoData } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { is_waste, category } = req.query;
    let filterWaste = null;
    if (is_waste === 'true') filterWaste = true;
    if (is_waste === 'false') filterWaste = false;

    let list = await getTransactions(filterWaste);
    if (category) {
      list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { amount, category, type, is_waste, notes, date } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'A valid positive amount is required.' });
    }

    const newTx = await addTransaction({
      amount: Number(amount),
      category: category || 'Other',
      type: type || 'expense',
      is_waste: Boolean(is_waste),
      notes: notes || '',
      date: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({ success: true, data: newTx });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTransaction(id);
    res.json({ success: true, message: 'Transaction deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/reset-demo', async (req, res) => {
  try {
    const fresh = await resetToDemoData();
    res.json({ success: true, message: 'Database reset to demo seed data.', data: fresh });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
