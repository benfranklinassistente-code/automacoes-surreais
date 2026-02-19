"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { 
  demoActivities, 
  demoScheduledTasks, 
  demoMemories, 
  demoStats 
} from "./demo-data";

// Tipos
type Activity = typeof demoActivities[0];
type ScheduledTask = typeof demoScheduledTasks[0];
type Memory = typeof demoMemories[0];
type Stats = typeof demoStats;

interface DemoContextType {
  // Activities
  activities: Activity[];
  logActivity: (activity: Omit<Activity, "_id" | "createdAt">) => void;
  activityStats: Stats;

  // Scheduled Tasks
  scheduledTasks: ScheduledTask[];
  createTask: (task: Omit<ScheduledTask, "_id">) => void;
  cancelTask: (id: string) => void;

  // Memories
  memories: Memory[];
  searchMemories: (query: string) => Memory[];
  createMemory: (memory: Omit<Memory, "_id" | "createdAt" | "updatedAt">) => void;

  // Status
  isDemo: boolean;
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(demoActivities);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>(demoScheduledTasks);
  const [memories, setMemories] = useState<Memory[]>(demoMemories);
  const [activityStats] = useState<Stats>(demoStats);

  // Activities
  const logActivity = useCallback((activity: Omit<Activity, "_id" | "createdAt">) => {
    const newActivity: Activity = {
      ...activity,
      _id: `demo-${Date.now()}`,
      createdAt: Date.now(),
    };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  // Scheduled Tasks
  const createTask = useCallback((task: Omit<ScheduledTask, "_id">) => {
    const newTask: ScheduledTask = {
      ...task,
      _id: `task-${Date.now()}`,
    };
    setScheduledTasks(prev => [...prev, newTask]);
  }, []);

  const cancelTask = useCallback((id: string) => {
    setScheduledTasks(prev => 
      prev.map(t => t._id === id ? { ...t, status: "cancelled" } : t)
    );
  }, []);

  // Memories
  const searchMemories = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return memories.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) ||
      m.content.toLowerCase().includes(lowerQuery) ||
      m.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }, [memories]);

  const createMemory = useCallback((memory: Omit<Memory, "_id" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const newMemory: Memory = {
      ...memory,
      _id: `mem-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setMemories(prev => [newMemory, ...prev]);
  }, []);

  return (
    <DemoContext.Provider value={{
      activities,
      logActivity,
      activityStats,
      scheduledTasks,
      createTask,
      cancelTask,
      memories,
      searchMemories,
      createMemory,
      isDemo: true,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return context;
}
