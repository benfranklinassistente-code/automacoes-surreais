"use client";

import { useUpcomingTasks } from "@/lib/use-data";
import { FiClock, FiMail, FiFileText, FiSettings } from "react-icons/fi";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const typeIcons: Record<string, React.ReactNode> = {
  newsletter: <FiMail className="w-4 h-4" />,
  cron: <FiClock className="w-4 h-4" />,
  reminder: <FiClock className="w-4 h-4" />,
  custom: <FiSettings className="w-4 h-4" />,
};

export default function UpcomingTasks() {
  const tasks = useUpcomingTasks(5);

  if (tasks === undefined) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Próximas Tarefas</h2>
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Próximas Tarefas</h2>
        <p className="text-slate-400 text-center py-8">
          Nenhuma tarefa agendada
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FiClock className="w-5 h-5" />
        Próximas Tarefas
      </h2>

      <div className="space-y-3">
        {tasks.map((task: any) => (
          <div
            key={task._id}
            className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
          >
            <div className="p-2 bg-slate-700 rounded-lg text-amber-400">
              {typeIcons[task.type] || <FiSettings className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{task.title}</h3>
              <p className="text-slate-400 text-sm">
                {format(task.scheduledAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
              {task.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
