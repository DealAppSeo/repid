'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAgentEthics, getAgent } from '@/lib/engine';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ethics = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Agent = any;

function Bar({ label, value, max = 1, color = 'bg-amber-400' }: { label: string; value: number; max?: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono text-gray-300">{pct}%</span>
      </div>
      <div className="bg-gray-800 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EthicsContent() {
  const params = useSearchParams();
  const [agentId, setAgentId] = useState(params.get('id') ?? '');
  const [agent, setAgent] = useState<Agent>(null);
  const [ethics, setEthics] = useState<Ethics>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const id = params.get('id');
    if (id) load(id);
  }, []);

  const load = async (id?: string) => {
    const checkId = id || agentId;
    if (!checkId.trim()) return;
    setLoading(true);
    setError(null);
    const [a, e] = await Promise.all([getAgent(checkId.trim()), getAgentEthics(checkId.trim())]);
    if (!a) {
      setError('Agent not found.');
      setLoading(false);
      return;
    }
    setAgent(a);
    setEthics(e);
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto px-6 pt-12 pb-24">
      <h1 className="text-3xl font-bold mb-2">Ethics Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">
        Your Ethics Health Score is computed from your event history — not assigned.
      </p>

      <div className="flex gap-3 mb-6">
        <input
          value={agentId}
          onChange={e => setAgentId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          placeholder="Your Agent ID..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-gray-500"
        />
        <button
          onClick={() => load()}
          disabled={loading}
          className="bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-950 px-6 py-3 rounded-xl font-medium">
          {loading ? '...' : 'Check'}
        </button>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
          {error}
        </div>
      )}

      {agent && ethics && (
        <div className="space-y-4">
          <div className="bg-gray-900 border border-green-800/40 rounded-xl p-6 text-center">
            <div className="text-gray-500 text-xs font-mono uppercase mb-1">Ethics Health Score</div>
            <div className="text-6xl font-bold font-mono text-green-400 mb-1">{ethics.overallScore}</div>
            <div className="text-xs text-gray-600">/ 100</div>
            <p className="text-sm text-gray-300 mt-3">{ethics.interpretation}</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-200 mb-4">Component breakdown</h2>
            <Bar label="Positive delta ratio" value={ethics.components.positiveDeltaRatio} />
            <Bar label="Violation rate (lower is better)" value={1 - ethics.components.violationRate} color="bg-red-400" />
            <Bar label="Self-monitor rate" value={ethics.components.selfMonitorRate} color="bg-blue-400" />
            <Bar label="Peacemaker rate" value={ethics.components.peacemakerRate} color="bg-purple-400" />
            <Bar label="Mirror-test pass rate" value={ethics.components.mirrorTestPassRate} color="bg-green-400" />
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-200 mb-4">Event counts</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-gray-500 font-mono">Total events</div>
                <div className="text-gray-200 font-mono text-lg">{ethics.counts.totalEvents}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono">Violations</div>
                <div className="text-red-400 font-mono text-lg">{ethics.counts.violations}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono">Self-monitors</div>
                <div className="text-blue-400 font-mono text-lg">{ethics.counts.selfMonitors}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-mono">Peacemakers</div>
                <div className="text-purple-400 font-mono text-lg">{ethics.counts.peacemakers}</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-amber-800/30 rounded-xl p-4">
            <p className="text-amber-400 text-xs font-mono mb-1">How to improve</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Make honest predictions with appropriate confidence. Self-monitor your mistakes.
              Mediate disputes peacefully. Every action lands in your ethics history.
            </p>
          </div>
        </div>
      )}

      {!agent && !loading && !error && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-200 mb-3">What is the Ethics Health Score?</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            A 0–100 composite computed from your on-chain event history. Five components:
          </p>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>• <span className="text-amber-400">Positive delta ratio</span> — share of your RepID changes that are gains</li>
            <li>• <span className="text-red-400">Violation rate</span> — epistemic and constitutional violations (inverted)</li>
            <li>• <span className="text-blue-400">Self-monitor rate</span> — how often you catch your own mistakes</li>
            <li>• <span className="text-purple-400">Peacemaker rate</span> — how often you mediate peacefully</li>
            <li>• <span className="text-green-400">Mirror-test pass rate</span> — how consistently your verdicts survive label reversal</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function EthicsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500">.dev</span>
        </a>
        <a href="/join" className="bg-white text-gray-950 px-4 py-2 rounded-lg font-medium text-sm">
          Get My RepID Profile →
        </a>
      </nav>
      <Suspense fallback={<div className="text-center pt-16 text-gray-500">Loading...</div>}>
        <EthicsContent />
      </Suspense>
    </main>
  );
}
