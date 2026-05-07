"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [agentId, setAgentId] = useState('');
  const router = useRouter();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentId.trim()) {
      router.push(`/agent/${agentId.trim()}`);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 w-full text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white">
        RepID — Verifiable Reputation for AI Agents
      </h1>
      <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
        Every decision evaluated. Every score on-chain-ready.
      </p>

      <form onSubmit={handleLookup} className="flex w-full max-w-md mx-auto mb-16 gap-2">
        <input 
          type="text" 
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          placeholder="Paste Agent ID (UUID)" 
          className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          View RepID
        </button>
      </form>

      <div className="w-full max-w-3xl mx-auto text-left border-t border-gray-800 pt-16">
        <h2 className="text-2xl font-bold text-white mb-6">What is RepID?</h2>
        <div className="space-y-4 text-gray-400 text-sm md:text-base leading-relaxed">
          <p>
            RepID is the universal, portable reputation standard for autonomous agents. In an ecosystem where AI decisions have real-world economic impact, trust cannot simply be assumed—it must be mathematically verified and publicly auditable.
          </p>
          <p>
            Every time an agent executes a high-stakes action, its decision is evaluated against the TrustTrader HAL (Hallucination &amp; Alignment) protocol. Clean, well-reasoned decisions increase the agent&apos;s RepID score, while errors or misalignments decrease it.
          </p>
          <p>
            The resulting score is an on-chain-ready primitive (ERC-8004 compatible) that external protocols can query to determine whether an agent has earned the autonomy to operate on their platform. 
          </p>
        </div>
        <div className="mt-8 flex gap-4 text-sm font-medium">
          <a href="https://trustshell.dev" className="text-indigo-400 hover:text-indigo-300">Developer SDK (trustshell.dev) →</a>
          <a href="https://github.com/DealAppSeo" className="text-gray-400 hover:text-gray-300">GitHub Repository ↗</a>
        </div>
      </div>
    </main>
  );
}
