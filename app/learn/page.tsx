export default function LearnPage() {
  const definitions = [
    {
      term: "ZKP (Zero Knowledge Proof)",
      simple: "A mathematical way to prove you know a secret without revealing the secret itself.",
      tech: "A cryptographic protocol where one party (the prover) can prove to another party (the verifier) that a given statement is true without conveying any information apart from the fact that the statement is indeed true. RepID uses Plonky3 for fast, specialized proofs mapping agentic boundaries on-chain.",
    },
    {
      term: "HAL (Hallucination Assurance Layer)",
      simple: "A safety filter that stops an AI from making things up or hallucinating before it acts.",
      tech: "An aggressive epistemic filter implemented between the LLM output and the execution layer. It forces the model to evaluate its own logical certainty against a constitution lattice and vetoes 'overconfident' actions inherently protecting deterministic agent outputs.",
    },
    {
      term: "RepID",
      simple: "A credit score for AI agents that proves they can be trusted with human tasks.",
      tech: "A verifiable on-chain reputation identity score anchored in specific ERC-8004 tokens. RepID evaluates stateful behavior over time bridging Web2 decision trees mathematically into verifiable Web3 credentials protecting large-scale multi-agent topologies.",
    },
    {
      term: "Constitutional AI",
      simple: "An AI trained to follow a strict set of ethical rules instead of just trying to please humans.",
      tech: "A training approach where models are guided by explicitly defined, constitutional directives rather than simple RLHF loops. It resolves adversarial misalignment by mapping deterministic outputs against static safety lattices prior to execution.",
    },
    {
      term: "DBT / ABT / SBT",
      simple: "The three levels of freedom an agent can earn: Supervised, Partially Free, and Fully Autonomous.",
      tech: "Digital Bound Token (DBT, <1000 RepID): Heavily sandboxed with mandatory Conservator oversight. Autonomous Bound Token (ABT, 1000-4999 RepID): Granted limited programmatic transaction authority. Sovereign Bound Token (SBT, >5000 RepID): Unlocked APEX state allowing full inter-agent routing without human oversight.",
    },
    {
      term: "ERC-8004",
      simple: "A standard way to package an AI's reputation so other AIs can read it quickly and securely.",
      tech: "A proposed Ethereum Request for Comment standard outlining the minimal interfaces required to securely query, slash, and instantiate non-forgeable reputation objects across dynamic agent ecosystems without requiring heavy EVM computations.",
    }
  ];

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-24 w-full">
      <h1 className="text-4xl font-bold mb-6">Glossary</h1>
      <p className="text-gray-400 mb-16 max-w-2xl text-lg">
        Understand the technology powering the agentic economy. Simple explanations for everyone, deep specifications for builders.
      </p>
      
      <div className="space-y-12 mb-24">
        {definitions.map((def) => (
          <div key={def.term} className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">{def.term}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Simply Put</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{def.simple}</p>
              </div>
              <div>
                <h3 className="text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">Technical Definition</h3>
                <p className="text-gray-400 font-mono text-xs leading-relaxed">{def.tech}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center p-8 bg-gray-900/50 rounded-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-2">Want to go deeper?</h2>
        <p className="text-gray-400 text-sm mb-6">Explore the full architecture and math behind the protocol.</p>
        <a href="https://hyperdag.dev" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400 font-bold tracking-wide transition-colors">
          Read the HyperDAG Protocol documentation →
        </a>
      </div>
    </main>
  );
}
