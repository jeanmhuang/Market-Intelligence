import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Brain, Search, MessageSquare, BarChart3, AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight, Activity, Newspaper, PieChart as PieIcon, Send, X, Plus, Star, RefreshCw, Settings, Wifi, WifiOff } from 'lucide-react';

// Comprehensive stock database - 100+ stocks across all major sectors
const STOCK_DATABASE = {
  // Technology - Major
  AAPL: { name: 'Apple Inc', sector: 'Technology', basePrice: 189.84 },
  MSFT: { name: 'Microsoft', sector: 'Technology', basePrice: 428.15 },
  GOOGL: { name: 'Alphabet', sector: 'Technology', basePrice: 175.83 },
  AMZN: { name: 'Amazon', sector: 'Technology', basePrice: 185.92 },
  META: { name: 'Meta Platforms', sector: 'Technology', basePrice: 505.42 },
  NVDA: { name: 'NVIDIA', sector: 'Technology', basePrice: 875.42 },
  TSLA: { name: 'Tesla', sector: 'Technology', basePrice: 248.67 },
  
  // Technology - Semiconductors
  AMD: { name: 'AMD', sector: 'Semiconductors', basePrice: 162.33 },
  INTC: { name: 'Intel', sector: 'Semiconductors', basePrice: 31.25 },
  AVGO: { name: 'Broadcom', sector: 'Semiconductors', basePrice: 1285.50 },
  QCOM: { name: 'Qualcomm', sector: 'Semiconductors', basePrice: 168.42 },
  TXN: { name: 'Texas Instruments', sector: 'Semiconductors', basePrice: 172.18 },
  MU: { name: 'Micron', sector: 'Semiconductors', basePrice: 98.45 },
  AMAT: { name: 'Applied Materials', sector: 'Semiconductors', basePrice: 198.72 },
  LRCX: { name: 'Lam Research', sector: 'Semiconductors', basePrice: 925.30 },
  KLAC: { name: 'KLA Corp', sector: 'Semiconductors', basePrice: 685.20 },
  MRVL: { name: 'Marvell Tech', sector: 'Semiconductors', basePrice: 72.15 },
  ON: { name: 'ON Semiconductor', sector: 'Semiconductors', basePrice: 75.80 },
  
  // Technology - Software
  CRM: { name: 'Salesforce', sector: 'Software', basePrice: 272.18 },
  ADBE: { name: 'Adobe', sector: 'Software', basePrice: 485.60 },
  ORCL: { name: 'Oracle', sector: 'Software', basePrice: 127.54 },
  NOW: { name: 'ServiceNow', sector: 'Software', basePrice: 785.30 },
  SNOW: { name: 'Snowflake', sector: 'Software', basePrice: 165.42 },
  PLTR: { name: 'Palantir', sector: 'Software', basePrice: 24.85 },
  PANW: { name: 'Palo Alto Networks', sector: 'Software', basePrice: 298.60 },
  CRWD: { name: 'CrowdStrike', sector: 'Software', basePrice: 328.45 },
  ZS: { name: 'Zscaler', sector: 'Software', basePrice: 198.20 },
  DDOG: { name: 'Datadog', sector: 'Software', basePrice: 125.80 },
  MDB: { name: 'MongoDB', sector: 'Software', basePrice: 285.40 },
  NET: { name: 'Cloudflare', sector: 'Software', basePrice: 92.15 },
  
  // Technology - Internet
  NFLX: { name: 'Netflix', sector: 'Internet', basePrice: 628.15 },
  ABNB: { name: 'Airbnb', sector: 'Internet', basePrice: 152.30 },
  UBER: { name: 'Uber', sector: 'Internet', basePrice: 78.45 },
  LYFT: { name: 'Lyft', sector: 'Internet', basePrice: 16.82 },
  DASH: { name: 'DoorDash', sector: 'Internet', basePrice: 125.60 },
  SNAP: { name: 'Snap Inc', sector: 'Internet', basePrice: 11.25 },
  PINS: { name: 'Pinterest', sector: 'Internet', basePrice: 32.80 },
  SPOT: { name: 'Spotify', sector: 'Internet', basePrice: 298.45 },
  RBLX: { name: 'Roblox', sector: 'Internet', basePrice: 42.30 },
  
  // Finance - Banks
  JPM: { name: 'JPMorgan Chase', sector: 'Finance', basePrice: 198.42 },
  BAC: { name: 'Bank of America', sector: 'Finance', basePrice: 37.85 },
  WFC: { name: 'Wells Fargo', sector: 'Finance', basePrice: 58.92 },
  C: { name: 'Citigroup', sector: 'Finance', basePrice: 62.45 },
  GS: { name: 'Goldman Sachs', sector: 'Finance', basePrice: 468.92 },
  MS: { name: 'Morgan Stanley', sector: 'Finance', basePrice: 98.45 },
  SCHW: { name: 'Charles Schwab', sector: 'Finance', basePrice: 72.30 },
  USB: { name: 'US Bancorp', sector: 'Finance', basePrice: 44.15 },
  PNC: { name: 'PNC Financial', sector: 'Finance', basePrice: 158.72 },
  TFC: { name: 'Truist Financial', sector: 'Finance', basePrice: 38.45 },
  
  // Finance - Payments & Fintech
  V: { name: 'Visa', sector: 'Payments', basePrice: 279.33 },
  MA: { name: 'Mastercard', sector: 'Payments', basePrice: 458.72 },
  PYPL: { name: 'PayPal', sector: 'Payments', basePrice: 62.85 },
  SQ: { name: 'Block Inc', sector: 'Payments', basePrice: 78.42 },
  COIN: { name: 'Coinbase', sector: 'Payments', basePrice: 225.67 },
  AFRM: { name: 'Affirm', sector: 'Payments', basePrice: 38.90 },
  SOFI: { name: 'SoFi', sector: 'Payments', basePrice: 8.45 },
  
  // Finance - Insurance & Asset Management
  BRK_B: { name: 'Berkshire Hathaway', sector: 'Finance', basePrice: 412.50 },
  BLK: { name: 'BlackRock', sector: 'Finance', basePrice: 825.30 },
  AXP: { name: 'American Express', sector: 'Finance', basePrice: 232.45 },
  
  // Healthcare - Pharma
  JNJ: { name: 'Johnson & Johnson', sector: 'Healthcare', basePrice: 156.42 },
  PFE: { name: 'Pfizer', sector: 'Healthcare', basePrice: 28.15 },
  MRK: { name: 'Merck', sector: 'Healthcare', basePrice: 128.30 },
  ABBV: { name: 'AbbVie', sector: 'Healthcare', basePrice: 168.45 },
  LLY: { name: 'Eli Lilly', sector: 'Healthcare', basePrice: 785.20 },
  BMY: { name: 'Bristol-Myers', sector: 'Healthcare', basePrice: 42.85 },
  AMGN: { name: 'Amgen', sector: 'Healthcare', basePrice: 285.60 },
  GILD: { name: 'Gilead Sciences', sector: 'Healthcare', basePrice: 72.45 },
  MRNA: { name: 'Moderna', sector: 'Healthcare', basePrice: 98.45 },
  BNTX: { name: 'BioNTech', sector: 'Healthcare', basePrice: 88.30 },
  
  // Healthcare - Medical Devices & Services
  UNH: { name: 'UnitedHealth', sector: 'Healthcare', basePrice: 527.83 },
  CVS: { name: 'CVS Health', sector: 'Healthcare', basePrice: 58.92 },
  ELV: { name: 'Elevance Health', sector: 'Healthcare', basePrice: 485.30 },
  CI: { name: 'Cigna', sector: 'Healthcare', basePrice: 328.45 },
  HUM: { name: 'Humana', sector: 'Healthcare', basePrice: 365.20 },
  ISRG: { name: 'Intuitive Surgical', sector: 'Healthcare', basePrice: 398.75 },
  MDT: { name: 'Medtronic', sector: 'Healthcare', basePrice: 82.30 },
  ABT: { name: 'Abbott Labs', sector: 'Healthcare', basePrice: 108.45 },
  TMO: { name: 'Thermo Fisher', sector: 'Healthcare', basePrice: 572.80 },
  DHR: { name: 'Danaher', sector: 'Healthcare', basePrice: 252.15 },
  
  // Consumer - Retail
  WMT: { name: 'Walmart', sector: 'Consumer', basePrice: 165.28 },
  COST: { name: 'Costco', sector: 'Consumer', basePrice: 738.45 },
  TGT: { name: 'Target', sector: 'Consumer', basePrice: 142.30 },
  HD: { name: 'Home Depot', sector: 'Consumer', basePrice: 358.92 },
  LOW: { name: 'Lowes', sector: 'Consumer', basePrice: 228.45 },
  TJX: { name: 'TJX Companies', sector: 'Consumer', basePrice: 98.72 },
  ROSS: { name: 'Ross Stores', sector: 'Consumer', basePrice: 145.30 },
  DG: { name: 'Dollar General', sector: 'Consumer', basePrice: 138.45 },
  DLTR: { name: 'Dollar Tree', sector: 'Consumer', basePrice: 142.80 },
  
  // Consumer - Food & Beverage
  KO: { name: 'Coca-Cola', sector: 'Consumer', basePrice: 62.45 },
  PEP: { name: 'PepsiCo', sector: 'Consumer', basePrice: 168.30 },
  MCD: { name: 'McDonalds', sector: 'Consumer', basePrice: 268.45 },
  SBUX: { name: 'Starbucks', sector: 'Consumer', basePrice: 92.15 },
  CMG: { name: 'Chipotle', sector: 'Consumer', basePrice: 2985.40 },
  YUM: { name: 'Yum Brands', sector: 'Consumer', basePrice: 138.72 },
  DPZ: { name: 'Dominos Pizza', sector: 'Consumer', basePrice: 428.30 },
  
  // Consumer - Apparel & Lifestyle
  NKE: { name: 'Nike', sector: 'Consumer', basePrice: 98.72 },
  LULU: { name: 'Lululemon', sector: 'Consumer', basePrice: 385.40 },
  
  // Energy
  XOM: { name: 'Exxon Mobil', sector: 'Energy', basePrice: 104.58 },
  CVX: { name: 'Chevron', sector: 'Energy', basePrice: 148.92 },
  COP: { name: 'ConocoPhillips', sector: 'Energy', basePrice: 112.45 },
  SLB: { name: 'Schlumberger', sector: 'Energy', basePrice: 48.72 },
  EOG: { name: 'EOG Resources', sector: 'Energy', basePrice: 125.30 },
  PXD: { name: 'Pioneer Natural', sector: 'Energy', basePrice: 228.45 },
  OXY: { name: 'Occidental', sector: 'Energy', basePrice: 62.18 },
  
  // Industrials
  CAT: { name: 'Caterpillar', sector: 'Industrials', basePrice: 342.80 },
  DE: { name: 'John Deere', sector: 'Industrials', basePrice: 398.45 },
  BA: { name: 'Boeing', sector: 'Industrials', basePrice: 178.92 },
  RTX: { name: 'RTX Corp', sector: 'Industrials', basePrice: 98.45 },
  LMT: { name: 'Lockheed Martin', sector: 'Industrials', basePrice: 458.30 },
  NOC: { name: 'Northrop Grumman', sector: 'Industrials', basePrice: 472.15 },
  GD: { name: 'General Dynamics', sector: 'Industrials', basePrice: 285.40 },
  GE: { name: 'GE Aerospace', sector: 'Industrials', basePrice: 158.72 },
  HON: { name: 'Honeywell', sector: 'Industrials', basePrice: 198.45 },
  UPS: { name: 'UPS', sector: 'Industrials', basePrice: 142.30 },
  FDX: { name: 'FedEx', sector: 'Industrials', basePrice: 258.92 },
  
  // Materials
  LIN: { name: 'Linde', sector: 'Materials', basePrice: 458.30 },
  APD: { name: 'Air Products', sector: 'Materials', basePrice: 248.45 },
  SHW: { name: 'Sherwin-Williams', sector: 'Materials', basePrice: 328.72 },
  FCX: { name: 'Freeport-McMoRan', sector: 'Materials', basePrice: 42.85 },
  NEM: { name: 'Newmont', sector: 'Materials', basePrice: 38.92 },
  
  // Utilities
  NEE: { name: 'NextEra Energy', sector: 'Utilities', basePrice: 72.45 },
  DUK: { name: 'Duke Energy', sector: 'Utilities', basePrice: 102.30 },
  SO: { name: 'Southern Company', sector: 'Utilities', basePrice: 78.92 },
  
  // Real Estate
  AMT: { name: 'American Tower', sector: 'Real Estate', basePrice: 198.45 },
  PLD: { name: 'Prologis', sector: 'Real Estate', basePrice: 128.30 },
  CCI: { name: 'Crown Castle', sector: 'Real Estate', basePrice: 108.72 },
  EQIX: { name: 'Equinix', sector: 'Real Estate', basePrice: 785.40 },
  
  // Communication
  T: { name: 'AT&T', sector: 'Communication', basePrice: 17.85 },
  VZ: { name: 'Verizon', sector: 'Communication', basePrice: 42.30 },
  TMUS: { name: 'T-Mobile', sector: 'Communication', basePrice: 168.45 },
  CMCSA: { name: 'Comcast', sector: 'Communication', basePrice: 42.72 },
  DIS: { name: 'Disney', sector: 'Communication', basePrice: 98.45 },
  WBD: { name: 'Warner Bros Discovery', sector: 'Communication', basePrice: 8.92 },
  NWSA: { name: 'News Corp', sector: 'Communication', basePrice: 28.15 },
  
  // Automotive
  F: { name: 'Ford', sector: 'Automotive', basePrice: 12.45 },
  GM: { name: 'General Motors', sector: 'Automotive', basePrice: 46.78 },
  RIVN: { name: 'Rivian', sector: 'Automotive', basePrice: 14.82 },
  LCID: { name: 'Lucid Motors', sector: 'Automotive', basePrice: 3.45 },
  
  // Crypto-adjacent
  MSTR: { name: 'MicroStrategy', sector: 'Technology', basePrice: 1542.30 },
  MARA: { name: 'Marathon Digital', sector: 'Technology', basePrice: 18.45 },
  RIOT: { name: 'Riot Platforms', sector: 'Technology', basePrice: 12.30 },
};

const DEFAULT_WATCHLIST = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMD'];
const FINNHUB_API_URL = 'https://finnhub.io/api/v1';

// Generate simulated price data
const generateSimulatedPrice = (basePrice) => {
  const volatility = 0.02 + Math.random() * 0.02;
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
  return {
    price: +(basePrice + change).toFixed(2),
    change: +((change / basePrice) * 100).toFixed(2),
    previousClose: basePrice,
  };
};

const generateChartData = () => {
  const now = new Date();
  let sp500 = 5280;
  let nasdaq = 16750;
  
  return Array.from({ length: 24 }, (_, i) => {
    sp500 += (Math.random() - 0.48) * 15;
    nasdaq += (Math.random() - 0.48) * 25;
    return {
      time: `${(now.getHours() - 23 + i + 24) % 24}:00`,
      sp500: +sp500.toFixed(2),
      nasdaq: +nasdaq.toFixed(2),
      sentiment: +(0.5 + Math.sin(i / 5) * 0.3 + (Math.random() - 0.5) * 0.1).toFixed(2),
    };
  });
};

const generateNewsFromWatchlist = (watchlist, stockPrices) => {
  const newsTemplates = [
    { template: '{company} beats Q4 earnings expectations by 15%', sentiment: 'positive', impact: 'high' },
    { template: '{company} announces $2B AI infrastructure investment', sentiment: 'positive', impact: 'high' },
    { template: '{company} faces antitrust investigation in EU', sentiment: 'negative', impact: 'medium' },
    { template: 'Wall Street upgrades {company} to "Strong Buy"', sentiment: 'positive', impact: 'medium' },
    { template: '{company} expands partnership with major cloud provider', sentiment: 'positive', impact: 'medium' },
    { template: '{company} CEO addresses shareholder concerns on growth', sentiment: 'neutral', impact: 'low' },
    { template: '{company} reports record quarterly revenue of $45B', sentiment: 'positive', impact: 'high' },
    { template: 'Unusual options activity detected in {company}', sentiment: 'neutral', impact: 'medium' },
    { template: '{company} announces 10% workforce reduction', sentiment: 'negative', impact: 'high' },
    { template: 'Institutional investors increase {company} holdings', sentiment: 'positive', impact: 'medium' },
  ];
  
  const sources = ['Reuters', 'Bloomberg', 'WSJ', 'CNBC', 'Financial Times', 'MarketWatch', 'Barrons', 'Yahoo Finance'];
  const times = ['2m ago', '8m ago', '15m ago', '32m ago', '1h ago', '2h ago', '3h ago', '4h ago'];
  
  return watchlist.slice(0, 8).map((symbol, i) => {
    const stock = STOCK_DATABASE[symbol];
    const priceData = stockPrices[symbol];
    const template = newsTemplates[i % newsTemplates.length];
    
    // Bias news sentiment based on actual price movement if available
    let sentiment = template.sentiment;
    if (priceData?.change) {
      if (priceData.change > 2) sentiment = 'positive';
      else if (priceData.change < -2) sentiment = 'negative';
    }
    
    return {
      id: i + 1,
      headline: template.template.replace('{company}', stock?.name || symbol),
      source: sources[i % sources.length],
      time: times[i],
      sentiment,
      impact: template.impact,
      category: stock?.sector || 'Market',
      symbol,
    };
  });
};

const SentimentBadge = ({ sentiment }) => {
  const config = {
    positive: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: TrendingUp },
    negative: { bg: 'bg-red-500/20', text: 'text-red-400', icon: TrendingDown },
    neutral: { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: Activity },
  };
  const { bg, text, icon: Icon } = config[sentiment] || config.neutral;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon size={10} />
      {sentiment}
    </span>
  );
};

const ImpactBadge = ({ impact }) => {
  const colors = { high: 'text-orange-400', medium: 'text-yellow-400', low: 'text-slate-500' };
  return <span className={`text-xs font-medium ${colors[impact] || colors.low}`}>{(impact || 'low').toUpperCase()}</span>;
};

export default function MarketIntelDashboard() {
  // State
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('marketIntelWatchlist');
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });
  
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('finnhubApiKey') || '');
  const [stockPrices, setStockPrices] = useState({});
  const [chartData, setChartData] = useState(generateChartData());
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLiveData, setIsLiveData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: `Hello! I'm your AI Market Intelligence Assistant. I'm tracking ${Object.keys(STOCK_DATABASE).length} stocks across all major sectors. Ask me about market trends, your watchlist performance, sector analysis, or investment strategies. What would you like to explore?` }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('marketIntelWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch real stock data from Finnhub
  const fetchRealPrices = useCallback(async () => {
    if (!apiKey) return false;
    
    try {
      const newPrices = {};
      const promises = watchlist.map(async (symbol) => {
        try {
          const response = await fetch(
            `${FINNHUB_API_URL}/quote?symbol=${symbol}&token=${apiKey}`
          );
          if (!response.ok) throw new Error('API error');
          const data = await response.json();
          
          if (data.c && data.c > 0) {
            const change = ((data.c - data.pc) / data.pc) * 100;
            newPrices[symbol] = {
              ...STOCK_DATABASE[symbol],
              symbol,
              price: data.c,
              change: +change.toFixed(2),
              previousClose: data.pc,
              high: data.h,
              low: data.l,
              open: data.o,
              sentiment: 0.5 + (change / 20),
              volume: `${(Math.random() * 50 + 10).toFixed(1)}M`,
              isLive: true,
            };
          }
        } catch (err) {
          console.log(`Failed to fetch ${symbol}:`, err);
        }
      });
      
      await Promise.all(promises);
      
      if (Object.keys(newPrices).length > 0) {
        setStockPrices(prev => ({ ...prev, ...newPrices }));
        setIsLiveData(true);
        setLastUpdate(new Date());
        return true;
      }
    } catch (err) {
      console.error('Failed to fetch real prices:', err);
    }
    return false;
  }, [apiKey, watchlist]);

  // Generate simulated prices
  const generateSimulatedPrices = useCallback(() => {
    const newPrices = {};
    watchlist.forEach(symbol => {
      const stock = STOCK_DATABASE[symbol];
      if (stock) {
        const priceData = generateSimulatedPrice(stock.basePrice);
        newPrices[symbol] = {
          ...stock,
          symbol,
          ...priceData,
          sentiment: 0.5 + (priceData.change / 10) + (Math.random() - 0.5) * 0.2,
          volume: `${(Math.random() * 50 + 10).toFixed(1)}M`,
          isLive: false,
        };
      }
    });
    setStockPrices(newPrices);
    setIsLiveData(false);
  }, [watchlist]);

  // Update prices (try real first, fallback to simulated)
  const updatePrices = useCallback(async () => {
    setIsLoading(true);
    const gotRealData = await fetchRealPrices();
    if (!gotRealData) {
      generateSimulatedPrices();
    }
    setIsLoading(false);
  }, [fetchRealPrices, generateSimulatedPrices]);

  // Initial load and periodic updates
  useEffect(() => {
    updatePrices();
    const interval = setInterval(() => {
      updatePrices();
      setCurrentTime(new Date());
    }, apiKey ? 15000 : 3000); // Slower updates for real API to avoid rate limits
    return () => clearInterval(interval);
  }, [updatePrices, apiKey]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await updatePrices();
    setChartData(generateChartData());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Save API key
  const saveApiKey = () => {
    const key = tempApiKey.trim();
    setApiKey(key);
    localStorage.setItem('finnhubApiKey', key);
    setShowSettings(false);
    if (key) {
      updatePrices();
    }
  };

  // Add/remove stocks
  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol) && STOCK_DATABASE[symbol]) {
      setWatchlist(prev => [...prev, symbol]);
    }
    setSearchQuery('');
    setShowSearch(false);
  };

  const removeFromWatchlist = (symbol) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toUpperCase();
    return Object.entries(STOCK_DATABASE)
      .filter(([symbol, data]) => 
        (symbol.includes(query) || data.name.toUpperCase().includes(query) || data.sector.toUpperCase().includes(query)) &&
        !watchlist.includes(symbol)
      )
      .slice(0, 8);
  }, [searchQuery, watchlist]);

  // Derived data
  const marketData = useMemo(() => {
    return watchlist.map(symbol => stockPrices[symbol]).filter(Boolean);
  }, [watchlist, stockPrices]);

  const newsData = useMemo(() => generateNewsFromWatchlist(watchlist, stockPrices), [watchlist, stockPrices]);

  const sectorData = useMemo(() => {
    const sectors = {};
    marketData.forEach(stock => {
      const sector = stock.sector || 'Other';
      sectors[sector] = (sectors[sector] || 0) + 1;
    });
    const colors = ['#00D4FF', '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A855F7', '#F472B6', '#FB923C'];
    return Object.entries(sectors).map(([name, count], i) => ({
      name,
      value: Math.round((count / marketData.length) * 100),
      color: colors[i % colors.length],
    }));
  }, [marketData]);

  const aiInsights = useMemo(() => {
    const bullish = marketData.filter(s => s.change > 1).length;
    const bearish = marketData.filter(s => s.change < -1).length;
    const topGainer = marketData.reduce((a, b) => (a?.change || -999) > (b?.change || -999) ? a : b, null);
    const topLoser = marketData.reduce((a, b) => (a?.change || 999) < (b?.change || 999) ? a : b, null);
    const avgChange = marketData.length > 0 ? marketData.reduce((a, b) => a + (b.change || 0), 0) / marketData.length : 0;
    
    return [
      { 
        type: bullish > bearish ? 'opportunity' : 'risk', 
        title: bullish > bearish ? 'Bullish momentum detected' : 'Mixed market signals',
        detail: `${bullish} of ${marketData.length} stocks positive. ${topGainer?.symbol || 'N/A'} leads at ${topGainer?.change?.toFixed(2) || 0}%. Portfolio avg: ${avgChange.toFixed(2)}%`,
        confidence: Math.min(95, 60 + Math.abs(bullish - bearish) * 5)
      },
      { 
        type: 'trend', 
        title: 'Sector concentration analysis',
        detail: `Heavy in ${sectorData[0]?.name || 'Tech'} (${sectorData[0]?.value || 0}%). ${sectorData.length < 4 ? 'Consider diversifying across more sectors.' : 'Good sector diversity.'}`,
        confidence: 75 + Math.min(20, sectorData.length * 3)
      },
      { 
        type: topLoser?.change < -3 ? 'risk' : 'opportunity',
        title: topLoser?.change < -3 ? 'High volatility alert' : 'Portfolio stability',
        detail: topLoser?.change < -3 
          ? `${topLoser?.symbol} down ${Math.abs(topLoser?.change).toFixed(2)}%. Consider stop-loss or averaging down.`
          : `Portfolio within normal volatility. ${topGainer?.symbol} showing strength for potential add.`,
        confidence: 65 + Math.floor(Math.random() * 25)
      },
    ];
  }, [marketData, sectorData]);

  // Chat handler
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const topPerformer = marketData.reduce((a, b) => (a?.change || -999) > (b?.change || -999) ? a : b, null);
      const worstPerformer = marketData.reduce((a, b) => (a?.change || 999) < (b?.change || 999) ? a : b, null);
      const avgChange = marketData.length > 0 ? (marketData.reduce((a, b) => a + (b.change || 0), 0) / marketData.length).toFixed(2) : 0;
      
      const responses = [
        `Your ${watchlist.length}-stock watchlist is ${avgChange > 0 ? 'up' : 'down'} ${Math.abs(avgChange)}% on average. ${topPerformer?.symbol} is your star performer (+${topPerformer?.change?.toFixed(2)}%), while ${worstPerformer?.symbol} is lagging (${worstPerformer?.change?.toFixed(2)}%). ${isLiveData ? 'This is real-time market data.' : 'Note: Using simulated data. Add a Finnhub API key in Settings for live quotes.'}`,
        `Sector breakdown: ${sectorData.map(s => `${s.name} ${s.value}%`).join(', ')}. ${sectorData[0]?.value > 50 ? `You're heavily concentrated in ${sectorData[0]?.name}. Consider adding positions in ${sectorData.length > 1 ? sectorData[sectorData.length-1].name : 'Healthcare or Consumer'} for balance.` : 'Good diversification across sectors.'}`,
        `Technical view: ${topPerformer?.symbol} shows bullish momentum with ${topPerformer?.change?.toFixed(2)}% gain. Volume patterns suggest ${marketData.filter(s => s.change > 0).length > marketData.length / 2 ? 'institutional accumulation' : 'mixed institutional sentiment'}. Key support levels holding for most positions.`,
        `Portfolio risk assessment: ${worstPerformer?.change < -5 ? `High volatility in ${worstPerformer?.symbol} (${worstPerformer?.change?.toFixed(2)}%). Consider position sizing.` : 'Volatility within normal range.'} Your ${sectorData[0]?.name} exposure is ${sectorData[0]?.value > 40 ? 'elevated' : 'balanced'}. ${marketData.filter(s => s.change > 2).length} stocks showing strong momentum.`,
      ];
      
      const response = { role: 'assistant', content: responses[Math.floor(Math.random() * responses.length)] };
      setChatMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  }, [inputMessage, watchlist, marketData, sectorData, isLiveData]);

  const avgSentiment = marketData.length > 0 
    ? (marketData.reduce((acc, s) => acc + Math.min(1, Math.max(0, s.sentiment || 0.5)), 0) / marketData.length * 100).toFixed(0)
    : '50';
  const topMover = marketData.reduce((a, b) => Math.abs(a?.change || 0) > Math.abs(b?.change || 0) ? a : b, { symbol: 'N/A', change: 0 });

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .glow { box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
        .card-gradient { background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%); }
        .pulse-dot { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .scroll-fade { mask-image: linear-gradient(to bottom, black 90%, transparent 100%); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-slate-800 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Finnhub API Key (Free)</label>
                <input
                  type="text"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Get a free API key at <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">finnhub.io</a> for real-time stock data.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveApiKey}
                  className="flex-1 px-4 py-2 bg-cyan-500 rounded-xl text-sm font-medium hover:bg-cyan-600 transition-colors"
                >
                  Save
                </button>
              </div>
              
              {apiKey && (
                <button
                  onClick={() => {
                    setApiKey('');
                    setTempApiKey('');
                    localStorage.removeItem('finnhubApiKey');
                    setShowSettings(false);
                  }}
                  className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-colors"
                >
                  Remove API Key
                </button>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500">
                <strong>Available stocks:</strong> {Object.keys(STOCK_DATABASE).length} across Technology, Finance, Healthcare, Energy, Consumer, and more.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/50 bg-[#0a0e17]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center glow">
                  <Brain size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">Market<span className="text-cyan-400">Intel</span></h1>
                  <p className="text-[10px] text-slate-500 -mt-0.5">AI-Powered Analysis <span className="text-cyan-400">by Jean Huang</span></p>
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setTempApiKey(apiKey); setShowSettings(true); }}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                title="Settings"
              >
                <Settings size={16} className="text-slate-400" />
              </button>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                title="Refresh data"
              >
                <RefreshCw size={16} className={`text-slate-400 ${isRefreshing ? 'spin' : ''}`} />
              </button>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                isLiveData 
                  ? 'bg-emerald-500/10 border-emerald-500/20' 
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                {isLiveData ? <Wifi size={12} className="text-emerald-400" /> : <WifiOff size={12} className="text-yellow-400" />}
                <span className={`text-xs font-medium ${isLiveData ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {isLiveData ? 'Live Data' : 'Simulated'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">{Object.keys(STOCK_DATABASE).length} Stocks</p>
                <p className="text-sm font-semibold mono">{currentTime.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-5">
            {/* Key Metrics */}
            <div className="col-span-12 grid grid-cols-4 gap-4">
              {[
                { label: 'S&P 500', value: chartData[chartData.length - 1]?.sp500.toLocaleString() || '5,284', change: '+1.24%', positive: true, icon: TrendingUp },
                { label: 'Market Sentiment', value: `${avgSentiment}%`, change: parseInt(avgSentiment) > 50 ? 'Bullish' : 'Bearish', positive: parseInt(avgSentiment) > 50, icon: Brain },
                { label: 'Top Mover', value: topMover.symbol, change: `${topMover.change > 0 ? '+' : ''}${topMover.change?.toFixed(2) || 0}%`, positive: topMover.change > 0, icon: Zap },
                { label: 'Watchlist', value: `${watchlist.length} stocks`, change: `${marketData.filter(s => s.change > 0).length} up`, positive: true, icon: Star },
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

            {/* Chart */}
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
                  <YAxis yAxisId="left" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 20', 'dataMax + 20']} />
                  <YAxis yAxisId="right" orientation="right" stroke="#A855F7" fontSize={10} tickLine={false} axisLine={false} domain={[0, 1]} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }} labelStyle={{ color: '#94a3b8' }} />
                  <Area type="monotone" dataKey="sp500" stroke="#00D4FF" strokeWidth={2} fill="url(#colorSp)" yAxisId="left" />
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
              {sectorData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={sectorData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {sectorData.slice(0, 6).map((sector, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: sector.color }} />
                        <span className="text-xs text-slate-400 truncate">{sector.name}</span>
                        <span className="text-xs font-medium ml-auto">{sector.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-slate-500 text-sm">Add stocks to see allocation</div>
              )}
            </div>

            {/* Watchlist */}
            <div className="col-span-5 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-cyan-400" />
                  <h2 className="text-lg font-semibold">Watchlist</h2>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{watchlist.length}</span>
                </div>
                <button onClick={() => setShowSearch(!showSearch)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors">
                  <Plus size={14} />
                  Add
                </button>
              </div>

              {showSearch && (
                <div className="mb-4 relative">
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2">
                    <Search size={16} className="text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 100+ stocks..."
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                      autoFocus
                    />
                    <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                      <X size={16} className="text-slate-500 hover:text-white" />
                    </button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden z-10 max-h-64 overflow-y-auto">
                      {searchResults.map(([symbol, data]) => (
                        <button
                          key={symbol}
                          onClick={() => addToWatchlist(symbol)}
                          className="w-full flex items-center justify-between p-3 hover:bg-slate-800 transition-colors text-left"
                        >
                          <div>
                            <span className="font-semibold text-sm">{symbol}</span>
                            <span className="text-xs text-slate-500 ml-2">{data.name}</span>
                          </div>
                          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{data.sector}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 scroll-fade max-h-[280px] overflow-y-auto pr-2">
                {marketData.length > 0 ? marketData.map((stock, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{stock.symbol}</span>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{stock.sector}</span>
                        {stock.isLive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Live data" />}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold mono text-sm">${stock.price?.toFixed(2)}</p>
                      <p className={`text-xs font-medium ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}%
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromWatchlist(stock.symbol)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all"
                    >
                      <X size={14} className="text-red-400" />
                    </button>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-slate-500">
                    <Star size={32} className="mb-2 opacity-50" />
                    <p className="text-sm">No stocks in watchlist</p>
                    <p className="text-xs">Click "Add" to get started</p>
                  </div>
                )}
              </div>
            </div>

            {/* News */}
            <div className="col-span-7 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper size={18} className="text-cyan-400" />
                <h2 className="text-lg font-semibold">AI-Analyzed News</h2>
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
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full ml-2">Based on your watchlist</span>
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
              <h2 className="text-lg font-semibold mb-4">Technical Analysis</h2>
              <p className="text-slate-400 text-sm mb-6">NASDAQ Composite with ML signal detection</p>
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
              {[
                { name: 'RSI (14)', value: 58 + Math.floor(Math.random() * 15), signal: 'Bullish', desc: 'Momentum building' },
                { name: 'MACD', value: 68 + Math.floor(Math.random() * 12), signal: 'Bullish', desc: 'Positive crossover' },
                { name: 'Bollinger', value: 42 + Math.floor(Math.random() * 20), signal: 'Neutral', desc: 'Mid-band range' },
                { name: 'SMA 50/200', value: 78 + Math.floor(Math.random() * 10), signal: 'Bullish', desc: 'Golden cross' },
              ].map((ind, i) => (
                <div key={i} className="card-gradient rounded-xl border border-slate-800/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{ind.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ind.signal === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {ind.signal}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${ind.signal === 'Bullish' ? 'bg-emerald-400' : 'bg-yellow-400'}`} style={{ width: `${ind.value}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">{ind.desc}</span>
                    <span className="text-xs mono text-slate-400">{ind.value}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-span-6 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <h3 className="font-semibold mb-4">Volume Analysis</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData.slice(-12)}>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }} />
                  <Bar dataKey="sp500" radius={[4, 4, 0, 0]}>
                    {chartData.slice(-12).map((_, index) => (
                      <Cell key={index} fill={index % 2 === 0 ? '#00D4FF' : '#A855F7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="col-span-6 card-gradient rounded-2xl border border-slate-800/50 p-6">
              <h3 className="font-semibold mb-4">Signal Summary</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <p className="text-2xl font-bold text-emerald-400">{marketData.filter(s => s.change > 0.5).length}</p>
                  <p className="text-xs text-slate-500">Bullish</p>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <p className="text-2xl font-bold text-yellow-400">{marketData.filter(s => Math.abs(s.change) <= 0.5).length}</p>
                  <p className="text-xs text-slate-500">Neutral</p>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                  <p className="text-2xl font-bold text-red-400">{marketData.filter(s => s.change < -0.5).length}</p>
                  <p className="text-xs text-slate-500">Bearish</p>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  <span className="font-medium text-sm">Overall: {parseInt(avgSentiment) > 55 ? 'Bullish' : parseInt(avgSentiment) > 45 ? 'Neutral' : 'Bearish'}</span>
                </div>
                <p className="text-xs text-slate-400">Based on {watchlist.length} stocks. {isLiveData ? 'Real-time data.' : 'Simulated data.'}</p>
              </div>
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
                    <p className="text-xs text-slate-500">Tracking {watchlist.length} stocks • {Object.keys(STOCK_DATABASE).length} available • {isLiveData ? 'Live data' : 'Simulated'}</p>
                  </div>
                </div>
              </div>
              <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-slate-800/50 border border-slate-700/50'}`}>
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
                    placeholder="Ask about your portfolio, market trends, or trading strategies..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button onClick={handleSendMessage} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Send size={16} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800/50 mt-12 py-6">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between text-xs text-slate-500">
          <p>Built with React, Recharts & Finnhub API • <span className="text-cyan-400">Portfolio Project by Jean Huang</span></p>
          <p>{Object.keys(STOCK_DATABASE).length} stocks • {isLiveData ? 'Real-time data' : 'Simulated mode'}</p>
        </div>
      </footer>
    </div>
  );
}
