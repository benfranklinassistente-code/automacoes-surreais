import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Criar tarefa agendada
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.number(),
    type: v.string(),
    recurrence: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("scheduledTasks", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

// Listar tarefas da semana atual
export const weekly = query({
  args: {},
  handler: async (ctx: any) => {
    // Calcular início da semana (domingo)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfWeekMs = startOfWeek.getTime();
    const endOfWeekMs = startOfWeekMs + 7 * 24 * 60 * 60 * 1000;
    
    const allTasks = await ctx.db
      .query("scheduledTasks")
      .collect();
    
    // Filtrar manualmente
    const tasks = allTasks.filter((task: any) => 
      task.scheduledAt >= startOfWeekMs && task.scheduledAt < endOfWeekMs
    );
    
    return tasks;
  },
});

// Listar todas as tarefas futuras
export const upcoming = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    const limit = args.limit ?? 20;
    
    const allTasks = await ctx.db
      .query("scheduledTasks")
      .collect();
    
    // Filtrar e ordenar
    const tasks = allTasks
      .filter((task: any) => task.scheduledAt >= now && task.status === "pending")
      .sort((a: any, b: any) => a.scheduledAt - b.scheduledAt)
      .slice(0, limit);
    
    return tasks;
  },
});

// Atualizar status da tarefa
export const updateStatus = mutation({
  args: {
    id: v.any(),
    status: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Cancelar tarefa
export const cancel = mutation({
  args: {
    id: v.any(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.id, { status: "cancelled" });
  },
});
