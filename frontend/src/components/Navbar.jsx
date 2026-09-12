import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Edit2, 
  User, 
  Bell, 
  Search, 
  Power 
} from 'lucide-react';

export function Navbar({ profile, onUpdateSalary, onResetDemo, currency, onCurrencyChange, loading, onOpenProfile }) {
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState(profile?.monthly_salary || 20000);

  useEffect(() => {
    if (profile?.monthly_salary !== undefined && profile?.monthly_salary !== null) {
      setSalaryInput(profile.monthly_salary);
    }
  }, [profile?.monthly_salary]);

  const handleSalarySave = (e) => {
    e.preventDefault();
    const val = Number(salaryInput);
    if (!isNaN(val) && val > 0) {
      onUpdateSalary(val);
      setIsEditingSalary(false);
    }
  };

  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const currSymbol = currencySymbols[currency] || '₹';

  const getInitials = (name) => {
    if (!name) return 'AS';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080c15]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: User Profile Avatar & Name (Click to open Profile Settings) */}
        <button 
          type="button"
          onClick={onOpenProfile}
          className="flex items-center gap-3 text-left hover:opacity-85 transition-all group focus:outline-none"
          title="Click to open Personal Profile Settings"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-glow-cyan shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover rounded-[10px]" />
            ) : (
              <div className="w-full h-full bg-[#080c15] rounded-[10px] flex items-center justify-center font-bold text-xs text-cyan-400">
                {getInitials(profile?.name || 'Arunaswin S')}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold font-heading tracking-tight text-white uppercase group-hover:text-cyan-300 transition-colors">
                {profile?.name || 'ARUNASWIN S'}
              </span>
              <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                Gemini 2.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5 group-hover:text-slate-300">
              @{profile?.username || 'sarunaswin'} • Profile Settings
            </p>
          </div>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Currency Switcher */}
          <div className="flex items-center rounded-xl bg-surface-card border border-white/10 p-0.5 text-xs">
            {['INR', 'USD', 'EUR'].map(c => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  currency === c 
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {c === 'INR' ? '₹' : c === 'USD' ? '$' : '€'}<span className="hidden sm:inline"> {c}</span>
              </button>
            ))}
          </div>

          {/* Monthly Salary Pill */}
          <div className="relative">
            {isEditingSalary ? (
              <form onSubmit={handleSalarySave} className="flex items-center gap-1 bg-surface-card border border-cyan-500/50 rounded-xl px-2 py-1">
                <span className="text-xs text-cyan-400 font-semibold">{currSymbol}</span>
                <input
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  className="w-20 bg-transparent text-xs font-semibold text-white focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => {
                  setSalaryInput(profile?.monthly_salary || 20000);
                  setIsEditingSalary(true);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-card hover:bg-slate-800 border border-white/10 transition-all text-xs group"
                title="Click to change monthly salary"
              >
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 hidden sm:block">Monthly Salary</div>
                  <div className="font-semibold text-white group-hover:text-cyan-300 flex items-center gap-1">
                    {currSymbol}{Number(profile?.monthly_salary || 20000).toLocaleString()}
                    <Edit2 className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetDemo}
            disabled={loading}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all active:scale-95"
            title="Reset demo data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

        </div>
      </div>
    </header>
  );
}
