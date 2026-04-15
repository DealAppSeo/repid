'use client';

import { useState } from 'react';
import { registerHuman } from '@/lib/engine';

interface Registration {
  privateId: string;
  agentId: string;
  repId: number;
  tier: string;
  badges?: string[];
}

export default function JoinPage() {
  const [step, setStep] = useState<'form' | 'loading' | 'done'>('form');
  const [agreed, setAgreed] = useState(false);
  const [result, setResult] = useState<Registration | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    if (!agreed) return;
    setStep('loading');
    try {
      const data = await registerHuman();
      setResult(data);
      setStep('done');
      if (typeof window !== 'undefined') {
        localStorage.setItem('repid_agent_id', data.agentId);
        localStorage.setItem('repid_private_id', data.privateId);
      }
      if (typeof window !== 'undefined') {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#FFFFFF', '#3B82F6'],
        });
      }
    } catch {
      setError('Registration failed. Please try again.');
      setStep('form');
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4">
        <a href="/" className="flex items-center gap-2 w-fit">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500">.dev</span>
        </a>
      </nav>
      <div className="max-w-md mx-auto px-6 pt-16 pb-24">
        {step === 'form' && (
          <>
            <div className="bg-gray-900 border border-amber-800/30 rounded-xl p-4 mb-6">
              <p className="text-amber-400 text-xs font-mono mb-2">
                ⚡ FOR HASHKEY HORIZON JUDGES
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                Register in 10 seconds. No wallet. No email. No identity.
                Then challenge an AI agent and watch your RepID update on-chain.
              </p>
              <p className="text-gray-500 text-xs font-mono">
                Your Private ID is shown once and never stored —
                that is the ZKP anonymity guarantee in action.
              </p>
            </div>
            <h1 className="text-3xl font-bold mb-2">Get your DBT</h1>
            <p className="text-gray-500 text-sm mb-8">
              No email. No account. No identity stored. Just your private credential.
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-5">
              <p className="text-xs text-gray-500 font-mono uppercase mb-3">Your starting constitution</p>
              {[
                'Act justly, love mercy, walk humbly (Micah 6:8)',
                'Never state an opinion as a certain fact',
                'Treat others as you wish to be treated (Matthew 7:12)',
              ].map((rule, i) => (
                <div key={i} className="flex gap-2 text-sm text-gray-400 mb-1">
                  <span className="text-gray-600 font-mono">{i + 1}.</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 mb-5">
              <p className="text-amber-300 text-sm font-medium mb-1">⚠️ Read before continuing</p>
              <p className="text-amber-400/70 text-xs leading-relaxed">
                You will receive a Private ID. We do not store it. If you lose it, it cannot be
                recovered. Save it immediately.
              </p>
            </div>
            <label className="flex gap-3 mb-6 cursor-pointer items-start">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5"
              />
              <span className="text-sm text-gray-400">
                I understand my Private ID cannot be recovered. I will save it immediately.
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
              Generate My Anonymous DBT →
            </button>
          </>
        )}

        {step === 'loading' && (
          <div className="text-center pt-16">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Generating your anonymous identity...</p>
          </div>
        )}

        {step === 'done' && result && (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎉</div>
              <h1 className="text-2xl font-bold mb-1">Your DBT is ready!</h1>
              <p className="text-gray-500 text-sm">
                RepID: {result.repId.toLocaleString()} · {result.tier} · Genesis Badge earned
              </p>
            </div>

            <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-red-300 text-xs font-mono font-bold">
                  ⚠️ PRIVATE ID — SAVE NOW (shown once)
                </span>
                <button
                  onClick={() => copy(result.privateId, 'private')}
                  className="text-xs text-red-400 hover:text-red-200 font-mono">
                  {copied === 'private' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <code className="text-red-200 text-xs break-all font-mono block">{result.privateId}</code>
              <p className="text-red-400/60 text-xs mt-2">
                Not stored by us. Cannot be recovered. Save it now.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-xs font-mono">AGENT ID — use to check RepID</span>
                <button
                  onClick={() => copy(result.agentId, 'agent')}
                  className="text-xs text-gray-400 hover:text-gray-200 font-mono">
                  {copied === 'agent' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <code className="text-gray-300 text-xs break-all font-mono">{result.agentId}</code>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://trustrepid.vercel.app/challenge?challengerId=${result.agentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 py-4 rounded-xl text-center font-bold font-mono text-lg transition-colors">
                Challenge an Agent → (your RepID: {result.repId})
              </a>
              <a
                href={`/check?id=${result.agentId}`}
                className="w-full bg-white hover:bg-gray-100 text-gray-950 py-3 rounded-xl font-medium text-center">
                View My RepID Profile →
              </a>
              <a
                href="/learn"
                className="w-full border border-gray-700 hover:border-gray-500 text-gray-400 py-3 rounded-xl text-center text-sm">
                Learn how to earn more RepID
              </a>
            </div>

            <div className="mt-6 bg-gray-900 border border-amber-800/30 rounded-xl p-4">
              <p className="text-amber-400 text-xs font-mono mb-1">🔮 Future opportunities</p>
              <p className="text-gray-400 text-sm">
                High RepID holders get early access to TrustShell enterprise tier, priority on
                agent bounty boards, and revenue sharing from agents you mentor.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
