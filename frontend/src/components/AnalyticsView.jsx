import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Clock, Sparkles, MessageSquare, ListCollapse, MessageCircle } from 'lucide-react';

export default function AnalyticsView({ filename, darkMode }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!filename) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/analytics?filename=${filename}`);
        setAnalytics(res.data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [filename]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3"></div>
        <span className="text-xs font-medium text-slate-550 dark:text-zinc-400">Compiling Analytics Dashboard...</span>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px] text-xs">
        <span className="text-red-500 font-semibold mb-2">Failed to load analytics</span>
        <span className="text-gray-400 dark:text-zinc-550 max-w-[200px] leading-relaxed">{error || "Please select and retrain a WhatsApp chat log first."}</span>
      </div>
    );
  }

  // Find max values for chart height calculations
  const maxDaily = Math.max(...analytics.dailyActivity.map(d => d.count), 1);
  const maxWeekly = Math.max(...analytics.weeklyActivity.map(w => w.count), 1);

  // Math coordinates helper for daily activity line path
  const dailyPoints = analytics.dailyActivity.map((item, index) => {
    const x = (index / 23) * 260 + 20;
    const y = 90 - (item.count / maxDaily) * 70;
    return { x, y, item };
  });

  const dailyPath = dailyPoints.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  const dailyAreaPath = dailyPoints.length > 0 
    ? `${dailyPath} L ${dailyPoints[dailyPoints.length - 1].x} 90 L ${dailyPoints[0].x} 90 Z`
    : '';

  return (
    <div className="p-4 space-y-5 animate-fadeIn">
      
      {/* 1. KPIs Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-zinc-500 mb-1">
            <MessageSquare size={12} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Total Messages</span>
          </div>
          <span className="text-base font-extrabold tracking-tight">{analytics.totalMessages}</span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-zinc-500 mb-1">
            <ListCollapse size={12} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Reply Pairs</span>
          </div>
          <span className="text-base font-extrabold tracking-tight">{analytics.replyPairsCount}</span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-zinc-500 mb-1">
            <Clock size={12} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Avg Reply Words</span>
          </div>
          <span className="text-base font-extrabold tracking-tight">{analytics.avgReplyLength}</span>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
          <div className="flex items-center gap-1.5 text-gray-400 dark:text-zinc-500 mb-1">
            <Sparkles size={12} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Fav Emoji</span>
          </div>
          <span className="text-lg leading-none">{analytics.favoriteEmoji}</span>
        </div>
      </div>

      {/* 2. Tone & Formality Gauge */}
      <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">
          Tone & Formality Balance
        </h4>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-10 flex items-end justify-center overflow-hidden">
            {/* SVG Arc Gauge */}
            <svg className="w-20 h-20 absolute -top-0">
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke={darkMode ? '#1f1f23' : '#e2e8f0'}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="94.2"
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transform rotate-180 origin-center"
              />
              <circle
                cx="40"
                cy="40"
                r="30"
                stroke="#10b981"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="94.2"
                strokeDashoffset={94.2 - (94.2 * analytics.formalityScore) / 100}
                strokeLinecap="round"
                className="transform rotate-180 origin-center transition-all duration-1000"
              />
            </svg>
            <span className="text-xs font-extrabold pb-0.5">{analytics.formalityScore}%</span>
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold leading-none mb-1">{analytics.tone}</h5>
            <p className="text-[9px] text-gray-400 dark:text-zinc-500 leading-normal">
              Style profile weights: Formality score {analytics.formalityScore}/100. Lower scores show a casual, informal layout.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Daily Activity Line Chart */}
      <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-2">
          Daily Hourly Activity (24h)
        </h4>
        <div className="h-24 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Grid baseline */}
            <line x1="10" y1="90" x2="290" y2="90" stroke={darkMode ? '#1f1f23' : '#e2e8f0'} strokeWidth="1" />
            
            {/* Area Fill */}
            {dailyAreaPath && <path d={dailyAreaPath} fill="url(#areaGrad)" />}
            
            {/* Stroke Line */}
            {dailyPath && <path d={dailyPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </div>
        <div className="flex justify-between text-[7px] font-bold uppercase tracking-wider text-gray-405 mt-1 px-2.5">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>11 PM</span>
        </div>
      </div>

      {/* 4. Weekly Activity Bar Chart */}
      <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">
          Weekly Activity (By Week Day)
        </h4>
        <div className="h-24 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 280 100" preserveAspectRatio="none">
            <line x1="0" y1="90" x2="280" y2="90" stroke={darkMode ? '#1f1f23' : '#e2e8f0'} strokeWidth="1" />
            {analytics.weeklyActivity.map((item, idx) => {
              const width = 24;
              const x = idx * 40 + 8;
              const height = (item.count / maxWeekly) * 75;
              const y = 90 - height;
              return (
                <g key={idx} className="group cursor-pointer">
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={item.count > 0 ? '#10b981' : (darkMode ? '#1f1f23' : '#f1f5f9')}
                    rx="3"
                    ry="3"
                    className="transition-all duration-300 hover:fill-emerald-400"
                  />
                  <text
                    x={x + 12}
                    y="98"
                    textAnchor="middle"
                    fill={darkMode ? '#a1a1aa' : '#64748b'}
                    fontSize="7"
                    fontWeight="bold"
                    className="uppercase tracking-wide"
                  >
                    {item.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 5. Most Used Words list */}
      <div className="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850/60 rounded-xl">
        <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-3">
          Top Vocabulary Frequencies
        </h4>
        <div className="space-y-2.5">
          {analytics.mostUsedWords.map((item, idx) => {
            // Find max word count to calculate relative widths
            const maxWordCount = Math.max(...analytics.mostUsedWords.map(w => w.count), 1);
            const percentage = (item.count / maxWordCount) * 100;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px] font-medium px-0.5">
                  <span className="font-semibold text-slate-800 dark:text-zinc-200">"{item.word}"</span>
                  <span className="text-gray-400 dark:text-zinc-500 font-bold">{item.count} hits</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
