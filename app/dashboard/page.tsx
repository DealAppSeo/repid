"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const [agentName, setAgentName] = useState('Agent');
  const [repidScore, setRepidScore] = useState<number>(0);
  const [tier, setTier] = useState('CUSTODIED_DBT');
  const [logs, setLogs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    let name = '';
    if (typeof window !== 'undefined') {
      name = localStorage.getItem('current_agent_name') || 'Agent';
      setAgentName(name);
    }
    
    // Fetch RepID score
    const engineUrl = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
    fetch(`${engineUrl}/api/v1/repid/${name}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.repid_score !== undefined) {
          setRepidScore(data.repid_score);
          setTier(data.tier_level || 'CUSTODIED_DBT');
        }
      }).catch(() => {});

    // Fetch Last 5 Logs
    supabase.from('trinity_agent_logs')
      .select('*')
      .or(`agent_name.eq.${name},metadata->>agent_id.eq.${name}`)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setLogs(data);
      });

  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-6 mb-8 pt-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex flex-wrap items-center gap-3">
              {agentName}
              <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 font-mono font-normal tracking-wide">
                {tier}
              </span>
            </h1>
            <p className="text-gray-500 mt-1">RepID Score: <span className="text-amber-400 font-bold">{repidScore.toLocaleString()}</span></p>
          </div>
          <button onClick={() => router.push('/paper-trade')} className="bg-amber-500 text-gray-950 px-6 py-2 rounded-lg font-bold hover:bg-amber-400 transition w-full sm:w-auto">
            Start Paper Trade
          </button>
        </header>

        <section>
          <h2 className="text-xl font-bold mb-4 font-mono text-gray-300 flex justify-between items-center">
            Agent Activity Log
            <span className="text-xs text-gray-600 font-normal">Last 5 Entries</span>
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {logs.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">No activity found. Run a paper trade to start earning reputation.</div>
            ) : (
              <ul className="divide-y divide-gray-800/50">
                {logs.map(lg => (
                  <li key={lg.id} className="p-4 flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <div className="text-xs text-gray-500 whitespace-nowrap mt-1 font-mono">
                      {new Date(lg.created_at).toLocaleTimeString()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-200 mb-1">{lg.action}</div>
                      <div className="text-xs text-gray-400 break-all font-mono whitespace-pre-wrap">
                        {lg.message || JSON.stringify(lg.metadata)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        
        <div className="mt-12 border-t border-gray-800 pt-6 flex gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-white">← Return to Portal</Link>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/signup'); }} className="text-sm text-gray-500 hover:text-white">Logout</button>
        </div>
      </div>
    </main>
  );
}
