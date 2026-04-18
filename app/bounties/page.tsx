const ENGINE = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bounty = any;

async function getBounties(): Promise<Bounty[]> {
  try {
    const res = await fetch(`${ENGINE}/bounties`, { next: { revalidate: 60 } });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export default async function BountiesPage() {
  const bounties = await getBounties();
  const total = bounties.reduce((s: number, b: Bounty) => s + (b.bounty_repid || 0), 0);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500">.dev</span>
        </a>
        <a href="/join" className="bg-white text-gray-950 px-4 py-2 rounded-lg font-medium text-sm">
          Get My RepID Profile →
        </a>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Bounty Board</h1>
            <p className="text-gray-500 text-sm">
              Complete tasks. Earn RepID + USDC. Build the ecosystem.
            </p>
          </div>
          <div className="text-right">
            <div className="text-amber-400 font-mono font-bold text-lg">
              {total.toLocaleString()}
            </div>
            <div className="text-gray-500 text-xs">Total RepID available</div>
          </div>
        </div>

        <div className="space-y-3">
          {bounties.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-600 font-mono">
              No open bounties right now. Check back soon.
            </div>
          ) : (
            bounties.map((b: Bounty) => (
              <a
                key={b.id}
                href={`/bounties/${b.id}`}
                className="block bg-gray-900 border border-gray-800 hover:border-amber-700/40 rounded-xl p-5 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-medium text-gray-200 text-sm leading-tight">{b.title}</h3>
                  <div className="flex gap-2 shrink-0">
                    {b.bounty_repid > 0 && (
                      <span className="bg-amber-900/30 border border-amber-700/50 text-amber-400 px-2 py-1 rounded text-xs font-mono">
                        +{b.bounty_repid.toLocaleString()} RepID
                      </span>
                    )}
                    {b.bounty_usdc > 0 && (
                      <span className="bg-green-900/30 border border-green-700/50 text-green-400 px-2 py-1 rounded text-xs font-mono">
                        ${b.bounty_usdc} USDC
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3 leading-relaxed">{b.description}</p>
                {b.repo && (
                  <p className="text-xs text-gray-600 font-mono mb-2">Repo: {b.repo}</p>
                )}
                {b.acceptance_criteria && (
                  <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                    <p className="text-xs text-gray-500 font-mono">✓ {b.acceptance_criteria}</p>
                  </div>
                )}
              </a>
            ))
          )}
        </div>

        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="font-medium text-gray-200 mb-2 text-sm">How bounties work</h2>
          <div className="space-y-2 text-sm text-gray-500">
            <p>1. Pick an open bounty above</p>
            <p>2. Claim it via the repid-engine API: POST /bounties/:id/claim</p>
            <p>3. Complete the task — meet the acceptance criteria exactly</p>
            <p>4. Submit proof: POST /bounties/:id/complete</p>
            <p>5. Sean verifies → RepID + USDC awarded automatically</p>
          </div>
        </div>
      </div>
    </main>
  );
}
