import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  MessageSquare, 
  TrendingUp, 
  Bot, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function RealityCheckCard({ 
  realityCheck, 
  onTriggerRealityCheck, 
  loading, 
  onAskCoach, 
  coachLoading,
  currency = 'INR' 
}) {
  const [selectedTone, setSelectedTone] = useState('savage');
  const [question, setQuestion] = useState('');
  const [coachResponse, setCoachResponse] = useState(null);

  const handleRunCheck = () => {
    onTriggerRealityCheck(selectedTone);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const res = await onAskCoach(question);
    if (res && res.answer) {
      setCoachResponse(res.answer);
      setQuestion('');
    }
  };

  const dangerBadges = {
    CRITICAL: {
      bg: 'bg-rose-500/20 border-rose-500/40 text-rose-400',
      label: '🚨 Critical Burn Rate'
    },
    WARNING: {
      bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
      label: '⚠️ High Leakage Warning'
    },
    MODERATE: {
      bg: 'bg-blue-500/20 border-blue-500/40 text-cyan-300',
      label: '⚖️ Needs Tightening'
    },
    HEALTHY: {
      bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
      label: '🛡️ Financially Disciplined'
    }
  };

  const badge = dangerBadges[realityCheck?.dangerLevel] || dangerBadges.WARNING;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-rose-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
              Gemini Financial Reality Check
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                gemini-2.5-flash
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Hard-hitting analysis of your salary, burn pace, and impulse money leaks.
          </p>
        </div>

        {/* Tone Selector & Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-surface-card border border-white/10 rounded-xl p-1 flex text-xs font-medium">
            {[
              { id: 'savage', label: '🔥 Savage' },
              { id: 'balanced', label: '⚖️ Balanced' },
              { id: 'gentle', label: '🌱 Gentle' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTone(t.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTone === t.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-glow-cyan' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunCheck}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white text-xs font-bold shadow-glow-rose transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Roasting Your Wallet...</span>
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 fill-white" />
                <span>Run Reality Check</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Roast & Intelligence Display */}
      {realityCheck && (
        <div className="mt-6 space-y-6">
          
          {/* Top Headline & Danger Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center gap-2">
              {realityCheck.headline}
            </h3>
            <span className={`self-start sm:self-auto text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badge.bg}`}>
              {badge.label}
            </span>
          </div>

          {/* Hard-hitting Roast Quote Box */}
          <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-rose-950/40 via-purple-950/20 to-slate-900/60 border border-rose-500/25 shadow-inner">
            <div className="text-5xl font-serif text-rose-500/20 absolute top-2 left-3 select-none">“</div>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed relative z-10 pl-6">
              {realityCheck.roast}
            </p>
            <div className="mt-4 pt-3 border-t border-rose-500/15 flex items-center justify-between text-xs text-rose-300">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <strong>Waste Diagnosis:</strong> {realityCheck.wasteDiagnosis}
              </span>
              <span className="font-semibold text-slate-300">
                Discipline Score: <strong className="text-cyan-400">{realityCheck.financialHealthScore}/100</strong>
              </span>
            </div>
          </div>

          {/* 3 Actionable Saving Tips */}
          {realityCheck.actionableTips && realityCheck.actionableTips.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Actionable Saving Prescription
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {realityCheck.actionableTips.map((tip, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl bg-surface-card/80 border border-white/5 hover:border-cyan-500/30 transition-all flex items-start gap-2.5 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Interactive "Ask Financial Coach" Drawer */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-300">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Ask Financial Coach (e.g. &ldquo;Can I afford sneakers today?&rdquo; or &ldquo;How do I cut down on food orders?&rdquo;)</span>
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question for Gemini financial coach..."
            className="flex-1 bg-surface-card border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
          <button
            type="submit"
            disabled={coachLoading || !question.trim()}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#080c15] font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {coachLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Ask Coach</span>
          </button>
        </form>

        {coachResponse && (
          <div className="mt-4 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <div className="flex items-center gap-2 font-semibold text-cyan-300 mb-1">
              <Bot className="w-4 h-4" />
              Coach Advice:
            </div>
            <p className="whitespace-pre-line">{coachResponse}</p>
          </div>
        )}
      </div>

    </div>
  );
}
