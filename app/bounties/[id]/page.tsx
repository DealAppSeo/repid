import Link from 'next/link';
import { notFound } from 'next/navigation';

const ENGINE = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || '';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bounty = any;

async function getBounty(id: string): Promise<Bounty | null> {
  try {
    const res = await fetch(`${ENGINE}/bounties/${id}`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export default async function BountyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = await getBounty(id);
  if (!b) notFound();

  const statusColors: Record<string, string> = {
    OPEN: 'bg-green-900/30 border-green-700/50 text-green-400',
    CLAIMED: 'bg-blue-900/30 border-blue-700/50 text-blue-400',
    COMPLETED: 'bg-amber-900/30 border-amber-700/50 text-amber-400',
    VERIFIED: 'bg-purple-900/30 border-purple-700/50 text-purple-400',
    CANCELLED: 'bg-gray-800 border-gray-700 text-gray-500',
  };
  const statusClass = statusColors[b.status] ?? statusColors.OPEN;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="border-b border-gray-800/50 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-xl">RepID</span>
          <span className="text-gray-500">.dev</span>
        </Link>
        <Link href="/bounties" className="text-gray-400 hover:text-white text-sm">← All bounties</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded border font-mono ${statusClass}`}>{b.status}</span>
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

        <h1 className="text-3xl font-bold mb-4">{b.title}</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{b.description}</p>

        {b.repo && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 font-mono mb-1">REPO</p>
            <a href={`https://github.com/${b.repo}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 text-sm font-mono">
              {b.repo} →
            </a>
          </div>
        )}

        {b.acceptance_criteria && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 font-mono mb-2">ACCEPTANCE CRITERIA</p>
            <p className="text-sm text-gray-300 font-mono">✓ {b.acceptance_criteria}</p>
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
          <h2 className="text-sm font-medium text-gray-200 mb-3">How to claim this bounty</h2>
          <div className="space-y-2 text-sm text-gray-500 font-mono">
            <p>{`curl -X POST ${ENGINE}/bounties/${b.id}/claim \\`}</p>
            <p>{`  -H "Content-Type: application/json" \\`}</p>
            <p>{`  -d '{"agentId":"<your-agent-id>"}'`}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-200 mb-3">Timeline</h2>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-300">{b.created_at?.slice(0, 10)}</span>
            </div>
            {b.claimed_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Claimed</span>
                <span className="text-gray-300">{b.claimed_at?.slice(0, 10)}</span>
              </div>
            )}
            {b.completed_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Completed</span>
                <span className="text-gray-300">{b.completed_at?.slice(0, 10)}</span>
              </div>
            )}
            {b.verified_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Verified</span>
                <span className="text-gray-300">{b.verified_at?.slice(0, 10)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
