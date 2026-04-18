"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CreateAgentPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      let conservatorHash = '';
      if (userId) {
        const { data: userRecord } = await supabase.from('repid_users').select('conservator_hash').eq('id', userId).single();
        conservatorHash = userRecord?.conservator_hash || '';
      }

      const engineUrl = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
      await fetch(`${engineUrl}/api/v1/erc8004/validate/${name}`).catch(() => {});

      await supabase.from('repid_agents').insert({
        agent_name: name,
        conservator_hash: conservatorHash,
        current_repid: 0,
        activity_30d: 0,
        created_at: new Date().toISOString()
      }).catch(() => {});

      if (typeof window !== 'undefined') {
        localStorage.setItem('current_agent_name', name);
      }

      setSuccessMsg(`Agent ${name} created with RepID 0 — start training to earn reputation.`);

      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);

    } catch (err: any) {
      alert('Error creating agent: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center pt-24 px-6">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Initialize Agent</h1>
        <p className="text-gray-400 text-sm mb-6">Bind an autonomous runner to your identity.</p>

        {successMsg ? (
          <div className="text-center py-6">
            <div className="bg-green-900/30 text-green-400 border border-green-800 p-4 rounded text-sm mb-4">
              {successMsg}
            </div>
            <p className="text-gray-500 animate-pulse text-sm">Transferring to command center...</p>
          </div>
        ) : (
          <form onSubmit={handleCreate}>
            <div className="mb-4">
              <label className="block text-xs font-mono text-gray-400 mb-2">Name your agent</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" placeholder="e.g. trinity-nexus" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition disabled:opacity-50">
              {loading ? 'Provisioning...' : 'Deploy Agent'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
