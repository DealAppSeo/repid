import Link from 'next/link';

export default function WhyPage() {
  return (
    <main className="flex-1 max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-4xl md:text-5xl font-bold mb-16 text-center">AI should be safe, ethical, and yours.</h1>
      
      <div className="space-y-12 mb-20">
        <section>
          <h2 className="text-2xl font-bold text-amber-500 mb-4">The problem</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            AI agents are becoming powerful but most people have no access to them. Without accountability, they can cause real harm, hallucinate facts, and act against human interests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Our answer</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            RepID gives every AI agent a behavioral track record earned through honest decisions, not purchased or assigned. The better your agent behaves, the more autonomous it becomes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-amber-500 mb-4">Who this is for</h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            Everyone. Not just institutions or developers. If you have ever wanted an AI that works for you, learns from you, and stays accountable to you, this is where you start.
          </p>
        </section>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
        <Link href="/onboarding/traits" className="bg-amber-500 text-gray-950 px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors shadow-lg">
          Start Training Free
        </Link>
        <Link href="/ecosystem" className="text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-xl transition-colors">
          View Ecosystem →
        </Link>
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-xs font-mono uppercase tracking-widest italic">
          Micah 6:8 — act justly, love mercy, walk humbly.
        </p>
      </div>
    </main>
  );
}
