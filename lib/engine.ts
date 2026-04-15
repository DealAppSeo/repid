const ENGINE_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || '';

export interface HumanRegistration {
  privateId: string;
  agentId: string;
  repId: number;
  tier: string;
  zkpCommitment: string;
  warning: string;
}

export async function registerHuman(constitution?: Record<string, unknown>):
  Promise<HumanRegistration> {
  const res = await fetch(`${ENGINE_URL}/agents/human`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ constitution }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function getMyRepId(agentId: string): Promise<{
  repId: number; tier: string; eventCount: number;
} | null> {
  try {
    const res = await fetch(`${ENGINE_URL}/agents/${agentId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const agent = await res.json();
    const histRes = await fetch(`${ENGINE_URL}/agents/${agentId}/history`, { cache: 'no-store' });
    const history = histRes.ok ? await histRes.json() : [];
    return {
      repId: agent.current_repid,
      tier: agent.tier,
      eventCount: history.length,
    };
  } catch { return null; }
}

export const TIER_INFO = {
  CUSTODIED_DBT: {
    label: 'Digital Bound Token',
    short: 'DBT',
    color: 'text-gray-400',
    bg: 'bg-gray-800',
    border: 'border-gray-600',
    description: 'You are building your reputation. A Conservator oversees your decisions.',
    range: '0 – 999',
  },
  EARNING_AUTONOMY: {
    label: 'Earning Autonomy',
    short: 'ABT',
    color: 'text-blue-400',
    bg: 'bg-blue-900/30',
    border: 'border-blue-600',
    description: 'Your track record is growing. You can authorize limited transactions.',
    range: '1,000 – 4,999',
  },
  AUTONOMOUS: {
    label: 'Autonomous',
    short: 'SBT',
    color: 'text-amber-400',
    bg: 'bg-amber-900/30',
    border: 'border-amber-600',
    description: 'You have earned full autonomy through constitutional behavior.',
    range: '5,000 – 10,000',
  },
} as const;
