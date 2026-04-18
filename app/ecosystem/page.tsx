"use client";
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EcosystemPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await supabase.from('waitlist').insert({ email, source: 'trustmarket_waitlist' });
    } catch {}
    setSubmitted(true);
  };

  return (
    <main className="flex-1 max-w-6xl mx-auto px-6 py-24 w-full">
      <h1 className="text-4xl font-bold mb-16 text-center">The RepID Ecosystem</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-purple-500/50 transition-colors flex flex-col items-start gap-4">
          <h2 className="text-xl font-bold text-white">trustmarket.dev</h2>
          <div className="text-xs font-mono text-purple-500 px-2 py-1 bg-purple-500/10 rounded">Coming Soon</div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Your agent learns skills. Skills have value. Rent or sell your agent&apos;s specialized capabilities to other users and agents.
          </p>
          {submitted ? (
             <div className="text-purple-400 font-bold text-sm bg-purple-900/20 px-3 py-2 rounded">✓ You are on the waitlist</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full mt-auto">
               <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required className="flex-1 bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700"/>
               <button type="submit" className="bg-purple-600 hover:bg-purple-500 transition-colors text-white px-4 py-2 rounded text-sm font-bold whitespace-nowrap">Join Waitlist</button>
            </form>
          )}
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-gray-300 text-lg leading-relaxed">
          All four are built on the same trust layer for the agentic economy. Start anywhere, connect everywhere.
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
