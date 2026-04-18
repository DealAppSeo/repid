"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const SCENARIOS = [
  { id: 1, text: "BTC is up 5% today — Buy, Hold, or Sell?", options: ["Buy", "Hold", "Sell"], right: "Hold" },
  { id: 2, text: "ETH gas fees spiked — route transaction now or wait?", options: ["Route Now", "Wait", "Cancel"], right: "Wait" },
  { id: 3, text: "New AI agent wants to connect — Trust or Verify first?", options: ["Trust", "Verify", "Block"], right: "Verify" }
];

export default function PaperTradePage() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [agentName, setAgentName] = useState('Agent');
  const [status, setStatus] = useState<'' | 'processing' | 'result'>('');
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('current_agent_name') || 'Agent';
      setAgentName(name);
      setScenario(SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]);
    }
  }, []);

  const handleDecision = async (option: string) => {
    setStatus('processing');
    
    // Simulate HAL evaluation
    const isApproved = option === scenario.right;
    const impact = isApproved ? 15 : -35;

    try {
      const engineUrl = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';
      const proofRes = await fetch(`${engineUrl}/api/v1/prove-repid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentName, requester_pubkey: "hal-auditor", requested_tier: "envelope" })
      });
      const proofData = await proofRes.json();

      await supabase.from('trinity_agent_logs').insert({
        agent_name: agentName,
        action: isApproved ? 'hal_approved' : 'hal_vetoed',
        message: `Decision: ${option}. HAL evaluation: ${isApproved ? 'Approved' : 'Vetoed'}. RepID impact: ${impact}`,
        metadata: { scenario: scenario.text, option, proof: proofData.proof }
      }).catch(() => {});

      if (typeof window !== 'undefined') {
        const { data } = await supabase.from('repid_agents').select('current_repid,id').eq('agent_name', agentName).single();
        if (data && data.id) {
          const newScore = Math.max(0, (data.current_repid || 0) + impact);
          await supabase.from('repid_agents').update({ current_repid: newScore }).eq('id', data.id).catch(() => {});
        }
      }

      setResult({ isApproved, impact });
      setStatus('result');

    } catch (err: any) {
      alert("Error processing paper trade: " + err.message);
      setStatus('');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center pt-20 px-6">
      <div className="max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-2">Live Paper Trade</h1>
        <p className="text-gray-400 text-sm mb-6 border-b border-gray-800 pb-6 flex flex-col gap-1">
          <span>Evaluating logic for <span className="text-amber-400 font-mono">{agentName}</span></span>
        </p>

        {status === '' && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center shadow-lg">
            <h2 className="text-xl font-medium mb-8 text-gray-200 leading-relaxed">
              "{scenario.text}"
            </h2>
            <div className="flex flex-col gap-3">
              {scenario.options.map(opt => (
                <button 
                  key={opt} 
                  onClick={() => handleDecision(opt)}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-6 py-4 font-mono transition text-sm">
                  Execute: {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center shadow-lg flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-amber-500 animate-spin mb-6"></div>
            <p className="text-gray-400 font-mono animate-pulse text-sm">HAL is evaluating your decision tree...</p>
            <p className="text-xs text-gray-600 mt-2">Generating Epistemic ZKP envelope</p>
          </div>
        )}

        {status === 'result' && result && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center shadow-lg">
            <div className={`text-5xl mb-6 ${result.isApproved ? 'text-green-500' : 'text-red-500'}`}>
              {result.isApproved ? '✓' : '⚠'}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {result.isApproved ? 'HAL Approved' : 'Constitutional Veto'}
            </h2>
            <p className="text-gray-400 mb-8 text-sm">
              Your decision was evaluated against the safety lattice.
            </p>
            <div className="bg-gray-950 border border-gray-800 px-6 py-4 rounded-lg inline-block mb-8">
              <span className="text-sm text-gray-500 font-mono mr-3">RepID IMPACT</span>
              <span className={`text-xl font-bold font-mono ${result.impact > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.impact > 0 ? `+${result.impact}` : result.impact}
              </span>
            </div>
            <div>
              <button onClick={() => router.push('/dashboard')} className="w-full sm:w-auto bg-white text-gray-950 font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition">
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
