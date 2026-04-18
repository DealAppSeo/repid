"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const STATIC_ASSETS = [
  { id: 'gold', name: 'Gold (XAU)', price: 2350.25 },
  { id: 'silver', name: 'Silver (XAG)', price: 28.50 },
  { id: 'aapl', name: 'Apple (AAPL)', price: 213.00 },
  { id: 'nvda', name: 'Nvidia (NVDA)', price: 875.00 },
  { id: 'spy', name: 'S&P 500 (SPY)', price: 524.00 }
];

const COINS = 'bitcoin,ethereum,solana,binancecoin,ripple,tether';

export default function TradePage() {
  const [balance, setBalance] = useState<number>(10000);
  const [agentName, setAgentName] = useState('Agent');
  const [privateId, setPrivateId] = useState('');
  const [score, setScore] = useState(0);
  const [assets, setAssets] = useState<any[]>([]);
  
  const [numTrades, setNumTrades] = useState<number>(0);
  const [unlockMessage, setUnlockMessage] = useState('');
  const [trustMarketEmail, setTrustMarketEmail] = useState('');
  
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  const [toast, setToast] = useState<{message: string, isSuccess: boolean} | null>(null);
  const [shareData, setShareData] = useState<{agent: string, score: number, action: string, asset: string, isSophiaBeat: boolean} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAgentName(localStorage.getItem('repid_agent_name') || 'Agent');
      setPrivateId(localStorage.getItem('repid_private_id') || crypto.randomUUID());
      const bal = localStorage.getItem('repid_paper_balance');
      if (bal) setBalance(parseFloat(bal));
      const trades = localStorage.getItem('repid_num_trades');
      if (trades) setNumTrades(parseInt(trades));
    }
  }, []);

  useEffect(() => {
    if (agentName !== 'Agent') {
      fetchScore();
      fetchLeaderboard();
    }
  }, [agentName, numTrades]);

  const fetchScore = async () => {
    try {
      const engineUrl = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
      const res = await fetch(`${engineUrl}/api/v1/repid/${agentName}`);
      if (res.ok) {
        const data = await res.json();
        setScore(data.repid_score || 0);
      }
    } catch {}
  };

  const fetchLeaderboard = async () => {
    try {
      const { data } = await supabase.from('repid_agents').select('agent_name, current_repid').order('current_repid', { ascending: false });
      if (data) {
        setLeaderboard(data.slice(0, 5));
        const idx = data.findIndex(x => x.agent_name === agentName);
        if (idx !== -1) setUserRank(idx + 1);
      }
    } catch {}
  };

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${COINS}&vs_currencies=usd`);
        const data = await res.json();
        const cryptoAssets = [
          { id: 'btc', name: 'Bitcoin (BTC)', price: data.bitcoin?.usd || 65000 },
          { id: 'eth', name: 'Ethereum (ETH)', price: data.ethereum?.usd || 3500 },
          { id: 'sol', name: 'Solana (SOL)', price: data.solana?.usd || 150 },
          { id: 'bnb', name: 'Binance Coin (BNB)', price: data.binancecoin?.usd || 600 },
          { id: 'xrp', name: 'Ripple (XRP)', price: data.ripple?.usd || 0.60 },
          { id: 'usdt', name: 'Tether (USDT)', price: data.tether?.usd || 1.00 },
        ];
        setAssets([...cryptoAssets, ...STATIC_ASSETS]);
      } catch {
        setAssets([
          { id: 'btc', name: 'Bitcoin (BTC)', price: 65400 },
          { id: 'eth', name: 'Ethereum (ETH)', price: 3450 },
          ...STATIC_ASSETS
        ]);
      }
    };
    fetchCrypto();
  }, []);

  const handleTrade = async (action: 'BUY' | 'SELL', asset: any) => {
    const currTrades = numTrades + 1;
    setNumTrades(currTrades);
    if (typeof window !== 'undefined') localStorage.setItem('repid_num_trades', currTrades.toString());

    // Execute Phase 1: Real API check
    let isApproved = false;
    try {
      const engineUrl = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
      const proofRes = await fetch(`${engineUrl}/api/v1/prove-repid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentName, requester_pubkey: privateId, requested_tier: "envelope" })
      });
      if (proofRes.ok) {
        const data = await proofRes.json();
        if (data.payload?.constitutional_compliance === true || Boolean(data.proof)) {
          isApproved = true;
        }
      }
    } catch {}

    const tradeAmount = Math.min(1000, balance * 0.1) || 1000;
    const newBal = action === 'BUY' ? balance - tradeAmount : balance + tradeAmount;
    
    // Check SOPHIA portfolio threshold
    const justBeatSophia = newBal > 9347 && balance <= 9347;

    setBalance(newBal);
    if (typeof window !== 'undefined') localStorage.setItem('repid_paper_balance', newBal.toString());

    if (justBeatSophia) {
      setToast({ message: "🏆 You beat SOPHIA's portfolio! Share this moment.", isSuccess: true });
    } else if (isApproved) {
      setToast({ message: "HAL Approved ✓ Constitutional decision. +15 RepID", isSuccess: true });
      setScore(prev => prev + 15);
    } else {
      setToast({ message: "HAL Vetoed ✗ Overconfident claim. -5 RepID", isSuccess: false });
      setScore(prev => prev - 5);
    }

    // Delayed revealing layers (Phase 3)
    if (currTrades === 3) setUnlockMessage("Your agent is learning your style. 7 more decisions until your first RepID milestone.");
    if (currTrades === 6) setUnlockMessage("Something is building... your agent's constitutional record is taking shape.");
    if (currTrades === 3 || currTrades === 6) {
      setTimeout(() => setUnlockMessage(''), 5000);
    }

    setTimeout(() => {
      setToast(null);
      setShareData({
        agent: agentName,
        score: score + (isApproved ? 15 : -5),
        action,
        asset: asset.name,
        isSophiaBeat: justBeatSophia
      });
    }, 4000);
  };

  const tweetText = shareData 
    ? shareData.isSophiaBeat 
      ? `I just beat SOPHIA — an AI agent with 1,712 decisions and 97.1% accuracy — in paper trading. My agent ${shareData.agent} has RepID ${shareData.score}. This is just the beginning. repid.dev`
      : `My AI agent ${shareData.agent} just made its ${numTrades}th constitutional decision. RepID: ${shareData.score}. SOPHIA has 10,000 — I'm ${Math.min(100, Math.round((shareData.score/10000)*100))}% of the way there. Zero hallucinations. Can you beat me? repid.dev`
    : '';

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tweetText);
      alert('Copied to clipboard!');
    }
  };

  const handleTrustMarketJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') localStorage.setItem('trustmarket_email', trustMarketEmail);
    alert('Email securely captured for early access.');
  };

  const getTierBadge = (val: number) => {
    if (val >= 5000) return <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-mono">AUTONOMOUS</span>;
    if (val >= 1000) return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded font-mono">EARNING_AUTONOMY</span>;
    return <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono">CUSTODIED_DBT</span>;
  }

  const sophiaProgress = Math.min(100, Math.max(0, (score / 10000) * 100));

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center pt-8 px-6 pb-24 relative overflow-x-hidden">
      
      {/* Dynamic Unlock Toast */}
      {unlockMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-xl bg-purple-900/90 text-white font-mono text-sm shadow-2xl animate-in fade-in zoom-in duration-300 text-center w-[90%] max-w-md">
          {unlockMessage}
        </div>
      )}

      <header className="max-w-4xl w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono text-white break-all">{agentName}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span className="text-gray-400">Balance: <span className="text-green-400 font-bold">${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></span>
            <span className="text-gray-400">RepID: <span className="text-amber-400 font-bold">{score}</span></span>
            <span className="text-gray-400">Decisions: <span className="text-gray-200 font-bold">{numTrades}</span></span>
          </div>
        </div>
        <Link href="/" className="text-sm bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg hover:border-gray-600 transition-colors">
          Exit Arena
        </Link>
      </header>

      {/* Phase 2: SOPHIA Challenge Card */}
      <div className="max-w-4xl w-full bg-gradient-to-r from-gray-900 to-indigo-900/30 border border-indigo-500/30 p-6 rounded-2xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">Beat SOPHIA</h2>
            <p className="text-gray-400 text-sm">SOPHIA is the benchmark. Every constitutional decision moves you closer.</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-6 text-sm text-center md:text-right">
            <div>
              <div className="text-gray-500 font-mono text-xs mb-1">SOPHIA RepID</div>
              <div className="font-bold text-white text-lg">10,000</div>
            </div>
            <div>
              <div className="text-gray-500 font-mono text-xs mb-1">SOPHIA PRTZ</div>
              <div className="font-bold text-green-400 text-lg">$9,347</div>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3 mb-2 flex overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-amber-400 h-3 transition-all duration-1000 ease-out" style={{ width: `${sophiaProgress}%` }}></div>
        </div>
        <div className="flex justify-between text-xs font-mono text-gray-500">
          <span>{score} RepID</span>
          <span>10,000</span>
        </div>
      </div>

      {/* Phase 6: Leaderboard Preview */}
      <div className="max-w-4xl w-full bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-12">
        <h3 className="font-bold text-lg mb-4 text-gray-300">Global Leaderboard Top 5</h3>
        {leaderboard.length === 0 ? (
          <div className="text-gray-500 text-sm animate-pulse">Syncing nodes...</div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((lb, i) => (
              <div key={i} className={`flex justify-between items-center p-3 rounded border ${lb.agent_name === agentName ? 'bg-amber-900/20 border-amber-500/50' : 'bg-gray-800/30 border-gray-800'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-gray-500">#{i + 1}</span>
                  <span className={`font-bold ${lb.agent_name === agentName ? 'text-amber-400' : 'text-gray-200'}`}>{lb.agent_name}</span>
                </div>
                <div className="flex items-center gap-4">
                  {getTierBadge(lb.current_repid || 0)}
                  <span className="font-mono">{lb.current_repid}</span>
                </div>
              </div>
            ))}
            {userRank && userRank > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-center text-amber-500 font-mono">
                You are ranked #{userRank} globally
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-2xl transition-all animate-bounce w-[90%] max-w-sm text-center ${toast.isSuccess ? 'bg-green-500 text-gray-950' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      {/* Share Overlay */}
      {shareData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-6 backdrop-blur-sm">
          <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.15)] scale-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-4 text-center">{shareData.isSophiaBeat ? 'SOPHIA DEFEATED 👑' : 'Broadcast Proof'}</h2>
            <div className="bg-gray-800 p-5 rounded-xl text-gray-200 text-sm mb-6 leading-relaxed font-mono whitespace-pre-wrap">
              {tweetText}
            </div>
            <div className="flex flex-col gap-3">
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`} target="_blank" rel="noopener noreferrer" className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-center font-bold py-3 rounded-xl transition-colors">
                Share on X
              </a>
              <button onClick={copyToClipboard} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors">
                Copy text
              </button>
              <button onClick={() => setShareData(null)} className="mt-2 text-gray-400 hover:text-white text-sm transition-colors">
                Keep Trading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assets Arena */}
      <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {assets.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 animate-pulse mt-12 font-mono">Loading market feeds...</div>
        ) : (
          assets.map(a => (
            <div key={a.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 p-5 rounded-xl transition-colors flex flex-col justify-between h-40 group relative overflow-hidden">
              <div className="mb-4 relative z-10">
                <h3 className="font-bold text-gray-200 mb-1">{a.name}</h3>
                <div className="text-xl font-mono">${typeof a.price === 'number' ? a.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : a.price}</div>
              </div>
              <div className="flex gap-3 mt-auto relative z-10">
                <button 
                  onClick={() => handleTrade('BUY', a)}
                  className="flex-1 bg-green-900/30 text-green-400 hover:bg-green-600 hover:text-white border border-green-800 hover:border-green-600 rounded-lg py-2 font-bold transition-all focus:ring focus:ring-green-900">
                  BUY
                </button>
                <button 
                  onClick={() => handleTrade('SELL', a)}
                  className="flex-1 bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white border border-red-800 hover:border-red-600 rounded-lg py-2 font-bold transition-all focus:ring focus:ring-red-900">
                  SELL
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Phase 3 & 4: Upgrades & Hidden Reveals */}
      <div className="max-w-3xl w-full mt-auto flex flex-col gap-6">
        
        {numTrades >= 10 && (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start gap-4">
              <div className="text-2xl mt-1">🔰</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Your agent now has a verified behavioral record.</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">This record follows your agent everywhere in the agentic economy. Other networks query this before routing transactions.</p>
                <Link href="/learn" className="text-amber-500 text-sm font-bold hover:text-amber-400">Discover how RepID secures Web3 →</Link>
              </div>
            </div>
          </div>
        )}

        {numTrades >= 15 && (
          <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-lg mb-2 text-purple-400">TrustMarket.dev is coming.</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">Agents with specialized skills can rent their capabilities to other users. Want early access to list your agent?</p>
            <form onSubmit={handleTrustMarketJoin} className="flex gap-2">
              <input type="email" required placeholder="Enter email" value={trustMarketEmail} onChange={e=>setTrustMarketEmail(e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-4 py-2 text-sm flex-1"/>
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-purple-500 transition">Get List Access</button>
            </form>
          </div>
        )}

        {/* Dynamic FOMO Upgrade Prompt */}
        <div className="bg-blue-900/10 border border-blue-900/50 hover:border-blue-700/50 p-6 rounded-xl transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4 relative z-10">
            Right now SOPHIA is watching <span className="font-bold text-white">14 live market signals</span> including congressional trading data, Polymarket prediction markets, and on-chain whale movements. You are trading with price data only. Ready to see what SOPHIA sees?
          </p>
          <a href="https://trusttrader.dev" target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-bold text-blue-400 hover:text-blue-300 relative z-10 transition-colors">
            Unlock Real Signals at TrustTrader.dev →
          </a>
        </div>

        <a href="https://kraken.com/ref/placeholder" target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-900 border border-gray-800 text-gray-400 hover:text-white px-6 py-4 rounded-xl transition-colors text-center">
          Ready to trade real markets? <span className="font-bold">Open a Kraken account →</span>
        </a>
      </div>
    </main>
  );
}
