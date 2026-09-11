import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Wallet, 
  PiggyBank,
  ArrowUpRight,
  Zap,
  Eye,
  EyeOff,
  PlusCircle,
  CreditCard,
  Receipt,
  PieChart,
  Bot,
  Layers,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';

export function OverviewCards({ metrics, currency = 'INR', onOpenAddModal, onSelectTab, onTriggerRoast }) {
  const [showBalance, setShowBalance] = useState(true);
  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const sym = currencySymbols[currency] || '₹';

  const {
    salary = 20000,
    effectiveIncome = 20000,
    totalExpenses = 0,
    totalFixedCosts = 0,
    wasteExpenses = 0,
    wasteCount = 0,
    wastePercentage = 0,
    remainingBalance = 0,
    burnRatePerDay = 0,
    safeDailyAllowance = 0,
    projectedMonthEndBalance = 0,
    daysLeftInMonth = 15,
    daysPassed = 15,
    totalDaysInMonth = 30,
    savingsRatePercent = 0
  } = metrics || {};

  const percentSpent = Math.min(100, Math.round((totalExpenses / (effectiveIncome || 1)) * 100));

  const formatAmount = (val) => {
    if (!showBalance) return '••••••';
    return `${sym}${Number(val).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      
      {/* 1. MASTER BANKING PASSBOOK GRADIENT CARD (Inspired by Mobile Banking UI) */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#1d4ed8] via-[#3b82f6] to-[#7c3aed] text-white shadow-2xl shadow-blue-500/20 border border-white/20">
        
        {/* Ambient Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12" />

        {/* Card Header */}
        <div className="flex items-center justify-between relative z-10 pb-4 border-b border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs tracking-wider">
              WP
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-100">Overall Account</span>
              <h2 className="text-base font-bold font-heading leading-tight">Financial Intelligence</h2>
            </div>
          </div>

          <button
            onClick={() => setShowBalance(!showBalance)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold transition-all active:scale-95"
            title="Toggle sensitive balance visibility"
          >
            {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showBalance ? 'Hide' : 'Show'}</span>
          </button>
        </div>

        {/* Card Account Rows */}
        <div className="mt-5 space-y-3 relative z-10">
          
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-blue-100 font-medium">
              <span className="p-1 rounded-md bg-white/15"><Wallet className="w-3.5 h-3.5" /></span>
              <span>Monthly Salary (Income)</span>
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight">{formatAmount(effectiveIncome)}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-blue-100 font-medium">
              <span className="p-1 rounded-md bg-white/15"><TrendingDown className="w-3.5 h-3.5 text-rose-300" /></span>
              <span>Total Spent This Month</span>
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-white">{formatAmount(totalExpenses)}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-blue-100 font-medium">
              <span className="p-1 rounded-md bg-white/15"><PiggyBank className="w-3.5 h-3.5 text-emerald-300" /></span>
              <span>Remaining Net Runway</span>
            </div>
            <span className={`font-black text-sm sm:text-base tracking-tight ${remainingBalance < 0 ? 'text-rose-200' : 'text-emerald-200'}`}>
              {formatAmount(remainingBalance)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-rose-200 font-medium">
              <span className="p-1 rounded-md bg-rose-500/30"><Flame className="w-3.5 h-3.5 text-rose-300 fill-rose-300" /></span>
              <span>Impulse / Waste Leaks</span>
            </div>
            <span className="font-bold text-sm sm:text-base text-rose-200 tracking-tight">{formatAmount(wasteExpenses)}</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-blue-100 font-medium">
              <span className="p-1 rounded-md bg-white/15"><CreditCard className="w-3.5 h-3.5" /></span>
              <span>Fixed Commitments (Rent/SIP)</span>
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight">{formatAmount(totalFixedCosts)}</span>
          </div>

        </div>

        {/* Card Footer Ticker */}
        <div className="mt-5 pt-3.5 border-t border-white/15 flex items-center justify-between text-xs text-blue-100 relative z-10">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-200" />
            <span><strong>{daysLeftInMonth}</strong> days left in month</span>
          </div>
          <div className="text-[11px] font-semibold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">
            Safe allowance: {formatAmount(safeDailyAllowance)}/day
          </div>
        </div>

      </div>

      {/* 2. QUICK ACTION GRID (Inspired by Banking App "Pay & Transfer" Grid) */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold font-heading uppercase tracking-wider text-slate-300">
            Quick Actions & Hub
          </h3>
          <span className="text-[11px] text-cyan-400 font-semibold">1-Tap Shortcuts</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 text-center">
          
          {/* 1. Log Expense */}
          <button
            onClick={onOpenAddModal}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-card hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 transition-all active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1.5 transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-cyan-300">Log Spend</span>
          </button>

          {/* 2. AI Roast */}
          <button
            onClick={() => {
              if (onSelectTab) onSelectTab('ai');
              if (onTriggerRoast) onTriggerRoast('savage');
            }}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-card hover:bg-slate-800 border border-white/10 hover:border-rose-500/40 transition-all active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 group-hover:bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1.5 transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-rose-300">AI Roast</span>
          </button>

          {/* 3. Analytics */}
          <button
            onClick={() => onSelectTab && onSelectTab('analytics')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-card hover:bg-slate-800 border border-white/10 hover:border-indigo-500/40 transition-all active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5 transition-colors">
              <PieChart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-indigo-300">Analytics</span>
          </button>

          {/* 4. Fixed Bills */}
          <button
            onClick={() => onSelectTab && onSelectTab('recurring')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-card hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 transition-all active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 transition-colors">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-emerald-300">Fixed Bills</span>
          </button>

          {/* 5. Waste Radar */}
          <button
            onClick={() => onSelectTab && onSelectTab('transactions')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-card hover:bg-slate-800 border border-white/10 hover:border-rose-500/40 transition-all active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 group-hover:bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1.5 transition-colors">
              <Flame className="w-5 h-5 fill-rose-400" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-rose-300">Waste Radar</span>
          </button>

          {/* 6. Ledger History */}
          <button
            onClick={() => onSelectTab && onSelectTab('transactions')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-card hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 transition-all active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1.5 transition-colors">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-cyan-300">Ledger</span>
          </button>

          {/* 7. All In One */}
          <button
            onClick={() => onSelectTab && onSelectTab('all')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-card hover:bg-slate-800 border border-white/10 hover:border-white/30 transition-all active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 group-hover:bg-white/20 text-white flex items-center justify-center mb-1.5 transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white">All Views</span>
          </button>

          {/* 8. Ask Coach */}
          <button
            onClick={() => onSelectTab && onSelectTab('ai')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-card hover:bg-slate-800 border border-white/10 hover:border-purple-500/40 transition-all active:scale-95 group"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1.5 transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-200 group-hover:text-purple-300">Ask Coach</span>
          </button>

        </div>
      </div>

    </div>
  );
}
