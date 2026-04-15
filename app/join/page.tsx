'use client';

import { useState } from 'react';
import { registerHuman, TIER_INFO } from '@/lib/engine';

export default function JoinPage() {
  const [step, setStep] = useState<'form' | 'saving' | 'done'>('form');
  const [agreed, setAgreed] = useState(false);
  const [result, setResult] = useState<{
    privateId: string; agentId: string; repId: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    if (!agreed) return;
    setStep('saving');
    setError(null);
    try {
      const data = await registerHuman();
      setResult({
        privateId: data.privateId,
        agentId: data.agentId,
        repId: data.repId,
      });
      setStep('done');
    } catch {
      setError('Registration failed. Please try again.');
      setStep('form');
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tier = TIER_INFO.CUSTODIED_DBT;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500 text-sm">.dev</span>
        </a>
      </nav>

      <div className="max-w-lg mx-auto px-6 pt-16 pb-24">
        {step === 'form' && (
          <>
            <h1 className="text-3xl font-bold mb-2">Get your DBT</h1>
            <p className="text-gray-500 text-sm mb-8">
              No email. No account. No identity. Just a private credential
              that proves your trustworthiness anonymously.
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
              <h2 className="font-medium text-gray-200 mb-3 text-sm">
                Your starting constitution
              </h2>
              <div className="space-y-2 text-sm text-gray-400">
                {[
                  'Act justly, love mercy, walk humbly (Micah 6:8)',
                  'Never state an opinion as a certain fact',
                  'Treat others as you wish to be treated (Matthew 7:12)',
                ].map((rule, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-600 font-mono">{i + 1}.</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4 mb-6">
              <p className="text-amber-300 text-sm font-medium mb-1">
                ⚠️ Important — read before continuing
              </p>
              <p className="text-amber-400/70 text-xs leading-relaxed">
                We generate a private ID that only you will see. We do not store
                it — if you lose it, there is no recovery. Save it somewhere safe.
              </p>
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 rounded"
              />
              <span className="text-sm text-gray-400">
                I understand my private ID cannot be recovered if lost.
                I will save it immediately.
              </span>
            </label>

            {error && (
              <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={register}
              disabled={!agreed}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-40 text-gray-950 py-4 rounded-xl font-semibold transition-colors">
              Generate My Private DBT →
            </button>
          </>
        )}

        {step === 'saving' && (
          <div className="text-center pt-16">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
            <p className="text-gray-400">Generating your anonymous identity...</p>
          </div>
        )}

        {step === 'done' && result && (
          <>
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🎉</div>
              <h1 className="text-2xl font-bold mb-1">Your DBT is ready</h1>
              <p className="text-gray-500 text-sm">
                Save everything below — especially your Private ID
              </p>
            </div>

            <div className={`${tier.bg} border ${tier.border} rounded-xl p-5 mb-4 text-center`}>
              <div className={`text-4xl font-bold font-mono mb-1 ${tier.color}`}>
                {result.repId.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Starting RepID</div>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-mono border ${tier.border} ${tier.color}`}>
                CUSTODIED_DBT
              </div>
            </div>

            <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-red-300 text-xs font-mono font-bold uppercase">
                  ⚠️ Private ID — Save this now
                </span>
                <button
                  onClick={() => copy(result.privateId)}
                  className="text-xs text-red-400 hover:text-red-200 font-mono">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <code className="text-red-200 text-xs break-all font-mono">
                {result.privateId}
              </code>
              <p className="text-red-400/60 text-xs mt-2">
                This is your only credential. We do not store it.
                If you lose it, you cannot prove ownership.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-mono uppercase">
                  Agent ID — use to check your RepID
                </span>
                <button
                  onClick={() => copy(result.agentId)}
                  className="text-xs text-gray-400 hover:text-gray-200 font-mono">
                  Copy
                </button>
              </div>
              <code className="text-gray-300 text-xs break-all font-mono">
                {result.agentId}
              </code>
            </div>

            <div className="flex flex-col gap-3">
              <a href={`/check?id=${result.agentId}`}
                className="w-full bg-white hover:bg-gray-100 text-gray-950 py-3 rounded-xl font-medium text-center transition-colors">
                View My RepID Profile →
              </a>
              <a href="/"
                className="w-full border border-gray-700 hover:border-gray-500 text-gray-400 py-3 rounded-xl text-center transition-colors text-sm">
                Back to Home
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
