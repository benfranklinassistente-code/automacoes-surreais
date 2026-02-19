"use client";

import { useActivities } from "@/lib/use-data";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiPlay,
  FiMail,
  FiFileText,
  FiSearch,
  FiCalendar,
  FiMessageSquare,
  FiSettings,
  FiActivity,
  FiTrendingUp
} from "react-icons/fi";

const typeIcons: Record<string, React.ReactNode> = {
  task: <FiSettings className="w-4 h-4" />,
  email: <FiMail className="w-4 h-4" />,
  blog: <FiFileText className="w-4 h-4" />,
  search: <FiSearch className="w-4 h-4" />,
  cron: <FiCalendar className="w-4 h-4" />,
  message: <FiMessageSquare className="w-4 h-4" />,
  tokens: <FiTrendingUp className="w-4 h-4" />,
  agent: <FiActivity className="w-4 h-4" />,
  system: <FiSettings className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  completed: "bg-green-500",
  running: "bg-blue-500 animate-pulse",
  failed: "bg-red-500",
  scheduled: "bg-yellow-500",
};

const statusIcons: Record<string, React.ReactNode> = {
  completed: <FiCheckCircle className="w-4 h-4 text-green-500" />,
  running: <FiPlay className="w-4 h-4 text-blue-500 animate-pulse" />,
  failed: <FiXCircle className="w-4 h-4 text-red-500" />,
  scheduled: <FiClock className="w-4 h-4 text-yellow-500" />,
};

function TimeAgo({ timestamp }: { timestamp: number }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <span>
      {formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR })}
    </span>
  );
}

export default function ActivityFeed() {
  const activities = useActivities(30);

  if (activities === undefined) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Feed de Atividades
        </h2>
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Feed de Atividades
        </h2>
        <p className="text-slate-400 text-center py-8">
          Nenhuma atividade registrada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        Feed de Atividades
        <span className="text-sm font-normal text-slate-400 ml-auto">
          {activities.length} ações
        </span>
      </h2>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-slate-700 ${statusColors[activity.status]}`}>
                {typeIcons[activity.type] || <FiSettings className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-medium truncate">{activity.title}</h3>
                  {statusIcons[activity.status]}
                </div>
                <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="px-2 py-0.5 bg-slate-700 rounded">{activity.type}</span>
                  <TimeAgo timestamp={activity.createdAt} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
