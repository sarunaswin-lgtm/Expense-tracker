import express from 'express';
import { getRecurringBills, addRecurringBill, toggleRecurringBill, deleteRecurringBill } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await getRecurringBills();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, amount, category, due_day_of_month, is_active } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Bill title is required (e.g. Rent, Netflix).' });
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive amount is required.' });
    }

    const created = await addRecurringBill({
      title: title.trim(),
      amount: Number(amount),
      category: category || 'Bills',
      due_day_of_month: Number(due_day_of_month) || 1,
      is_active: is_active !== undefined ? Boolean(is_active) : true
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const updated = await toggleRecurringBill(id, Boolean(is_active));
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRecurringBill(id);
    res.json({ success: true, message: 'Recurring bill deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
