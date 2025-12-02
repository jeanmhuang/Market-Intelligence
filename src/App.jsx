import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Brain, Search, MessageSquare, BarChart3, Globe, AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight, Activity, Newspaper, DollarSign, PieChart as PieIcon, Send } from 'lucide-react';

// Simulated real-time market data
const generateMarketData = () => {
  const baseData = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.42, change: 3.24, volume: '45.2M', sector: 'Technology', sentiment: 0.85 },
    { symbol: 'MSFT', name: 'Microsoft', price: 428.15, change: 1.18, volume: '22.1M', sector: 'Technology', sentiment: 0.72 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 175.83, change: -0.42, volume: '18.9M', sector: 'Technology', sentiment: 0.68 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 248.67, change: -2.15, volume: '89.3M', sector: 'Automotive', sentiment: 0.45 },
    { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.42, change: 0.87, volume: '12.4M', sector: 'Finance', sentiment: 0.61 },
    { symbol: 'AMZN', name: 'Amazon', price: 185.92, change: 1.95, volume: '31.2M', sector: 'E-Commerce', sentiment: 0.79 },
  ];
  return baseData.map(stock => ({
    ...stock,
    price: +(stock.price + (Math.random() - 0.5) * 2).toFixed(2),
    change: +(stock.change + (Math.random() - 0.5) * 0.5).toFixed(2),
    sentiment: Math.min(1, Math.max(0, stock.sentiment + (Math.random() - 0.5) * 0.1))
  }));
};

const generateChartData = () => {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${(now.getHours() - 23 + i + 24) % 24}:00`,
    sp500: 5280 + Math.sin(i / 3) * 50 + Math.random() * 20,
    nasdaq: 16750 + Math.cos(i / 4) * 80 + Math.random() * 30,
    sentiment: 0.5 + Math.sin(i / 5) * 0.3 + Math.random() * 0.1,
  }));
};

const newsData = [
  { id: 1, headline: "Fed signals potential rate cuts amid cooling inflation data", source: "Reuters", time: "2m ago", sentiment: "positive", impact: "high", category: "Macro" },
  { id: 2, headline: "NVIDIA unveils next-gen AI chips, stock surges in pre-market", source: "Bloomberg", time: "15m ago", sentiment: "positive", impact: "high", category: "Tech" },
  { id: 3, headline: "Tesla recalls 125,000 vehicles over safety concerns", source: "WSJ", time: "32m ago", sentiment: "negative", impact: "medium", category: "Auto" },
  { id: 4, headline: "China manufacturing PMI beats expectations at 51.2", source: "CNBC", time: "1h ago", sentiment: "positive", impact: "medium", category: "Global" },
  { id: 5, headline: "Oil prices stabilize as OPEC+ maintains production cuts", source: "FT", time: "2h ago", sentiment: "neutral", impact: "low", category: "Energy" },
  { id: 6, headline: "Apple Vision Pro sales exceed analyst expectations", source: "TechCrunch", time: "3h ago", sentiment: "positive", impact: "medium", category: "Tech" },
];

const sectorData = [
  { name: 'Technology', value: 32, color: '#00D4FF' },
  { name: 'Healthcare', value: 18, color: '#FF6B6B' },
  { name: 'Finance', value: 22, color: '#4ECDC4' },
  { name: 'Energy', value: 12, color: '#FFE66D' },
  { name: 'Consumer', value: 16, color: '#95E1D3' },
];

const aiInsights = [
  { type: 'opportunity', title: 'Bullish momentum detected', detail: 'AI semiconductor sector showing strong accumulation patterns. NVDA, AMD lead with 85% confidence signal.', confidence: 85 },
  { type: 'risk', title: 'Volatility warning', detail: 'VIX futures indicate increased uncertainty ahead of FOMC meeting. Consider hedging positions.', confidence: 72 },
  { type: 'trend', title: 'Sector rotation identified', detail: 'Capital flowing from growth to value stocks. Financial sector outperforming tech by 2.3% this week.', confidence: 78 },
];

const SentimentBadge = ({ sentiment }) => {
  const config = {
    positive: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: TrendingUp },
    negative: { bg: 'bg-red-500/20', text: 'text-red-400', icon: TrendingDown },
    neutral: { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: Activity },
  };
  const { bg, text, icon: Icon } = config[sentiment];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon size={10} />
      {sentiment}
    </span>
  );
};

const ImpactBadge = ({ impact }) => {
  const colors = { high: 'text-orange-400', medium: 'text-yellow-400', low: 'text-slate-500' };
  return <span className={`text-xs font-medium ${colors[impact]}`}>{impact.toUpperCase()}</span>;
};

export default function MarketIntelDashboard() {
  const [marketData, setMarketData] = useState(generateMarketData());
  const [chartData, setChartData] = useState(generateChartData());
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI Market Intelligence Assistant. I can analyze market trends, explain financial news, provide sentiment analysis, and help with investment research. What would you like to explore?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(generateMarketData());
      setCurrentTime(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on my analysis of current market sentiment and technical indicators, the tech sector shows strong momentum. NVIDIA leads with 85% bullish signals from institutional flow data. However, I'd recommend monitoring the upcoming Fed meeting as it could introduce volatility.",
        "Looking at the sentiment analysis across 50+ news sources, I'm seeing a positive shift in market confidence. The Fear & Greed Index moved from 'Neutral' to 'Greed' over the past 48 hours, typically a precursor to continued upward movement.",
        "My NLP analysis of recent earnings call transcripts reveals management teams are cautiously optimistic about Q2. Key themes emerging: AI infrastructure spending, margin expansion, and international growth. I'd focus on companies with strong free cash flow.",
        "Cross-referencing social sentiment with options flow, I detect unusual activity in semiconductor stocks. This often precedes significant moves. The risk-reward ratio appears favorable for a long position with defined risk.",
      ];
      const response = { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] };
      setChatMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  }, [inputMessage]);

  const avgSentiment = (marketData.reduce((acc, s) => acc + s.sentiment, 0) / marketData.length * 100).toFixed(0);
  const topMover = marketData.reduce((a, b) => Math.abs(a.change) > Math.abs(b.change) ? a : b);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white font-sans">
      {/* Custom font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .glow { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
        .card-gradient { background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%); }
        .pulse-dot { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .scroll-fade { mask-image: linear-gradient(to bottom, black 80%, transparent 100%); }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-800/50 bg-[#0a0e17]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow">
                  <Brain size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">Market<span className="text-cyan-400">Intel</span></h1>
                  <p className="text-[10px] text-slate-500 -mt-0.5">AI-Powered Analysis</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800 mx-2" />
              <nav className="flex gap-1">
                {['overview', 'analysis', 'assistant'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab 
                        ? 'bg-cyan-500/20 text-cyan-400' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-xs text-emerald-400 font-medium">Live Data</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Market Hours</p>
                <p className="text-sm font-semibold mono">{currentTime.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-5">
            {/* Key Metrics Row */}
            <div className="col-span-12 grid grid-cols-4 gap-4">
              {[
                { label: 'S&P 500', value: '5,284.32', change: '+1.24%', positive: true, icon: TrendingUp },
                { label: 'Market Sentiment', value: `${avgSentiment}%`, change: 'Bullish', positive: true, icon: Brain },
                { label: 'Top Mover', value: topMover.symbol, change: `${topMover.change > 0 ? '+' : ''}${topMover.change}%`, positive: topMover.change > 0, icon: Zap },
                { label: 'VIX Index', value: '14.82', change: '-3.2%', positive: true, icon: Activity },
              ].map((metric, i) => (
                <div key={i} className="card-gradient rounded-2xl border border-slate-800/50 p-5 hover:border-cyan-500/30 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{metric.label}</span>
                    <metric.icon size={18} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-2xl font-bold mono mb-1">{metric.value}</p>
                  <p className={`text-sm font-medium flex items-center gap-1 ${metric.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {metric.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {metric.change}
                  </p>
                </div>
              ))}
            </div>

            {/* Main Chart */}
            <div className="col-span-8 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Market Performance & Sentiment</h2>
                  <p className="text-xs text-slate-500 mt-0.5">24-hour trend with AI sentiment overlay</p>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-cyan-400 rounded" /> S&P 500</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-0.5 bg-purple-400 rounded" /> Sentiment</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 20', 'dataMax + 20']} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="sp500" stroke="#00D4FF" strokeWidth={2} fill="url(#colorSp)" />
                  <Line type="monotone" dataKey="sentiment" stroke="#A855F7" strokeWidth={2} dot={false} yAxisId="right" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sector Allocation */}
            <div className="col-span-4 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieIcon size={18} className="text-cyan-400" />
                <h2 className="text-lg font-semibold">Sector Allocation</h2>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {sectorData.map((sector, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: sector.color }} />
                    <span className="text-xs text-slate-400">{sector.name}</span>
                    <span className="text-xs font-medium ml-auto">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Watchlist */}
            <div className="col-span-5 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-cyan-400" />
                  <h2 className="text-lg font-semibold">Live Watchlist</h2>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded-full">Auto-refresh</span>
              </div>
              <div className="space-y-2 scroll-fade max-h-[280px] overflow-y-auto pr-2">
                {marketData.map((stock, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all cursor-pointer group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{stock.symbol}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{stock.sector}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold mono text-sm">${stock.price}</p>
                      <p className={`text-xs font-medium ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </p>
                    </div>
                    <div className="w-20">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-500">Sentiment</span>
                        <span className={stock.sentiment > 0.6 ? 'text-emerald-400' : stock.sentiment > 0.4 ? 'text-yellow-400' : 'text-red-400'}>
                          {(stock.sentiment * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${stock.sentiment > 0.6 ? 'bg-emerald-400' : stock.sentiment > 0.4 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${stock.sentiment * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* News Feed */}
            <div className="col-span-7 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper size={18} className="text-cyan-400" />
                <h2 className="text-lg font-semibold">AI-Analyzed News Feed</h2>
              </div>
              <div className="space-y-3 scroll-fade max-h-[280px] overflow-y-auto pr-2">
                {newsData.map((news) => (
                  <div key={news.id} className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all cursor-pointer group border-l-2 border-transparent hover:border-cyan-400">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-snug group-hover:text-cyan-400 transition-colors">{news.headline}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-slate-500">{news.source}</span>
                          <span className="text-xs text-slate-600">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} />{news.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <SentimentBadge sentiment={news.sentiment} />
                        <ImpactBadge impact={news.impact} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="col-span-12 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={18} className="text-cyan-400" />
                <h2 className="text-lg font-semibold">AI-Generated Insights</h2>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full ml-2">Powered by ML</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {aiInsights.map((insight, i) => (
                  <div key={i} className={`p-5 rounded-xl border ${
                    insight.type === 'opportunity' ? 'bg-emerald-500/5 border-emerald-500/20' :
                    insight.type === 'risk' ? 'bg-red-500/5 border-red-500/20' :
                    'bg-blue-500/5 border-blue-500/20'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      {insight.type === 'opportunity' ? <CheckCircle size={18} className="text-emerald-400" /> :
                       insight.type === 'risk' ? <AlertTriangle size={18} className="text-red-400" /> :
                       <TrendingUp size={18} className="text-blue-400" />}
                      <span className="font-semibold text-sm">{insight.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{insight.detail}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">Confidence</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${insight.confidence}%` }} />
                      </div>
                      <span className="text-xs font-medium text-cyan-400">{insight.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-8 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <h2 className="text-lg font-semibold mb-4">Technical Analysis Dashboard</h2>
              <p className="text-slate-400 text-sm mb-6">Real-time technical indicators with ML-enhanced signal detection</p>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorNasdaq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="nasdaq" stroke="#A855F7" strokeWidth={2} fill="url(#colorNasdaq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="col-span-4 space-y-4">
              {['RSI', 'MACD', 'Bollinger Bands', 'Moving Averages'].map((indicator, i) => (
                <div key={i} className="card-gradient rounded-xl border border-slate-800/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{indicator}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${i % 2 === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {i % 2 === 0 ? 'Bullish' : 'Neutral'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-yellow-400'}`} style={{ width: `${60 + i * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assistant' && (
          <div className="max-w-4xl mx-auto">
            <div className="card-gradient rounded-2xl border border-slate-800/50 overflow-hidden">
              <div className="p-6 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">AI Research Assistant</h2>
                    <p className="text-xs text-slate-500">Ask about market trends, analysis, or investment strategies</p>
                  </div>
                </div>
              </div>
              <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500/20 border border-cyan-500/30' 
                        : 'bg-slate-800/50 border border-slate-700/50'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-800/50">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about market analysis, sentiment, or trading strategies..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12 py-6">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between text-xs text-slate-500">
          <p>Built with React, Recharts, and AI • <span className="text-cyan-400">Portfolio Project by Jelly</span></p>
          <p>Real-time simulation for demonstration purposes</p>
        </div>
      </footer>
    </div>
  );
}
