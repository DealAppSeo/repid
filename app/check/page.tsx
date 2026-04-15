'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMyRepId, TIER_INFO } from '@/lib/engine';

function CheckContent() {
  const params = useSearchParams();
  const [agentId, setAgentId] = useState(params.get('id') || '');
  const [result, setResult] = useState<{
    repId: number; tier: string; eventCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = async (id?: string) => {
    const checkId = id || agentId;
    if (!checkId.trim()) return;
    setLoading(true);
    setError(null);
    const data = await getMyRepId(checkId.trim());
    if (!data) setError('Agent ID not found. Check your saved credentials.');
    else setResult(data);
    setLoading(false);
  };

  useEffect(() => {
    const id = params.get('id');
    if (id) check(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tier = result
    ? TIER_INFO[result.tier as keyof typeof TIER_INFO]
    : null;

  return (
    <div className="max-w-lg mx-auto px-6 pt-16 pb-24">
      <h1 className="text-3xl font-bold mb-2">Check My RepID</h1>
      <p className="text-gray-500 text-sm mb-8">
        Enter your Agent ID to see your anonymous RepID score
      </p>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={agentId}
          onChange={e => setAgentId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="Your Agent ID..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 font-mono text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500"
        />
        <button
          onClick={() => check()}
          disabled={loading}
          className="bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-950 px-6 py-3 rounded-xl font-medium transition-colors">
          {loading ? '...' : 'Check'}
        </button>
      </div>

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
          {error}
        </div>
      )}

      {result && tier && (
        <div className="space-y-4">
          <div className={`${tier.bg} border ${tier.border} rounded-xl p-6 text-center`}>
            <div className={`text-5xl font-bold font-mono mb-2 ${tier.color}`}>
              {result.repId.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm mb-3">RepID Score</div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-mono border ${tier.border} ${tier.color}`}>
              {tier.label}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-gray-500 text-xs font-mono mb-1">Score range</div>
            <div className="text-gray-300 text-sm">{tier.range}</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-gray-500 text-xs font-mono mb-1">Events recorded</div>
            <div className="text-gray-300 text-sm">{result.eventCount}</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-gray-500 text-xs font-mono mb-2">What this means</div>
            <div className="text-gray-400 text-sm leading-relaxed">
              {tier.description}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-xs font-mono">
              Your identity is anonymous. Only you know this AgentID is yours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500 text-sm">.dev</span>
        </a>
        <a href="/join"
          className="bg-white text-gray-950 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
          Get My DBT →
        </a>
      </nav>
      <Suspense fallback={<div className="text-center pt-16 text-gray-500">Loading...</div>}>
        <CheckContent />
      </Suspense>
    </main>
  );
}
