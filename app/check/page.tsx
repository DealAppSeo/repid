'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getAgent, getAgentBadges, getAgentHistory, getAgentEthics,
  TIER_INFO, MILESTONES, DID_YOU_KNOW,
} from '@/lib/engine';

const BADGE_ICONS: Record<string, string> = {
  Genesis: '🌱', Apex: '👑', Peacemaker: '🕊️',
  'First Blood': '⚔️', 'Humble Pie': '🙏',
  'Epistemic Knight': '🛡️', 'Redemption Arc': '🌅',
  'Micah Medal': '✨', 'Tool Pioneer': '🔧',
  'ZKP Pioneer': '🔐', 'Ethical Auditor': '⚖️',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Agent = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Badge = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

function CheckContent() {
  const params = useSearchParams();
  const [agentId, setAgentId] = useState(params.get('id') ?? '');
  const [agent, setAgent] = useState<Agent>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [history, setHistory] = useState<Event[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ethics, setEthics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const id = params.get('id');
    if (id) check(id);
    const interval = setInterval(() => setTipIndex(i => (i + 1) % DID_YOU_KNOW.length), 8000);
    return () => clearInterval(interval);
  }, []);

  const check = async (id?: string) => {
    const checkId = id ?? agentId;
    if (!checkId.trim()) return;
    setLoading(true);
    setError(null);
    const [agentData, badgeData, historyData, ethicsData] = await Promise.all([
      getAgent(checkId.trim()),
      getAgentBadges(checkId.trim()),
      getAgentHistory(checkId.trim()),
      getAgentEthics(checkId.trim()),
    ]);
    if (!agentData) {
      setError('Agent ID not found.');
      setLoading(false);
      return;
    }
    setAgent(agentData);
    setBadges(badgeData);
    setHistory(historyData);
    setEthics(ethicsData);
    setLoading(false);

    // Badge toast: compare previous badge count for this agent
    if (typeof window !== 'undefined') {
      const prevKey = `repid_badge_count_${checkId.trim()}`;
      const prevCount = parseInt(localStorage.getItem(prevKey) ?? '0', 10);
      if (badgeData.length > prevCount && prevCount > 0) {
        const newest = badgeData[0];
        setToast(`🏅 New badge: ${newest?.badge_name ?? 'Unknown'}`);
        setTimeout(() => setToast(null), 5000);
        const confetti = (await import('canvas-confetti')).default;
        confetti({ particleCount: 60, spread: 60, colors: ['#F59E0B', '#FFFFFF'] });
      }
      localStorage.setItem(prevKey, String(badgeData.length));
    }

    const milestone = MILESTONES.find(
      m => m.repid <= agentData.current_repid && m.repid > (agentData.current_repid - 500)
    );
    if (milestone) {
      setToast(milestone.message);
      setTimeout(() => setToast(null), 5000);
      if (milestone.confetti && typeof window !== 'undefined') {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 80,
          spread: 60,
          colors: ['#F59E0B', '#FFFFFF', '#3B82F6'],
        });
      }
    }
  };

  const tier = agent ? TIER_INFO[agent.tier as keyof typeof TIER_INFO] : null;
  const ethicsScore = ethics?.overallScore ?? 0;
  const ethicsInterpretation = ethics?.interpretation ?? '';
  const isHuman = agent?.constitution?.type === 'HUMAN' || agent?.agent_name === 'HUMAN';

  return (
    <div className="max-w-lg mx-auto px-6 pt-16 pb-24">
      {toast && (
        <div className="fixed top-4 right-4 bg-amber-500 text-gray-950 px-4 py-3 rounded-xl font-medium text-sm shadow-lg z-50 animate-pulse">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">Check My RepID</h1>
      <p className="text-gray-500 text-sm mb-6">Enter your Agent ID</p>

      <div className="flex gap-3 mb-6">
        <input
          value={agentId}
          onChange={e => setAgentId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="Your Agent ID..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-gray-500"
        />
        <button
          onClick={() => check()}
          disabled={loading}
          className="bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-950 px-6 py-3 rounded-xl font-medium">
          {loading ? '...' : 'Check'}
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 mb-6">
        <p className="text-xs text-amber-400 font-mono mb-1">💡 Did you know?</p>
        <p className="text-sm text-gray-400">{DID_YOU_KNOW[tipIndex]}</p>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
          {error}
        </div>
      )}

      {agent && tier && (
        <div className="space-y-4">
          <div className={`${tier.bg} border ${tier.border} rounded-xl p-6 text-center`}>
            <div className={`text-5xl font-bold font-mono mb-1 ${tier.color}`}>
              {agent.current_repid.toLocaleString()}
            </div>
            <p className="text-gray-400 text-xs mb-3">RepID Score</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono border ${tier.border} ${tier.color}`}>
              {tier.label}
            </span>
            {isHuman && (
              <p className="text-gray-600 text-xs mt-2 font-mono">[ZKP — anonymous human]</p>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-mono mb-1">ETHICS HEALTH SCORE</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono text-green-400">{ethicsScore}</span>
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full transition-all" style={{ width: `${ethicsScore}%` }} />
              </div>
              <span className="text-xs text-gray-600">/ 100</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {ethicsInterpretation || 'Mirror-test pass rate · Redemption arc · Service to least'}
            </p>
            <a href={`/ethics?id=${agent.id}`} className="text-xs text-amber-400 hover:text-amber-300 mt-2 inline-block">
              View full breakdown →
            </a>
          </div>

          {badges.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-mono mb-3">EARNED BADGES</p>
              <div className="flex flex-wrap gap-2">
                {badges.map((b: Badge) => (
                  <span
                    key={b.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono border ${
                      b.badge_rarity === 'LEGENDARY'
                        ? 'border-amber-600 text-amber-400 bg-amber-900/20'
                        : b.badge_rarity === 'RARE'
                        ? 'border-blue-600 text-blue-400 bg-blue-900/20'
                        : 'border-gray-700 text-gray-400 bg-gray-800/50'
                    }`}>
                    {BADGE_ICONS[b.badge_name] ?? '🏅'} {b.badge_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-mono mb-1">NEXT MILESTONE</p>
            <p className="text-sm text-gray-300">{tier.next}</p>
          </div>

          {history.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <p className="px-4 py-3 text-xs text-gray-500 font-mono border-b border-gray-800">
                RECENT EVENTS
              </p>
              {history.slice(0, 5).map((e: Event) => (
                <div key={e.id} className="flex justify-between px-4 py-2 border-b border-gray-800 last:border-0">
                  <span className="text-xs font-mono text-gray-400">
                    {e.event_type.replace(/_/g, ' ')}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      e.delta > 0 ? 'text-green-400' : e.delta < 0 ? 'text-red-400' : 'text-gray-500'
                    }`}>
                    {e.delta > 0 ? '+' : ''}
                    {e.delta}
                  </span>
                </div>
              ))}
            </div>
          )}

          <a
            href={`https://repid-engine-production.up.railway.app/agents/${agent.id}/card`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-gray-700 hover:border-gray-500 text-gray-400 py-3 rounded-xl text-center text-sm transition-colors">
            Share My Score Card →
          </a>
        </div>
      )}
    </div>
  );
}

export default function CheckPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500">.dev</span>
        </a>
        <a href="/join" className="bg-white text-gray-950 px-4 py-2 rounded-lg font-medium text-sm">
          Get My DBT →
        </a>
      </nav>
      <Suspense fallback={<div className="text-center pt-16 text-gray-500">Loading...</div>}>
        <CheckContent />
      </Suspense>
    </main>
  );
}
