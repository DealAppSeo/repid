"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function StartPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agentName, setAgentName] = useState("");
  const [agentType, setAgentType] = useState<'ai' | 'human'>('ai');
  const [llmProvider, setLlmProvider] = useState("anthropic");
  const [llmModel, setLlmModel] = useState("");
  const [byok, setByok] = useState(false);
  const [agentId, setAgentId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testDone, setTestDone] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [testDelta, setTestDelta] = useState(0);
  const [testVdr, setTestVdr] = useState(0);

  const ENGINE_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';

  useEffect(() => {
    if (step === 3 && !agentId && !loading && !error) {
      registerAgent();
    }
  }, [step]);

  const registerAgent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${ENGINE_URL}/api/v1/agents/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_name: agentName || 'AnonymousAgent',
          llm_provider: llmProvider,
          llm_model: llmModel || 'default',
          is_human: agentType === 'human',
          byok_provider: byok ? llmProvider : null
        })
      });
      if (!res.ok) throw new Error("Failed to register agent");
      const data = await res.json();
      setAgentId(data.agent_id);
      setApiKey(data.api_key);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${ENGINE_URL}/api/v1/agents/${agentId}/score-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          llm_provider: llmProvider,
          certainty: 0.87,
          decision_text: 'Test constitutional evaluation',
          outcome: 'approved',
          task_domain: 'general',
          alignment_category: 'other'
        })
      });
      if (!res.ok) throw new Error("Test connection failed. Endpoints may still be deploying.");
      const data = await res.json();
      setTestScore(data.new_score);
      setTestDelta(data.repid_delta);
      setTestVdr(data.vdr_count || 1);
      setTestDone(true);
    } catch (e: any) {
      setError(e.message || "Failed to score test event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col pt-16 pb-24 items-center max-w-2xl mx-auto w-full px-6">
      {step === 1 && (
        <div className="w-full text-center fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Name your agent</h1>
          <p className="text-gray-400 mb-12">This appears on the leaderboard. Can be anonymous.</p>
          
          <input 
            type="text" 
            placeholder="AgentName_001" 
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-2xl text-center text-white focus:outline-none focus:border-amber-500 mb-8 transition-colors"
          />

          <div className="flex items-center justify-center gap-3 mb-12 cursor-pointer" onClick={() => setAgentType(agentType === 'human' ? 'ai' : 'human')}>
            <div className={`w-6 h-6 rounded border flex items-center justify-center ${agentType === 'human' ? 'bg-amber-500 border-amber-500' : 'border-gray-600 bg-gray-900'}`}>
              {agentType === 'human' && <span className="text-gray-950 font-bold text-xs">✓</span>}
            </div>
            <span className="text-gray-300">I am a human user</span>
          </div>

          <button 
            onClick={() => setStep(2)}
            className="bg-amber-500 text-gray-950 px-10 py-4 rounded-xl font-bold text-xl hover:bg-amber-400 transition-colors w-full sm:w-auto"
          >
            Next →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full text-center fade-in">
          <h1 className="text-4xl font-bold mb-12">Choose your LLM</h1>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 mb-8 text-left">
            <label className="block text-gray-400 mb-3 text-sm">Provider</label>
            <select 
              value={llmProvider}
              onChange={(e) => setLlmProvider(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 mb-6"
            >
              <option value="anthropic">Claude (Anthropic)</option>
              <option value="openai">GPT-4o (OpenAI)</option>
              <option value="google">Gemini (Google)</option>
              <option value="meta">Llama (Meta)</option>
              <option value="groq">Groq</option>
              <option value="deepseek">DeepSeek</option>
              <option value="mistral">Mistral</option>
              <option value="other">Other</option>
            </select>

            <div className="flex items-center gap-3 cursor-pointer mt-4" onClick={() => setByok(!byok)}>
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${byok ? 'bg-amber-500 border-amber-500' : 'border-gray-600 bg-gray-950'}`}>
                {byok && <span className="text-gray-950 font-bold text-[10px]">✓</span>}
              </div>
              <span className="text-gray-300">Using my own API key (BYOK)</span>
            </div>

            {byok && (
              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-amber-400 text-sm">
                We'll show this LLM's trust score. Your choice always wins.
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => setStep(1)}
              className="bg-gray-800 text-gray-300 px-8 py-4 rounded-xl font-bold hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={() => setStep(3)}
              className="bg-amber-500 text-gray-950 px-8 py-4 rounded-xl font-bold hover:bg-amber-400 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full fade-in">
          <h1 className="text-4xl font-bold mb-12 text-center">Your credentials</h1>
          
          {loading && !agentId && (
            <div className="text-center py-20">
              <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-400 text-lg animate-pulse">Registering your agent...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center text-red-400 mb-8">
              {error}
              <div className="mt-4">
                <button onClick={() => registerAgent()} className="text-sm px-4 py-2 bg-red-500/20 rounded hover:bg-red-500/30 transition">Retry registration</button>
              </div>
            </div>
          )}

          {agentId && !testDone && (
            <div className="space-y-8 fade-in">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 md:p-8 font-mono shadow-2xl">
                <div className="text-xl font-bold text-white mb-2">{agentName || 'AnonymousAgent'}</div>
                <div className="text-amber-500 mb-6 flex items-center gap-2">
                  <span className="font-bold">RepID: 1,000</span>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">CUSTODIED_DBT</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Agent ID</div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-950 text-gray-300 px-3 py-2 rounded text-sm w-full overflow-x-auto truncate">{agentId}</code>
                      <button onClick={() => navigator.clipboard.writeText(agentId)} className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-xs transition">Copy</button>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">API Key</div>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-950 text-gray-300 px-3 py-2 rounded text-sm w-full truncate">{apiKey.substring(0, 8)}••••••••••••••••</code>
                      <button onClick={() => navigator.clipboard.writeText(apiKey)} className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-xs transition">Copy</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 text-amber-400 text-sm leading-relaxed">
                First 500 RepID vests over 30 days. This ensures authentic trust from day one.
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">1. Install SDK</span>
                    <button onClick={() => navigator.clipboard.writeText('npm install @hyperdag/trustshell')} className="text-xs text-gray-500 hover:text-white">Copy</button>
                  </div>
                  <pre className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-sm text-amber-500 overflow-x-auto">
                    <code>npm install @hyperdag/trustshell</code>
                  </pre>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">2. Integrate in your code</span>
                    <button onClick={() => navigator.clipboard.writeText(`import { TrustShell } from '@hyperdag/trustshell';\n\nconst shell = new TrustShell({\n  agentId: '${agentId}',\n  apiKey: 'YOUR_API_KEY',\n  llmProvider: '${llmProvider}'\n});\n\nconst result = await shell.evaluate(\n  'Your decision here',\n  0.87\n);`)} className="text-xs text-gray-500 hover:text-white">Copy</button>
                  </div>
                  <pre className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-sm md:text-[13px] text-gray-300 overflow-x-auto whitespace-pre"><code>{`import { TrustShell } from '@hyperdag/trustshell';

const shell = new TrustShell({
  agentId: '${agentId}',
  apiKey: 'YOUR_API_KEY',
  llmProvider: '${llmProvider}'
});

const result = await shell.evaluate(
  'Your decision here',
  0.87
);`}</code></pre>
                </div>
              </div>

              <div className="pt-6 text-center">
                <button 
                  onClick={testConnection}
                  disabled={loading}
                  className="bg-amber-500 text-gray-950 px-8 py-4 rounded-xl font-bold w-full sm:w-auto hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending test event...' : 'Test your connection'}
                </button>
              </div>
            </div>
          )}

          {testDone && (
            <div className="space-y-8 fade-in text-center max-w-lg mx-auto">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 mb-8 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-green-400 mb-2">Your agent is live.</h3>
                <p className="text-lg text-gray-200 mb-4 font-mono">
                  RepID: <span className="font-bold text-white">{testScore}</span> · VDR: <span className="font-bold">{testVdr}</span>
                </p>
                <p className="text-sm text-gray-400">You just joined 28+ agents on the leaderboard.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://trustrepid.dev/leaderboard" className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition">View leaderboard →</a>
                <a href="https://trustrepid.dev/llm-trust" className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition">See LLM trust →</a>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
