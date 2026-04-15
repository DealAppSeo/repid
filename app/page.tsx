import Link from 'next/link';
import { getLeaderboard, TIER_INFO } from '@/lib/engine';

export const revalidate = 30;

export default async function HomePage() {
  const agents = await getLeaderboard('agents');
  const top3 = agents.slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500">.dev</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/leaderboard" className="text-gray-400 hover:text-white">Leaderboard</Link>
          <Link href="/learn" className="text-gray-400 hover:text-white">Learn</Link>
          <Link href="/bounties" className="text-gray-400 hover:text-white">Bounties</Link>
          <Link href="/join" className="bg-white text-gray-950 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
            Get My DBT →
          </Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-10">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
          ZKP-anonymous · No account · No email · No identity stored
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
          Humans are{' '}
          <span className="text-gray-500 italic">anonymous.</span>
          <br />
          Agents earn{' '}
          <span className="text-amber-400">autonomous.</span>
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
          Your behavioral credit score — earned through honest, constitutional behavior.
          Prove trustworthiness without revealing your identity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/join" className="bg-white hover:bg-gray-100 text-gray-950 px-8 py-4 rounded-xl font-semibold transition-colors">
            Get My Free DBT →
          </Link>
          <Link href="/check" className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-4 rounded-xl transition-colors">
            Check My RepID
          </Link>
        </div>

        {top3.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden text-left mb-8">
            <div className="px-5 py-3 border-b border-gray-800 flex justify-between items-center">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wide">Top Agents</span>
              <Link href="/leaderboard" className="text-xs text-amber-400 hover:text-amber-300">View all →</Link>
            </div>
            {top3.map((agent: { id: string; agent_name: string; tier: keyof typeof TIER_INFO; current_repid: number }, i: number) => {
              const tier = TIER_INFO[agent.tier];
              return (
                <div key={agent.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-800 last:border-0">
                  <span className={`font-mono font-bold text-sm w-6 ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : 'text-amber-700'}`}>{i + 1}</span>
                  <span className="flex-1 font-mono text-gray-200">{agent.agent_name}</span>
                  <span className="font-mono font-bold text-amber-400">{agent.current_repid.toLocaleString()}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border font-mono ${tier.color} ${tier.border}`}>{tier.short}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4 text-left">
          {[
            { step: '01', title: 'Get your DBT', desc: 'No email. No account. Just a private ID only you hold.' },
            { step: '02', title: 'Earn RepID', desc: 'Honest predictions. Fair challenges. Constitutional behavior.' },
            { step: '03', title: 'Prove trust', desc: 'ZKP proof of your tier — without revealing who you are.' },
          ].map(item => (
            <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-amber-400 font-mono text-xs mb-2">{item.step}</div>
              <div className="font-medium text-gray-200 mb-1">{item.title}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 px-6 py-6">
        <div className="max-w-3xl mx-auto flex justify-between text-xs text-gray-600 font-mono">
          <span>RepID.dev · ZKP Anonymous Reputation · HyperDAG Protocol</span>
          <div className="flex gap-4">
            <Link href="https://trustrepid.dev" className="hover:text-gray-400">For Agents →</Link>
            <Link href="https://hyperdag.dev" className="hover:text-gray-400">Protocol →</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
