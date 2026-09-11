import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function RecurringManager({ bills = [], onAddBill, onToggleBill, onDeleteBill, currency = 'INR' }) {
  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const sym = currencySymbols[currency] || '₹';

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Bills');
  const [dueDay, setDueDay] = useState(1);

  const activeBills = bills.filter(b => b.is_active);
  const totalCommitted = activeBills.reduce((acc, b) => acc + Number(b.amount), 0);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    await onAddBill({
      title: title.trim(),
      amount: Number(amount),
      category,
      due_day_of_month: Number(dueDay) || 1
    });

    setTitle('');
    setAmount('');
    setDueDay(1);
    setIsAdding(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <CalendarClock className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-base text-white font-heading">Fixed Monthly Commitments</h3>
            <p className="text-xs text-slate-400">Rent, EMI, SIP, Broadband & Subscriptions</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Total Fixed Commitments</div>
            <div className="text-sm font-bold text-cyan-400">{sym}{totalCommitted.toLocaleString()}/mo</div>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAdding ? 'Cancel' : 'Add Bill'}</span>
          </button>
        </div>
      </div>

      {/* Inline Add Bill Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="mt-4 p-4 rounded-xl bg-surface-card border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Bill Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Gym Membership"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Amount ({sym})</label>
            <input
              type="number"
              required
              placeholder="1500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Due Day of Month</label>
            <input
              type="number"
              min="1"
              max="31"
              required
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-glow-violet"
            >
              Save Commitment
            </button>
          </div>
        </form>
      )}

      {/* Bills Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {bills.map((bill) => (
          <div 
            key={bill.id} 
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
              bill.is_active 
                ? 'bg-surface-card/90 border-white/10 hover:border-indigo-500/30' 
                : 'bg-slate-900/40 border-white/5 opacity-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-semibold text-white truncate block">{bill.title}</span>
                <span className="text-[11px] text-slate-400">Due day {bill.due_day_of_month}th</span>
              </div>
              <button
                onClick={() => onDeleteBill(bill.id)}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Delete recurring bill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
              <span className="text-sm font-bold text-cyan-400">{sym}{Number(bill.amount).toLocaleString()}</span>
              <button
                onClick={() => onToggleBill(bill.id, !bill.is_active)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                  bill.is_active 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                    : 'bg-slate-800 border-white/10 text-slate-400'
                }`}
              >
                {bill.is_active ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>
        ))}

        {bills.length === 0 && (
          <div className="col-span-full text-center py-6 text-xs text-slate-500">
            No recurring bills added. Add your Rent, Subscriptions, or EMI here!
          </div>
        )}
      </div>

    </div>
  );
}
