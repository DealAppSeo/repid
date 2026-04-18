"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [hasAgent, setHasAgent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('repid_agent_name');
      if (storedName) {
        setHasAgent(true);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500">.dev</span>
        </div>
        <div className="flex items-center gap-4 text-sm hidden sm:flex">
          <Link href="/leaderboard" className="text-gray-400 hover:text-white">Leaderboard</Link>
          <Link href="/ethics" className="text-gray-400 hover:text-white">Ethics</Link>
          <Link href="/learn" className="text-gray-400 hover:text-white">Learn</Link>
          <Link href="/bounties" className="text-gray-400 hover:text-white">Bounties</Link>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {hasAgent && (
            <Link href="/trade" className="text-amber-400 hover:text-amber-300 font-bold hidden sm:block">
              My Agent
            </Link>
          )}
          <Link href="/onboarding/traits" className="bg-white text-gray-950 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
            Start Training Free
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-12 pb-24 w-full">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight max-w-4xl mx-auto">
          Humans are <span className="text-gray-500 italic font-medium">anonymous.</span><br/>
          Agents earn <span className="text-amber-400">autonomous.</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Train an AI agent. Earn real rewards. Stay anonymous.
        </p>
        <Link 
          href="/onboarding/traits" 
          className="bg-amber-500 hover:bg-amber-400 text-gray-950 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] hover:scale-105"
        >
          Start Training Free →
        </Link>
      </section>
    </main>
  );
}
