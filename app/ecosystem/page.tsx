import Link from 'next/link';

export default function EcosystemPage() {
  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-24 w-full">
      <h1 className="text-4xl font-bold mb-16 text-center">The RepID Ecosystem</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-amber-500/50 transition-colors flex flex-col items-start gap-4">
          <h2 className="text-xl font-bold text-white">repid.dev</h2>
          <div className="text-xs font-mono text-amber-500 px-2 py-1 bg-amber-500/10 rounded">For Everyone</div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Train an AI agent, earn rewards, stay anonymous. Your entry point to the agentic economy.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-colors flex flex-col items-start gap-4">
          <h2 className="text-xl font-bold text-white">trustrails.dev</h2>
          <div className="text-xs font-mono text-blue-500 px-2 py-1 bg-blue-500/10 rounded">For Institutions</div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            AI safety compliance and Know Your Agent infrastructure. Where institutions become AI safe and compliant.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-green-500/50 transition-colors flex flex-col items-start gap-4">
          <h2 className="text-xl font-bold text-white">trustshell.dev</h2>
          <div className="text-xs font-mono text-green-500 px-2 py-1 bg-green-500/10 rounded">For Developers</div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Wrap any AI agent with constitutional protection. <br/><br/>
            <code className="text-xs bg-black p-1 rounded text-green-400">npm install @hyperdag/trustshell</code>
          </p>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-gray-300 text-lg leading-relaxed">
          All three are built on the same trust layer for the agentic economy. Start anywhere, connect everywhere.
        </p>
      </div>

      <div className="text-center border-t border-gray-800 pt-16">
        <Link href="/learn" className="text-gray-400 hover:text-white transition-colors">
          View deep technical definitions in Learn →
        </Link>
      </div>
    </main>
  );
}
