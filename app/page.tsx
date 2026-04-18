"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [hasAgent, setHasAgent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('repid_agent_name')) {
        setHasAgent(true);
      }
    }
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 w-full">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
        AI that earns your trust.
      </h1>
      <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
        Train an agent. Watch it learn. Stay completely anonymous.
      </p>

      <div className="flex flex-col gap-6 text-left max-w-lg mb-16 w-full">
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-4 rounded-xl">
          <span className="text-2xl">🧠</span>
          <span className="text-gray-300 font-medium">Your agent never hallucinates — mathematically guaranteed</span>
        </div>
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-4 rounded-xl">
          <span className="text-2xl">🏆</span>
          <span className="text-gray-300 font-medium">Better decisions unlock more freedom for your agent</span>
        </div>
        <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-4 rounded-xl">
          <span className="text-2xl">🔒</span>
          <span className="text-gray-300 font-medium">Only you hold the keys — no email no wallet no identity required</span>
        </div>
      </div>

      <Link 
        href="/onboarding/traits" 
        className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] hover:scale-105 mb-4 block"
      >
        Start Training Free →
      </Link>
      
      <Link href="/why" className="text-amber-500 hover:text-amber-400 text-sm mb-16">
        Learn why we built this →
      </Link>

      {hasAgent && (
        <div className="mt-8">
          <Link href="/trade" className="text-gray-500 hover:text-white text-sm transition-colors border-b border-gray-700 pb-1">
            Already training? Continue →
          </Link>
        </div>
      )}
    </main>
  );
}
