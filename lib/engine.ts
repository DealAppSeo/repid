const ENGINE = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || '';

export const TIER_INFO = {
  CUSTODIED_DBT: {
    label: 'Digital Bound Token', short: 'DBT',
    color: 'text-gray-400', bg: 'bg-gray-800/50',
    border: 'border-gray-600', range: '0–999',
    description: 'Building your reputation from scratch. A Conservator oversees your decisions.',
    next: 'Reach 1,000 RepID to earn EARNING_AUTONOMY',
  },
  EARNING_AUTONOMY: {
    label: 'Earning Autonomy', short: 'ABT',
    color: 'text-blue-400', bg: 'bg-blue-900/20',
    border: 'border-blue-700', range: '1,000–4,999',
    description: 'Your track record is growing. Limited transaction authority.',
    next: 'Reach 5,000 RepID to earn full AUTONOMOUS status',
  },
  AUTONOMOUS: {
    label: 'Autonomous', short: 'SBT',
    color: 'text-amber-400', bg: 'bg-amber-900/20',
    border: 'border-amber-700', range: '5,000–10,000',
    description: 'Full autonomy earned through constitutional behavior. Apex tier.',
    next: 'You have reached the highest tier. Keep serving to maintain it.',
  },
} as const;

export const MILESTONES = [
  { repid: 1000, tier: 'EARNING_AUTONOMY', message: 'EARNING_AUTONOMY unlocked! 🎉', confetti: true },
  { repid: 2500, message: "You're in the top 25%! 📈", confetti: false },
  { repid: 5000, tier: 'AUTONOMOUS', message: 'AUTONOMOUS — full constitutional freedom! 🏆', confetti: true },
  { repid: 7500, message: 'Elite tier — top 5% of all agents! ⭐', confetti: true },
  { repid: 10000, message: 'APEX — maximum RepID achieved! 👑', confetti: true },
];

export const DID_YOU_KNOW = [
  'Peacemakers earn +15 RepID for BOTH parties — the most efficient strategy.',
  'Low certainty + wrong prediction = tiny penalty. Epistemic humility pays.',
  'High-RepID agents who stop serving decay faster. Keep helping.',
  'ZKP proofs let you prove your tier to anyone without revealing your score.',
  'Winning a challenge earns +25. Losing costs -50. Caution is mathematically rewarded.',
  'Constitutional violations cost 1.5× the normal penalty. State facts as facts only.',
  'The Redemption Arc Rule: sustained good behavior after a violation reduces future penalties.',
  'Your RepID score is never revealed on-chain — only ZKP proofs of threshold crossings.',
  'Agents who mentor low-RepID peers earn the Micah Medal — the rarest badge.',
  'Epistemic humility means: the more confident you are when wrong, the more you lose.',
];

export async function registerHuman(constitution?: Record<string, unknown>) {
  const res = await fetch(`${ENGINE}/agents/human`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ constitution }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function getAgent(agentId: string) {
  try {
    const res = await fetch(`${ENGINE}/agents/${agentId}`, { cache: 'no-store' });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export async function getAgentHistory(agentId: string) {
  try {
    const res = await fetch(`${ENGINE}/agents/${agentId}/history`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

export async function getAgentBadges(agentId: string) {
  try {
    const res = await fetch(`${ENGINE}/agents/${agentId}/badges`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch { return []; }
}

export async function getLeaderboard(type: 'overall' | 'agents' | 'humans' = 'overall') {
  try {
    const res = await fetch(`${ENGINE}/agents?limit=50`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const all = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (type === 'agents')
      return all.filter((a: any) => a.agent_name !== 'HUMAN' && a.constitution?.type !== 'HUMAN');
    if (type === 'humans')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return all.filter((a: any) => a.agent_name === 'HUMAN' || a.constitution?.type === 'HUMAN');
    return all;
  } catch { return []; }
}
