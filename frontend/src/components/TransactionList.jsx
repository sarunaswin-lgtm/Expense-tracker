import React, { useState } from 'react';
import { 
  Search, 
  Flame, 
  Trash2, 
  ArrowDownRight, 
  ArrowUpRight, 
  Filter,
  Layers,
  Plus
} from 'lucide-react';

const CATEGORY_ICONS = {
  Food: '🍔',
  Shopping: '🛍️',
  Bills: '⚡',
  Travel: '✈️',
  Investments: '📈',
  Entertainment: '🎬',
  Health: '💊',
  Other: '📦',
  Salary: '💼',
  Income: '💰'
};

export function TransactionList({ transactions = [], onDelete, onOpenAddModal, currency = 'INR' }) {
  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const sym = currencySymbols[currency] || '₹';

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income' | 'waste'
  const [categoryFilter, setCategoryFilter] = useState('');

  // Filtering logic
  const filtered = transactions.filter(t => {
    // Search query
    const matchSearch = 
      (t.notes && t.notes.toLowerCase().includes(search.toLowerCase())) ||
      (t.category && t.category.toLowerCase().includes(search.toLowerCase()));

    if (!matchSearch) return false;

    // Filter type
    if (filterType === 'waste') {
      if (!t.is_waste) return false;
    } else if (filterType !== 'all') {
      if (t.type !== filterType) return false;
    }

    // Category filter
    if (categoryFilter && t.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  const categories = Array.from(new Set(transactions.map(t => t.category))).filter(Boolean);

  return (
    <div className="glass-card rounded-2xl p-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h3 className="font-bold text-lg text-white font-heading">Transaction Ledger</h3>
          <p className="text-xs text-slate-400">Track day-to-day spending and flag money leaks</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Add Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080c15] text-xs font-bold shadow-glow-cyan transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes, merchants, or categories..."
            className="w-full bg-surface-card border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-card border border-white/10 rounded-xl p-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterType === 'all' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterType === 'expense' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterType === 'income' ? 'bg-white/15 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilterType('waste')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              filterType === 'waste' 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-rose-400" />
            Waste Only
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-surface-card border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-all"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

      </div>

      {/* Transaction Table / List */}
      <div className="mt-4 space-y-2">
        {filtered.length > 0 ? (
          filtered.map((t) => {
            const isExpense = t.type === 'expense';
            const icon = CATEGORY_ICONS[t.category] || '💸';

            return (
              <div 
                key={t.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  t.is_waste 
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50' 
                    : 'bg-surface-card/60 border-white/5 hover:border-white/15'
                }`}
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center text-base shrink-0">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-semibold text-white truncate">
                        {t.notes || t.category}
                      </span>
                      {t.is_waste && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center gap-1 shrink-0">
                          <Flame className="w-2.5 h-2.5 fill-rose-400" />
                          Impulse Waste
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{t.category}</span>
                      <span>•</span>
                      <span>{t.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className={`text-xs sm:text-sm font-bold font-heading flex items-center justify-end gap-1 ${
                      isExpense ? (t.is_waste ? 'text-rose-400' : 'text-slate-200') : 'text-emerald-400'
                    }`}>
                      {isExpense ? '-' : '+'}
                      {sym}{Number(t.amount).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      {t.type}
                    </span>
                  </div>

                  <button
                    onClick={() => onDelete(t.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            No transactions found matching your filter.
          </div>
        )}
      </div>

    </div>
  );
}
