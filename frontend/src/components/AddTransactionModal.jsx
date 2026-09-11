import React, { useState } from 'react';
import { 
  X, 
  Flame, 
  DollarSign, 
  Calendar, 
  Tag, 
  FileText, 
  PlusCircle, 
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', icon: '🍔' },
  { id: 'Shopping', label: 'Shopping & Clothes', icon: '🛍️' },
  { id: 'Bills', label: 'Bills & Utilities', icon: '⚡' },
  { id: 'Travel', label: 'Travel & Commute', icon: '✈️' },
  { id: 'Investments', label: 'Investments & SIP', icon: '📈' },
  { id: 'Entertainment', label: 'Entertainment & OTT', icon: '🎬' },
  { id: 'Health', label: 'Health & Pharmacy', icon: '💊' },
  { id: 'Other', label: 'General / Other', icon: '📦' }
];

export function AddTransactionModal({ isOpen, onClose, onAddTransaction, currency = 'INR' }) {
  if (!isOpen) return null;

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const sym = currencySymbols[currency] || '₹';

  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [isWaste, setIsWaste] = useState(false);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setSubmitting(true);
    try {
      await onAddTransaction({
        amount: Number(amount),
        category: type === 'income' ? 'Income' : category,
        type,
        is_waste: type === 'expense' ? isWaste : false,
        notes: notes.trim(),
        date
      });
      // Reset & close
      setAmount('');
      setNotes('');
      setIsWaste(false);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-white/10 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-heading text-white">Log Transaction</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Type Toggle: Expense vs Income */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-card border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'expense' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4 text-rose-400" />
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'income' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
              Income
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount ({sym})</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-lg font-bold text-cyan-400">{sym}</span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-surface-card border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Category Selector (only for expenses) */}
          {type === 'expense' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-xs text-left flex items-center gap-2 transition-all ${
                      category === cat.id
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200 font-semibold'
                        : 'bg-surface-card border-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CRUCIAL FEATURE: The "Waste Tag" Toggle (Only for expenses) */}
          {type === 'expense' && (
            <div className={`p-4 rounded-2xl border transition-all ${
              isWaste 
                ? 'bg-rose-950/40 border-rose-500/50 shadow-glow-rose' 
                : 'bg-surface-card/60 border-white/5'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isWaste ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      Waste / Impulse Buying
                      {isWaste && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-black">LEAK</span>}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Unnecessary craving, impulse shopping cart, or spontaneous splurge?
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWaste}
                    onChange={(e) => setIsWaste(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>
            </div>
          )}

          {/* Date & Description in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes / Merchant</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Swiggy pizza, Starbucks, Zara"
                className="w-full bg-surface-card border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting || !amount}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-[#080c15] font-bold text-sm tracking-wide shadow-glow-cyan transition-all disabled:opacity-50 active:scale-[0.99]"
            >
              {submitting ? 'Recording...' : `Log ${type === 'expense' ? 'Expense' : 'Income'}`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
