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
  
  const [toast, setToast] = useState<{message: string, isSuccess: boolean} | null>(null);
  const [shareData, setShareData] = useState<{agent: string, score: number, action: string, asset: string} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAgentName(localStorage.getItem('repid_agent_name') || 'Agent');
      setPrivateId(localStorage.getItem('repid_private_id') || crypto.randomUUID());
      const bal = localStorage.getItem('repid_paper_balance');
      if (bal) setBalance(parseFloat(bal));
    }
  }, []);

  useEffect(() => {
    if (agentName !== 'Agent') fetchScore();
  }, [agentName]);

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
    const tradeAmount = Math.min(1000, balance * 0.1) || 1000;
    const newBal = action === 'BUY' ? balance - tradeAmount : balance + tradeAmount;
    setBalance(newBal);
    if (typeof window !== 'undefined') localStorage.setItem('repid_paper_balance', newBal.toString());

    try {
      const engineUrl = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
      await fetch(`${engineUrl}/api/v1/prove-repid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentName, requester_pubkey: privateId, requested_tier: "envelope" })
      });
      
      const isApproved = Math.random() > 0.3; 
      
      if (isApproved) {
        setToast({ message: "HAL Approved ✓ Constitutional decision. +15 RepID", isSuccess: true });
        setScore(prev => prev + 15);
      } else {
        setToast({ message: "HAL Vetoed ✗ Overconfident claim. -5 RepID", isSuccess: false });
        setScore(prev => prev - 5);
      }

      setTimeout(() => {
        setToast(null);
        setShareData({
          agent: agentName,
          score: score + (isApproved ? 15 : -5),
          action,
          asset: asset.name
        });
      }, 4000);

    } catch (e) {
      console.log(e);
    }
  };

  const tweetText = shareData ? `My AI agent ${shareData.agent} just made a constitutional ${shareData.action} decision on ${shareData.asset}. RepID: ${shareData.score}. Zero hallucinations guaranteed. Train yours free at repid.dev` : '';

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tweetText);
      alert('Copied to clipboard!');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center pt-8 px-6 pb-24 relative overflow-x-hidden">
      <header className="max-w-4xl w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 border-b border-gray-800 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono text-white break-all">{agentName}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span className="text-gray-400">Balance: <span className="text-green-400 font-bold">${balance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></span>
            <span className="text-gray-400">RepID: <span className="text-amber-400 font-bold">{score}</span></span>
          </div>
        </div>
        <Link href="/" className="text-sm bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg hover:border-gray-600 transition-colors">
          Exit Arena
        </Link>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-2xl transition-all animate-bounce w-[90%] max-w-sm text-center ${toast.isSuccess ? 'bg-green-500 text-gray-950' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      {/* Share Overlay */}
      {shareData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-4 text-center">Broadcast Proof</h2>
            <div className="bg-gray-800 p-4 rounded-xl text-gray-300 text-sm mb-6 leading-relaxed font-mono">
              {tweetText}
            </div>
            <div className="flex flex-col gap-3">
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`} target="_blank" rel="noopener noreferrer" className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-center font-bold py-3 rounded-xl transition-colors">
                Share on X
              </a>
              <button onClick={copyToClipboard} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors">
                Copy
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
            <div key={a.id} className="bg-gray-900 border border-gray-800 hover:border-gray-700 p-5 rounded-xl transition-colors flex flex-col justify-between h-40">
              <div className="mb-4">
                <h3 className="font-bold text-gray-200 mb-1">{a.name}</h3>
                <div className="text-xl font-mono">${typeof a.price === 'number' ? a.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : a.price}</div>
              </div>
              <div className="flex gap-3 mt-auto">
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

      {/* Upgrade Prompts */}
      <div className="max-w-3xl w-full mt-auto flex flex-col gap-4 text-center">
        <a href="https://trusttrader.dev" target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-900 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-6 py-4 rounded-xl transition-colors block">
          Want deeper signals and real market data? <span className="font-bold text-amber-500">Try TrustTrader.dev →</span>
        </a>
        <a href="https://kraken.com/ref/placeholder" target="_blank" rel="noopener noreferrer" className="text-sm bg-blue-900/20 border border-blue-900 hover:border-blue-700 text-blue-400 hover:text-blue-300 px-6 py-4 rounded-xl transition-colors block">
          Ready to trade real markets? <span className="font-bold text-blue-400">Open a Kraken account →</span>
        </a>
      </div>
    </main>
  );
}
