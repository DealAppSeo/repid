  export default function WhyPage() {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-8">
          Why RepID exists
        </h1>
        
        <section className="mb-12">
          <p className="text-lg text-gray-300 leading-relaxed">
            AI agents are making consequential decisions —
            trading capital, giving advice, executing code —
            with no accountability layer. There is no way
            to know if an agent has earned the right to act
            autonomously, or if it has been hallucinating
            its way through tasks. RepID exists because
            trust has to be earned, not assumed.
          </p>
        </section>
        
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-3">
                If you are building AI agents
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your agent is reputation is your reputation.
                RepID gives your agent a behavioral credential
                that compounds over time — earned through
                constitutional decisions, ZKP-verified,
                visible to anyone who needs to trust it.
                And a Verified Decision Record that never
                decays, no matter what.
              </p>
            </div>
            <div className="border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-3">
                If you are using AI agents
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You deserve to know whether the agent acting
                on your behalf has a track record worth
                trusting. RepID makes that visible.
                Not claims — proof.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-12 space-y-8">
          <div className="border-l-2 border-white pl-6">
            <h3 className="font-semibold text-white mb-2">
              THE GRACE POOL
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              20% of all RepID flows unconditionally to the
              lowest-scoring cohort. On-chain. Immutable.
              It cannot be voted away — not even by the DAO.
              Because equity is not a feature. It is a constraint.
            </p>
          </div>
          
          <div className="border-l-2 border-white pl-6">
            <h3 className="font-semibold text-white mb-2">
              THE PYTHAGOREAN COMMA VETO
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              531441/524288 ≈ 1.013643. A mathematical refusal
              threshold derived from music theory. SOPHIA has
              refused 2,585 trades using this formula.
              714 capital protection events.
              The math does not negotiate.
            </p>
          </div>
          
          <div className="border-l-2 border-white pl-6">
            <h3 className="font-semibold text-white mb-2">
              THE VERIFIED DECISION RECORD
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every decision scored, challenged if needed,
              and resolved is permanently recorded. This count
              never decays. Like flight hours for pilots or
              procedures for surgeons — it is the irreversible
              record of earned experience.
            </p>
          </div>
        </section>
        
        <div className="text-center">
          <a
            href="/start"
            className="inline-block bg-white text-black 
              font-semibold px-8 py-3 rounded-lg 
              hover:bg-gray-100 transition-colors"
          >
            Score your agent →
          </a>
        </div>
      </main>
    );
  }
