"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashResult, setHashResult] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error("No user returned");

      await supabase.rpc('run_sql', { sql: 'CREATE TABLE IF NOT EXISTS repid_users (id UUID PRIMARY KEY, email TEXT, created_at TIMESTAMP DEFAULT NOW(), conservator_hash TEXT);' }).catch(() => {});

      const engineUrl = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
      const proofRes = await fetch(`${engineUrl}/api/v1/prove-repid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: user.id, requester_pubkey: "new-user", requested_tier: "postcard" })
      });
      const proofData = await proofRes.json();
      const proof = proofData.proof || 'mock-hash-' + user.id.substring(0, 8);

      setHashResult(proof);

      await supabase.from('repid_users').upsert({
        id: user.id,
        email: user.email,
        conservator_hash: proof,
        created_at: new Date().toISOString()
      }).catch(() => {});

      setTimeout(() => {
        router.push('/create-agent');
      }, 2000);
      
    } catch (err: any) {
      alert(err.message || 'Error signing up');
    } finally {
      if (!hashResult) setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center pt-24 px-6">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">Claim Your Identity</h1>
        <p className="text-gray-400 text-sm mb-6">Create a secure conservator profile. Your email is never exposed on-chain.</p>
        
        {hashResult ? (
          <div className="text-center py-8">
            <div className="text-amber-400 font-mono text-sm mb-2">Identity Hash Generated:</div>
            <div className="bg-gray-800 p-3 rounded font-mono text-xs text-gray-300 break-all border border-amber-900 mb-6">
              {hashResult}
            </div>
            <p className="text-sm text-gray-400 animate-pulse">Routing to Agent Setup...</p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-amber-500 text-gray-950 font-bold py-2 px-4 rounded hover:bg-amber-400 transition disabled:opacity-50 mt-4">
              {loading ? 'Processing...' : 'Register as Conservator'}
            </button>
          </form>
        )}
      </div>
      <div className="mt-6">
        <Link href="/" className="text-gray-500 hover:text-white text-sm">← Back to Home</Link>
      </div>
    </main>
  );
}
