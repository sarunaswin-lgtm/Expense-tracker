import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { PieChart as PieIcon, BarChart3, TrendingUp, Flame } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Bills: '#10b981',
  Shopping: '#f43f5e',
  Travel: '#06b6d4',
  Investments: '#8b5cf6',
  Entertainment: '#ec4899',
  Health: '#14b8a6',
  Other: '#64748b'
};

const DEFAULT_COLORS = ['#06b6d4', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#64748b'];

export function AnalyticsCharts({ categoryBreakdown = [], dailyTrend = [], metrics = {}, currency = 'INR' }) {
  const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const sym = currencySymbols[currency] || '₹';

  const totalSpent = metrics.totalExpenses || 0;
  const wasteSpent = metrics.wasteExpenses || 0;
  const essentialSpent = Math.max(0, totalSpent - wasteSpent);

  // Comparison data for Essential vs Waste
  const comparisonData = [
    {
      name: 'Expenses',
      Essential: essentialSpent,
      'Impulse Waste': wasteSpent
    }
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-[#0f172a] border border-white/15 p-2.5 rounded-xl shadow-xl text-xs">
          <div className="font-semibold text-white">{data.name}</div>
          <div className="text-cyan-400 font-bold">
            {sym}{Number(data.value).toLocaleString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* 1. Category Distribution Donut */}
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <PieIcon className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-white font-heading">Category Allocation</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Total {sym}{totalSpent.toLocaleString()}
          </span>
        </div>

        {categoryBreakdown.length > 0 ? (
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">Top Spend</span>
              <span className="text-sm font-bold text-white">
                {categoryBreakdown[0]?.name || 'N/A'}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-56 flex items-center justify-center text-xs text-slate-500">
            No expenses logged yet.
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
          {categoryBreakdown.slice(0, 5).map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 text-slate-300">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: CATEGORY_COLORS[c.name] || DEFAULT_COLORS[i % DEFAULT_COLORS.length] }} 
              />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Essential vs Impulse "Waste" Breakdown */}
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Flame className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-white font-heading">Essential vs Impulse Waste</h3>
          </div>
          <span className="text-[11px] text-rose-400 font-semibold">
            {metrics.wastePercentage ? `${metrics.wastePercentage.toFixed(0)}% Waste` : '0%'}
          </span>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} layout="vertical" margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip 
                formatter={(val) => [`${sym}${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Essential" stackId="a" fill="#10b981" radius={[8, 0, 0, 8]} />
              <Bar dataKey="Impulse Waste" stackId="a" fill="#f43f5e" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Disciplined: <strong className="text-emerald-400">{sym}{essentialSpent.toLocaleString()}</strong>
          </div>
          <div className="text-slate-400">
            Leaked: <strong className="text-rose-400">{sym}{wasteSpent.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* 3. Daily Spend Trajectory */}
      <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm text-white font-heading">Daily Spending Velocity</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Day {metrics.daysPassed || 1} of {metrics.totalDaysInMonth || 30}
          </span>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="wasteGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip 
                formatter={(val) => [`${sym}${Number(val).toLocaleString()}`, '']}
                labelFormatter={(label) => `Day ${label}`}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="total" stroke="#06b6d4" fillOpacity={1} fill="url(#spendGrad)" name="Total Spend" />
              <Area type="monotone" dataKey="waste" stroke="#f43f5e" fillOpacity={1} fill="url(#wasteGrad)" name="Waste Leak" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Projected Month End:</span>
          <span className={`font-semibold ${metrics.projectedMonthEndBalance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {sym}{Number(metrics.projectedMonthEndBalance || 0).toLocaleString()}
          </span>
        </div>
      </div>

    </div>
  );
}
