"use client";

import { useWeeklyTasks } from "@/lib/use-data";
import { 
  startOfWeek, 
  addDays, 
  format, 
  isToday,
  startOfDay 
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";

const typeColors: Record<string, string> = {
  newsletter: "bg-amber-500/20 border-amber-500 text-amber-200",
  cron: "bg-blue-500/20 border-blue-500 text-blue-200",
  reminder: "bg-green-500/20 border-green-500 text-green-200",
  custom: "bg-purple-500/20 border-purple-500 text-purple-200",
};

function TaskTime({ timestamp }: { timestamp: number }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  return <span>{format(timestamp, "HH:mm", { locale: ptBR })}</span>;
}

// Obter início do dia em UTC
function getUTCDayStart(date: Date): number {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0, 0, 0, 0
  );
}

export default function CalendarView() {
  const [mounted, setMounted] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Busca tarefas da semana atual (calculado no servidor)
  const tasks = useWeeklyTasks();

  const days = [...Array(7)].map((_, i) => addDays(currentWeekStart, i));

  const goToPrevWeek = () => setCurrentWeekStart(prev => addDays(prev, -7));
  const goToNextWeek = () => setCurrentWeekStart(prev => addDays(prev, 7));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));

  const getTasksForDay = (day: Date) => {
    if (!tasks) return [];
    
    // Usar UTC para filtrar corretamente
    const dayStart = getUTCDayStart(day);
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    
    return tasks.filter((task: any) => {
      const taskTime = task.scheduledAt;
      return taskTime >= dayStart && taskTime < dayEnd;
    });
  };

  // Debug log
  useEffect(() => {
    if (tasks && mounted) {
      console.log('Tarefas recebidas:', tasks.length);
      tasks.forEach((t: any) => {
        console.log(`  ${new Date(t.scheduledAt).toISOString()} - ${t.title}`);
      });
    }
  }, [tasks, mounted]);

  if (!mounted) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FiCalendar className="w-5 h-5" />
          Calendário Semanal
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={goToToday} className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            Hoje
          </button>
          <button onClick={goToPrevWeek} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={goToNextWeek} className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center mb-4">
        <span className="text-slate-400 text-sm">
          {format(currentWeekStart, "MMMM yyyy", { locale: ptBR })}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, i) => (
          <div key={i} className="text-center">
            <div className="text-xs text-slate-500 uppercase mb-2">
              {format(day, "EEE", { locale: ptBR })}
            </div>
            <div className={`text-lg font-bold mb-2 p-2 rounded-lg ${isToday(day) ? "bg-amber-500 text-slate-900" : "text-white"}`}>
              {format(day, "d")}
            </div>
          </div>
        ))}

        {days.map((day, dayIndex) => {
          const dayTasks = getTasksForDay(day);
          return (
            <div key={dayIndex} className={`min-h-[100px] bg-slate-800/30 rounded-lg p-2 space-y-1 ${isToday(day) ? "ring-1 ring-amber-500/50" : ""}`}>
              {dayTasks.slice(0, 3).map((task: any) => (
                <div key={task._id} className={`text-xs p-1.5 rounded border-l-2 truncate ${typeColors[task.type] || typeColors.custom}`} title={task.title}>
                  <TaskTime timestamp={task.scheduledAt} /> {task.title}
                </div>
              ))}
              {dayTasks.length > 3 && (
                <div className="text-xs text-slate-500 text-center">+{dayTasks.length - 3} mais</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-4 text-xs text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded"></span> Newsletter</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded"></span> Cron</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded"></span> Lembrete</span>
      </div>
    </div>
  );
}
