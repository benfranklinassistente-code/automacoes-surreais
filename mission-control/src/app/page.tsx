"use client";

import ActivityFeed from "@/components/ActivityFeed";
import CalendarView from "@/components/CalendarView";
import GlobalSearch from "@/components/GlobalSearch";
import StatsCards from "@/components/StatsCards";
import UpcomingTasks from "@/components/UpcomingTasks";
import { FiZap, FiGithub } from "react-icons/fi";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <FiZap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Mission Control
                </h1>
                <p className="text-slate-400 text-sm">
                  Painel de Controle • OpenClaw Agents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="mb-8">
          <StatsCards />
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityFeed />
            <CalendarView />
          </div>

          {/* Right Column - Search & Upcoming */}
          <div className="space-y-6">
            <GlobalSearch />
            <UpcomingTasks />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>
            Powered by{" "}
            <span className="text-amber-500 font-medium">OpenClaw</span>
            {" "}&{" "}
            <span className="text-blue-400 font-medium">Convex</span>
          </p>
        </footer>
      </div>
    </main>
  );
}
