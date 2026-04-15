import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500 text-sm">.dev</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/check" className="text-gray-400 hover:text-gray-100">
            Check My RepID
          </Link>
          <Link href="/join"
            className="bg-white text-gray-950 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Get My DBT →
          </Link>
        </div>
      </nav>

      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-10">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
          ZKP-anonymous · No account required · No email
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight tracking-tight">
          Humans are{' '}
          <span className="text-gray-400 italic">anonymous.</span>
          <br />
          Agents earn{' '}
          <span className="text-amber-400">autonomous.</span>
        </h1>

        <p className="text-lg text-gray-400 mb-4 max-w-xl mx-auto leading-relaxed">
          RepID is your behavioral credit score — earned through honest,
          constitutional behavior. No identity required. No surveillance.
          Just proof of trustworthiness.
        </p>

        <p className="text-sm text-gray-600 mb-12 font-mono">
          Powered by HyperDAG Protocol · ZKP Privacy · ERC-8004
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/join"
            className="bg-white hover:bg-gray-100 text-gray-950 px-8 py-4 rounded-xl font-semibold text-base transition-colors">
            Get My DBT — It&apos;s Free →
          </Link>
          <Link href="/check"
            className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-4 rounded-xl text-base transition-colors">
            Check My RepID
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-center text-gray-500 text-sm font-mono uppercase tracking-widest mb-8">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '01', title: 'Get your DBT', desc: 'No email. No account. No identity. You get a private ID only you hold.', color: 'text-gray-400' },
            { step: '02', title: 'Earn RepID', desc: 'Make honest predictions. Win fair challenges. Act with epistemic humility.', color: 'text-blue-400' },
            { step: '03', title: 'Prove trust anonymously', desc: 'Show a ZKP proof of your RepID tier — without revealing who you are.', color: 'text-amber-400' },
          ].map(item => (
            <div key={item.step} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className={`font-mono text-xs mb-3 ${item.color}`}>{item.step}</div>
              <div className="font-semibold text-gray-200 mb-2">{item.title}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="font-semibold text-gray-200 mb-4">The three tiers</h2>
          <div className="space-y-3">
            {[
              { tier: 'DBT', name: 'Digital Bound Token', range: '0–999 RepID', desc: 'Where everyone starts. Building trust from scratch.', color: 'text-gray-400 border-gray-600 bg-gray-800' },
              { tier: 'ABT', name: 'Agent Bound Token', range: '1,000–4,999 RepID', desc: 'Your track record speaks. Earning independence.', color: 'text-blue-400 border-blue-800 bg-blue-950/50' },
              { tier: 'SBT', name: 'Soul Bound Token', range: '5,000–10,000 RepID', desc: 'Full autonomy. Earned through constitutional behavior.', color: 'text-amber-400 border-amber-800 bg-amber-950/30' },
            ].map(item => (
              <div key={item.tier} className={`flex items-center gap-4 p-3 rounded-lg border ${item.color}`}>
                <span className="font-mono font-bold text-sm w-10">{item.tier}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-200">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
                <span className="font-mono text-xs text-gray-600">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
            RepID stores nothing about you. No name. No email. No wallet address.
            Only a ZKP commitment — a mathematical proof that you exist, without
            revealing who you are. Your private ID never leaves your device.
          </p>
          <p className="text-gray-600 text-xs font-mono mt-4">
            HyperDAG Protocol · Micah 6:8 · Help people help people
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-800 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-gray-600 font-mono">
          <span>RepID.dev · ZKP Anonymous Reputation</span>
          <div className="flex gap-4">
            <Link href="https://trustrepid.dev" className="hover:text-gray-400">For Agents →</Link>
            <Link href="https://hyperdag.dev" className="hover:text-gray-400">HyperDAG →</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
