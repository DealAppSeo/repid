import { notFound } from 'next/navigation';

export const revalidate = 60; // 60 seconds cache

interface AgentCard {
  agent_id: string;
  name: string | null;
  description: string | null;
  constitution_text?: string | null;
  repid: number;
  total_decisions: number;
  total_score_events: number;
  total_clean: number;
  total_flagged: number;
  total_vetoed: number;
  avg_hal_score: number | null;
  last_event_at: string | null;
  created_at: string | null;
}

function getTier(repid: number) {
  if (repid < 100) return "Probationary";
  if (repid < 1000) return "Building";
  if (repid < 2500) return "Established";
  if (repid < 5000) return "Trusted";
  return "Veteran";
}

function getTierColor(repid: number) {
  if (repid < 100) return "bg-gray-800 text-gray-300 border-gray-700";
  if (repid < 1000) return "bg-blue-900/30 text-blue-400 border-blue-800";
  if (repid < 2500) return "bg-indigo-900/30 text-indigo-400 border-indigo-800";
  if (repid < 5000) return "bg-purple-900/30 text-purple-400 border-purple-800";
  return "bg-amber-900/30 text-amber-400 border-amber-800";
}

function timeAgo(dateString: string | null) {
  if (!dateString) return "No activity yet";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export default async function AgentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const API_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || "https://repid-engine-production.up.railway.app";
  let agent: AgentCard | null = null;
  let backendDown = false;

  try {
    const res = await fetch(`${API_URL}/api/v1/agents/${id}/card`, {
      next: { revalidate: 60 }
    });
    if (res.status === 404) {
      notFound();
    }
    if (!res.ok) {
      backendDown = true;
    } else {
      agent = await res.json();
    }
  } catch (e) {
    backendDown = true;
  }

  if (backendDown) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 w-full">
        <div className="bg-red-900/20 border border-red-800 text-red-200 p-6 rounded-xl max-w-md text-center">
          RepID engine unavailable, try again in a moment.
        </div>
      </main>
    );
  }

  if (!agent) return notFound();

  const name = agent.name || `Agent ${id.substring(0, 8)}`;
  const tier = getTier(agent.repid);
  const tierColor = getTierColor(agent.repid);
  
  const excerptSource = agent.constitution_text || agent.description;
  let excerpt = "";
  if (excerptSource) {
    excerpt = excerptSource.substring(0, 200);
    if (excerptSource.length > 200) {
      const lastSpace = excerpt.lastIndexOf(" ");
      if (lastSpace > 0) excerpt = excerpt.substring(0, lastSpace);
      excerpt += "...";
    }
  }

  const isNew = agent.total_score_events === 0;

  return (
    <main className="flex-1 flex flex-col items-center px-6 py-16 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border-b border-gray-800 pb-10 mb-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white break-all">{name}</h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tierColor}`}>
              {tier}
            </span>
          </div>
          <p className="text-gray-500 font-mono text-xs">ID: {id}</p>
        </div>
        
        <div className="flex flex-col items-center md:items-end bg-gray-900/50 border border-gray-800 rounded-2xl p-6 min-w-[200px]">
          <span className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">RepID Score</span>
          <span className="text-5xl font-extrabold text-white">{agent.repid.toLocaleString()}</span>
        </div>
      </div>

      {/* Constitution Excerpt */}
      {excerpt && (
        <div className="w-full mb-10 bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Constitution Excerpt</h3>
          <p className="text-gray-300 italic leading-relaxed">&ldquo;{excerpt}&rdquo;</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="w-full mb-16">
        <h3 className="text-xl font-bold text-white mb-6">Decision Record</h3>
        
        {isNew ? (
          <div className="w-full bg-gray-900/30 border border-gray-800 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h4 className="text-lg font-medium text-white mb-2">New agent</h4>
            <p className="text-gray-500">No decisions evaluated yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col">
              <span className="text-gray-500 text-sm mb-1">Evaluated</span>
              <span className="text-3xl font-bold text-white">{agent.total_score_events}</span>
            </div>
            <div className="bg-green-950/20 border border-green-900/50 rounded-xl p-5 flex flex-col">
              <span className="text-green-500 text-sm mb-1">Clean</span>
              <span className="text-3xl font-bold text-green-400">{agent.total_clean}</span>
            </div>
            <div className="bg-yellow-950/20 border border-yellow-900/50 rounded-xl p-5 flex flex-col">
              <span className="text-yellow-500 text-sm mb-1">Flagged</span>
              <span className="text-3xl font-bold text-yellow-400">{agent.total_flagged}</span>
            </div>
            <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-5 flex flex-col">
              <span className="text-red-500 text-sm mb-1">Vetoed</span>
              <span className="text-3xl font-bold text-red-400">{agent.total_vetoed}</span>
            </div>
          </div>
        )}
        
        {/* Additional metadata below stats */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 bg-gray-950 px-4 py-3 rounded-lg border border-gray-900">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Last activity: {timeAgo(agent.last_event_at)}
          </div>
          {agent.avg_hal_score !== null && agent.avg_hal_score !== undefined && (
            <div className="font-mono text-xs">
              Avg HAL Score (last 100): <span className="text-gray-300">{Number(agent.avg_hal_score).toFixed(4)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Call to Action */}
      <div className="w-full text-center pt-10 border-t border-gray-800">
        <p className="text-gray-400">
          Want this for your agent?{' '}
          <a href="https://trustshell.dev" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Integrate the SDK →
          </a>
        </p>
      </div>
    </main>
  );
}
