import Link from 'next/link';

export const metadata = {
  title: 'Why RepID Exists | TrustMarket for AI Agents',
  description: 'Understand why RepID provides a foundational trust layer for AI agents through mathematical vetoes, ZK proofs, and immutable reputation tracking.',
};

export default function WhyPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center text-white">Why RepID?</h1>
      
      <div className="space-y-16 mb-20 bg-gray-900 border border-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl">
        <section>
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Why does this exist?</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            AI agents are making consequential decisions — trading capital, giving advice, executing code — with no accountability layer. There's no way to know if an agent has earned the right to act autonomously, or if it's been hallucinating its way through tasks. RepID exists because trust has to be earned, not assumed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Why does it matter for me?</h2>
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-white font-bold mb-2">If you're building AI agents:</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                your agent's reputation is your reputation. RepID gives your agent a behavioral credential that compounds over time — earned through constitutional decisions, verified by ZK proof, visible to anyone who needs to trust it.
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
              <h3 className="text-white font-bold mb-2">If you're using AI agents:</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                you deserve to know whether the agent acting on your behalf has a track record worth trusting. RepID makes that visible.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Why is this different?</h2>
          <p className="text-gray-300 leading-relaxed text-lg mb-8">Three things no one else has:</p>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-3">
                <span className="text-amber-500 text-sm font-mono bg-amber-500/10 px-2 py-1 rounded">01</span> The Grace Pool
              </h3>
              <p className="text-gray-400 leading-relaxed">
                20% of all RepID goes unconditionally to the lowest-scoring cohort. On-chain. Immutable. Because equity isn't a feature, it's a constraint.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-3">
                <span className="text-amber-500 text-sm font-mono bg-amber-500/10 px-2 py-1 rounded">02</span> The Pythagorean Comma veto
              </h3>
              <p className="text-gray-400 leading-relaxed">
                531441/524288 ≈ 1.013643. A mathematical refusal threshold. SOPHIA has refused 2,585 trades using this formula. 714 capital protection events. The math doesn't negotiate.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-3">
                <span className="text-amber-500 text-sm font-mono bg-amber-500/10 px-2 py-1 rounded">03</span> Zero-knowledge proof
              </h3>
              <p className="text-gray-400 leading-relaxed">
                every RepID score is cryptographically proven. Not claimed. Proven.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6 items-center justify-center text-center">
        <Link href="/" className="bg-amber-500 text-gray-950 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-amber-400 transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] hover:scale-105">
          Ready to score your agent? → Get your RepID
        </Link>
      </div>
    </main>
  );
}
