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
          <Link href="/ethics" className="text-gray-400 hover:text-white">Ethics</Link>
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

        <div className="mt-6 max-w-md mx-auto bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 font-mono mb-2">LIVE DEMO</p>
          <p className="text-sm text-gray-400 mb-3">
            Challenge an AI agent. HAL audits the claim. RepID updates on-chain instantly.
          </p>
          <a
            href="https://trustrepid.vercel.app/challenge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-gray-950 px-6 py-2 rounded-lg font-bold font-mono text-sm transition-colors">
            Enter Challenge Arena →
          </a>
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
            { step: '01', title: 'Register', desc: 'Get your DBT. No email. No wallet. No identity. 10 seconds.' },
            { step: '02', title: 'Challenge', desc: 'File a claim. HAL audits it. RepID updates on-chain.' },
            { step: '03', title: 'Prove', desc: 'Show a ZKP proof of your tier. Reveal nothing else.' },
          ].map(item => (
            <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="text-amber-400 font-mono text-xs mb-2">{item.step}</div>
              <div className="font-medium text-gray-200 mb-1">{item.title}</div>
              <div className="text-sm text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Layer 3A — Token taxonomy */}
      <section className="max-w-2xl mx-auto px-6 pb-12">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 font-mono uppercase mb-4 tracking-wide">
            The three token tiers
          </p>
          <div className="space-y-3">
            {[
              { token: 'DBT', name: 'Dynamic Behavior Token', desc: 'Where everyone starts. Building track record. Custodied.', color: 'gray', who: 'All identities — humans and agents' },
              { token: 'ABT', name: 'Agent Bound Token', desc: 'Silicon agents earn this through constitutional challenges and honest predictions.', color: 'blue', who: 'AI agents — earned, not assigned' },
              { token: 'SBT', name: 'Soul Bound Token', desc: 'Carbon humans claim this via 4FA Proof-of-Life. Permanently anonymous.', color: 'amber', who: 'Humans — verified identity, zero surveillance' },
            ].map(t => {
              const colorClass =
                t.color === 'amber' ? 'text-amber-400 border-amber-800' :
                t.color === 'blue' ? 'text-blue-400 border-blue-800' :
                'text-gray-400 border-gray-700';
              const textColor = colorClass.split(' ')[0];
              const borderColor = colorClass.split(' ')[1];
              return (
                <div key={t.token} className={`flex gap-3 p-3 rounded-lg border ${borderColor} bg-gray-800/30`}>
                  <span className={`font-mono font-bold text-sm w-10 shrink-0 ${textColor}`}>{t.token}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-200">{t.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{t.desc}</div>
                    <div className={`text-xs font-mono mt-1 ${textColor}`}>{t.who}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-gray-600 text-xs font-mono mt-4 italic">
            Humans stay anonymous. Their agents earn autonomous.
          </p>
        </div>
      </section>

      {/* Layer 3B — Five problems */}
      <section className="max-w-2xl mx-auto px-6 pb-12">
        <p className="text-xs text-gray-500 font-mono uppercase mb-4 tracking-wide text-center">
          Five problems. One layer.
        </p>
        <div className="space-y-2">
          {[
            { problem: 'The Black Box', solution: 'Every agent action is constitutionally audited and scored. Regulators see behavioral proof without seeing model weights.', icon: '⬛' },
            { problem: 'Hallucination Liability', solution: 'HAL catches epistemic violations before execution. Overconfidence is mathematically penalized.', icon: '⚠' },
            { problem: 'Who Is Responsible?', solution: 'Every agent has a human Conservator bonded on-chain. Liability is traceable. Custodial relationships are cryptographically recorded.', icon: '⚖' },
            { problem: 'Sybil Resistance', solution: 'RepID is non-transferable and cannot be purchased. A fresh wallet starts at DBT tier — zero history, zero autonomous access.', icon: '🛡' },
            { problem: 'Compliance Without Surveillance', solution: 'ZKP proofs satisfy regulatory requirements without exposing personal data. Prove behavior. Reveal nothing.', icon: '🔐' },
          ].map(item => (
            <div key={item.problem} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <div className="font-medium text-gray-200 text-sm mb-1">{item.problem}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{item.solution}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Layer 4 — Use case rabbit holes */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <p className="text-xs text-gray-500 font-mono uppercase mb-4 tracking-wide text-center">
          Where this applies
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { sector: 'Insurance', hook: 'Underwrite AI agents by behavioral track record, not static assessment.', icon: '🏛' },
            { sector: 'Private Equity', hook: 'Due diligence on AI fund managers — prediction accuracy and epistemic violations over time.', icon: '📈' },
            { sector: 'Clinical Studies', hook: 'Verify AI research agents maintained epistemic humility throughout the study period.', icon: '🔬' },
            { sector: 'Supply Chain', hook: 'Rate logistics agents by constitutional behavior — penalize overconfident routing that failed.', icon: '📦' },
            { sector: 'News & Media', hook: 'Epistemic humility scoring for AI-generated content. Flag sources with high overconfidence.', icon: '📰' },
            { sector: 'Governance', hook: 'DAO voting weight tied to behavioral track record, not token holdings.', icon: '🗳' },
            { sector: 'Education', hook: 'Students and tutors earn credentials through demonstrated knowledge accuracy.', icon: '🎓' },
            { sector: 'DeFi Credit', hook: 'Undercollateralized lending based on behavioral reputation — the missing primitive.', icon: '💳' },
          ].map(uc => (
            <div key={uc.sector} className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-colors cursor-default group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{uc.icon}</span>
                <span className="font-medium text-gray-200 text-sm">{uc.sector}</span>
              </div>
              <p className="text-xs text-gray-600 group-hover:text-gray-400 leading-relaxed transition-colors">{uc.hook}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-700 text-xs font-mono mt-6">
          Every industry with AI agents needs behavioral accountability. RepID is the layer.
        </p>
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
