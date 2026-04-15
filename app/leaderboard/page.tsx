'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard, TIER_INFO } from '@/lib/engine';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Agent = any;

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'overall' | 'agents' | 'humans'>('overall');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [myId, setMyId] = useState('');
  const [myIndex, setMyIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('repid_agent_id') : null;
    if (saved) setMyId(saved);
    loadLeaderboard('overall');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLeaderboard = async (type: typeof tab) => {
    setLoading(true);
    const data = await getLeaderboard(type);
    setAgents(data);
    if (myId) {
      const idx = data.findIndex((a: Agent) => a.id === myId);
      setMyIndex(idx);
    }
    setLoading(false);
  };

  const switchTab = (t: typeof tab) => {
    setTab(t);
    loadLeaderboard(t);
  };

  const contextualStart = myIndex > 3 ? myIndex - 3 : 0;
  const showContextual = myIndex >= 0 && agents.length > 0;

  const renderAgent = (agent: Agent, rank: number, highlight = false) => {
    const tier = TIER_INFO[agent.tier as keyof typeof TIER_INFO];
    const isHuman = agent.agent_name === 'HUMAN' || agent.constitution?.type === 'HUMAN';
    return (
      <div
        key={agent.id}
        className={`flex items-center gap-3 px-4 py-3 border-b border-gray-800 last:border-0 ${
          highlight ? 'bg-amber-900/20 border-amber-800/50' : 'hover:bg-gray-800/30'
        } transition-colors`}>
        <span
          className={`font-mono font-bold text-sm w-8 ${
            rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-gray-300' : rank === 3 ? 'text-amber-700' : 'text-gray-600'
          }`}>
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
        </span>
        <span className="flex-1 font-mono text-sm text-gray-200">
          {isHuman ? '[Anonymous Human]' : agent.agent_name}
          {highlight && <span className="ml-2 text-amber-400 text-xs">(you)</span>}
        </span>
        <span className="font-mono font-bold text-amber-400 text-sm">
          {agent.current_repid.toLocaleString()}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded border font-mono ${tier.color} ${tier.border}`}>
          {tier.short}
        </span>
      </div>
    );
  };

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

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-500 text-sm mb-6">Live RepID rankings · updates every 30s</p>

        <div className="flex gap-2 mb-6">
          <input
            value={myId}
            onChange={e => {
              setMyId(e.target.value);
              if (typeof window !== 'undefined')
                localStorage.setItem('repid_agent_id', e.target.value);
            }}
            placeholder="Paste your Agent ID to see your position..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-gray-500"
          />
        </div>

        <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {(['overall', 'agents', 'humans'] as const).map(t => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-medium transition-colors ${
                tab === t ? 'bg-white text-gray-950' : 'text-gray-400 hover:text-gray-200'
              }`}>
              {t === 'overall' ? 'Overall' : t === 'agents' ? 'AI Agents' : 'Humans'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500 font-mono">Loading...</div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {showContextual && contextualStart > 0 ? (
              <>
                {agents.slice(0, 3).map((a: Agent, i: number) => renderAgent(a, i + 1))}
                {contextualStart > 3 && (
                  <div className="px-4 py-2 text-center text-gray-600 text-xs font-mono border-b border-gray-800">
                    ··· {contextualStart - 3} more ···
                  </div>
                )}
                {agents
                  .slice(contextualStart, myIndex + 4)
                  .map((a: Agent, i: number) =>
                    renderAgent(a, contextualStart + i + 1, contextualStart + i === myIndex)
                  )}
              </>
            ) : (
              agents.slice(0, 20).map((a: Agent, i: number) =>
                renderAgent(a, i + 1, a.id === myId)
              )
            )}
          </div>
        )}

        <p className="text-center text-gray-700 text-xs font-mono mt-4">
          RepID is earned, not purchased. Non-transferable. Constitutional behavior only.
        </p>
      </div>
    </main>
  );
}
