"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Hook para Activities
export function useActivities(limit = 30) {
  return useQuery(api.activities.list, { limit });
}

export function useActivityStats() {
  return useQuery(api.activities.stats, {});
}

// Hook para Scheduled Tasks
export function useUpcomingTasks(limit = 20) {
  return useQuery(api.scheduledTasks.upcoming, { limit });
}

// Sem argumentos - calcula semana atual no servidor
export function useWeeklyTasks() {
  return useQuery(api.scheduledTasks.weekly, {});
}

// Hook para Memories/Search
export function useSearch(query: string) {
  return useQuery(
    api.memories.search, 
    query.length >= 2 ? { query } : "skip"
  );
}

// Mutations
export function useLogActivity() {
  return useMutation(api.activities.log);
}

export function useCreateTask() {
  return useMutation(api.scheduledTasks.create);
}

export function useCreateMemory() {
  return useMutation(api.memories.create);
}
