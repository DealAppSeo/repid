"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NamePage() {
  const [traits, setTraits] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTraits = localStorage.getItem('agent_traits');
      if (storedTraits) {
        try { setTraits(JSON.parse(storedTraits)); } catch {}
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    try {
      const engineUrl = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
      const uuid = crypto.randomUUID();
      const res = await fetch(`${engineUrl}/api/v1/prove-repid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: name, requester_pubkey: uuid, requested_tier: "postcard" })
      });
      
      const data = await res.json();
      const proof = data.proof || 'mock-private-id-' + Math.random();

      if (typeof window !== 'undefined') {
        localStorage.setItem('repid_agent_name', name);
        localStorage.setItem('repid_private_id', proof);
      }

      router.push('/trade');
    } catch (err: any) {
      alert("Error initializing agent identity: " + err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-8">Name your agent</h1>
        
        <form onSubmit={handleSubmit} className="mb-10">
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="e.g. quantum-voyager"
            className="w-full bg-gray-900 border-2 border-gray-700 rounded-xl px-6 py-4 text-xl text-center text-white focus:outline-none focus:border-amber-500 transition-colors mb-6"
            required
            autoFocus
          />
          <button 
            type="submit" 
            disabled={loading || !name.trim()}
            className="w-full bg-amber-500 text-gray-950 font-bold py-4 rounded-xl text-lg hover:bg-amber-400 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-amber-500"
          >
            {loading ? 'Generating ZKP Identity...' : 'Ignite Agent ⚡'}
          </button>
        </form>

        {traits.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-4">Constitutional Directives</p>
            <div className="flex flex-wrap justify-center gap-2">
              {traits.map(t => (
                <span key={t} className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
