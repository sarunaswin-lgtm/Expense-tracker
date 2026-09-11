import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewCards } from './components/OverviewCards';
import { RealityCheckCard } from './components/RealityCheckCard';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { TransactionList } from './components/TransactionList';
import { RecurringManager } from './components/RecurringManager';
import { AddTransactionModal } from './components/AddTransactionModal';
import { api } from './api';
import confetti from 'canvas-confetti';
import { ProfileSettings } from './components/ProfileSettings';
import { 
  User,
  Wallet, 
  Bot, 
  PieChart, 
  CalendarClock, 
  Receipt, 
  Layers, 
  Plus, 
  Flame,
  Home
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overall', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'ai', label: 'AI Reality Check', icon: Bot, badge: 'Roast' },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'recurring', label: 'Fixed Bills', icon: CalendarClock },
  { id: 'transactions', label: 'Ledger', icon: Receipt },
  { id: 'all', label: 'All in One', icon: Layers }
];

export default function App() {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'ai' | 'analytics' | 'recurring' | 'transactions' | 'all'
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [realityCheck, setRealityCheck] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, txRes] = await Promise.all([
        api.getSummary(),
        api.getTransactions()
      ]);

      if (sumRes.success) {
        setData(sumRes.data);
        if (sumRes.data.currency) setCurrency(sumRes.data.currency);
      }
      if (txRes.success) {
        setTransactions(txRes.data);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast('⚠️ Could not connect to WealthPulse API. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Salary
  const handleUpdateSalary = async (salary) => {
    try {
      await api.updateProfile({ monthly_salary: salary });
      showToast('🎉 Monthly salary updated successfully!');
      fetchData();
    } catch (err) {
      showToast('Failed to update salary');
    }
  };

  // Add Transaction
  const handleAddTransaction = async (txData) => {
    try {
      const res = await api.addTransaction(txData);
      if (res.success) {
        if (txData.is_waste) {
          showToast('🚨 Impulse expense recorded & flagged as waste!');
        } else if (txData.type === 'income') {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
          showToast('💰 Income logged successfully!');
        } else {
          showToast('✅ Expense logged successfully.');
        }
        await fetchData();
      }
    } catch (err) {
      showToast('Failed to add transaction');
    }
  };

  // Delete Transaction
  const handleDeleteTransaction = async (id) => {
    try {
      await api.deleteTransaction(id);
      showToast('Transaction removed');
      await fetchData();
    } catch (err) {
      showToast('Failed to delete transaction');
    }
  };

  // Recurring Bills handlers
  const handleAddBill = async (billData) => {
    try {
      await api.addRecurring(billData);
      showToast('Fixed recurring bill saved');
      await fetchData();
    } catch (err) {
      showToast('Failed to save recurring bill');
    }
  };

  const handleToggleBill = async (id, isActive) => {
    try {
      await api.toggleRecurring(id, isActive);
      await fetchData();
    } catch (err) {
      showToast('Failed to toggle bill status');
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      await api.deleteRecurring(id);
      showToast('Recurring commitment deleted');
      await fetchData();
    } catch (err) {
      showToast('Failed to delete bill');
    }
  };

  // AI Reality Check Trigger
  const handleTriggerRealityCheck = async (tone = 'savage') => {
    try {
      setAiLoading(true);
      const res = await api.getRealityCheck(tone);
      if (res.success) {
        setRealityCheck(res.data);
        if (res.data.financialHealthScore >= 75) {
          confetti({ particleCount: 70, spread: 70 });
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to generate reality check');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Coach Chat
  const handleAskCoach = async (question) => {
    try {
      setCoachLoading(true);
      const res = await api.askCoach(question);
      if (res.success) {
        return res.data;
      }
    } catch (err) {
      showToast('Coach failed to respond');
    } finally {
      setCoachLoading(false);
    }
  };

  // Reset demo data
  const handleResetDemo = async () => {
    try {
      await api.resetDemoData();
      showToast('🔄 Demo data reset with realistic transactions!');
      setRealityCheck(null);
      await fetchData();
    } catch (err) {
      showToast('Failed to reset demo data');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100 selection:bg-blue-500 selection:text-white pb-20 sm:pb-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 px-4 py-3 rounded-2xl bg-surface-card border border-blue-500/40 text-white text-xs font-semibold shadow-glow-cyan animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        profile={data?.profile}
        onUpdateSalary={handleUpdateSalary}
        onResetDemo={handleResetDemo}
        currency={currency}
        onCurrencyChange={setCurrency}
        loading={loading}
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* HORIZONTAL PILL TABS BAR (Matching Mobile Banking App Navigation) */}
      <div className="sticky top-16 z-30 w-full border-b border-white/10 bg-[#080c15]/95 backdrop-blur-xl py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TABBED CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TAB 0: PERSONAL PROFILE SETTINGS */}
        {(activeTab === 'profile' || activeTab === 'all') && (
          <div className="animate-in fade-in duration-300">
            <ProfileSettings
              initialProfile={data?.profile}
              onProfileUpdated={(updated) => {
                setData(prev => ({
                  ...prev,
                  profile: { ...(prev?.profile || {}), ...updated }
                }));
                showToast('🎉 Personal profile saved successfully!');
              }}
              onCancel={() => setActiveTab('overview')}
            />
          </div>
        )}

        {/* TAB 1: OVERALL */}
        {(activeTab === 'overview' || activeTab === 'all') && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <OverviewCards
              metrics={data?.metrics}
              currency={currency}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onSelectTab={setActiveTab}
              onTriggerRoast={handleTriggerRealityCheck}
            />
          </div>
        )}

        {/* TAB 2: AI REALITY CHECK */}
        {(activeTab === 'ai' || activeTab === 'all') && (
          <div className="animate-in fade-in duration-300">
            <RealityCheckCard
              realityCheck={realityCheck}
              onTriggerRealityCheck={handleTriggerRealityCheck}
              loading={aiLoading}
              onAskCoach={handleAskCoach}
              coachLoading={coachLoading}
              currency={currency}
            />
          </div>
        )}

        {/* TAB 3: ANALYTICS */}
        {(activeTab === 'analytics' || activeTab === 'all') && (
          <div className="animate-in fade-in duration-300">
            <AnalyticsCharts
              categoryBreakdown={data?.categoryBreakdown || []}
              dailyTrend={data?.dailyTrend || []}
              metrics={data?.metrics || {}}
              currency={currency}
            />
          </div>
        )}

        {/* TAB 4: FIXED BILLS */}
        {(activeTab === 'recurring' || activeTab === 'all') && (
          <div className="animate-in fade-in duration-300">
            <RecurringManager
              bills={data?.recurringBills || []}
              onAddBill={handleAddBill}
              onToggleBill={handleToggleBill}
              onDeleteBill={handleDeleteBill}
              currency={currency}
            />
          </div>
        )}

        {/* TAB 5: TRANSACTIONS & LEDGER */}
        {(activeTab === 'transactions' || activeTab === 'all') && (
          <div className="animate-in fade-in duration-300">
            <TransactionList
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              currency={currency}
            />
          </div>
        )}

      </main>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        currency={currency}
      />

      {/* MOBILE BOTTOM NAVIGATION BAR (Matching Banking App "Scan & Pay" style) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c15]/95 backdrop-blur-2xl border-t border-white/10 px-4 py-2 flex items-center justify-between">
        
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* 2. AI Coach */}
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-rose-400 font-bold' : 'text-slate-400'}`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-[10px]">AI Coach</span>
        </button>

        {/* 3. CENTER FLOATING LOG BUTTON (Like the round blue "Scan & Pay" in the photo) */}
        <div className="relative -top-5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex flex-col items-center justify-center shadow-xl shadow-blue-500/50 border-2 border-white/30 active:scale-95 transition-transform"
            aria-label="Quick Log Expense"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span className="text-[9px] font-extrabold uppercase tracking-tighter">Log</span>
          </button>
        </div>

        {/* 4. Analytics */}
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'analytics' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px]">Analytics</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>

      </nav>

      {/* Desktop Footer */}
      <footer className="hidden sm:block border-t border-white/5 py-6 mt-12 bg-[#060911] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">WealthPulse</span>
            <span>— 100% Free Production Ready</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Supabase Cloud Active</span>
            <span>•</span>
            <span>Gemini 2.5 Flash Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
