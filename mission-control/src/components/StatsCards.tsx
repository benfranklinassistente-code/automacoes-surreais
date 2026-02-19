"use client";

import { useActivityStats } from "@/lib/use-data";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  FiActivity, 
  FiCheckCircle, 
  FiXCircle, 
  FiTrendingUp,
  FiCpu
} from "react-icons/fi";

export default function StatsCards() {
  const stats = useActivityStats();
  
  // Buscar atividades de tokens para calcular total
  const tokenActivities = useQuery(api.activities.list, { type: "tokens", limit: 100 });

  // Calcular total de tokens usados
  let totalTokensUsed = 0;
  if (tokenActivities) {
    for (const activity of tokenActivities) {
      if (activity.metadata?.totalTokens) {
        totalTokensUsed += activity.metadata.totalTokens;
      }
    }
  }

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(2)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
    return tokens.toString();
  };

  const cards = [
    {
      title: "Total de Ações",
      value: stats?.total ?? 0,
      icon: <FiActivity className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Tokens Usados",
      value: formatTokens(totalTokensUsed),
      icon: <FiCpu className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Concluídas",
      value: stats?.completed ?? 0,
      icon: <FiCheckCircle className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Falharam",
      value: stats?.failed ?? 0,
      icon: <FiXCircle className="w-6 h-6" />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div 
          key={i}
          className="bg-slate-900 rounded-xl p-4 border border-slate-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">{card.title}</span>
            <div className={`${card.color} p-2 rounded-lg text-white`}>
              {card.icon}
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {stats === undefined ? "..." : card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
