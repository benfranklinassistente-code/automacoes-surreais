import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Registrar nova atividade
export const log = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.string(),
    status: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("activities", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Listar atividades (mais recentes primeiro)
export const list = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 50;
    
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
    
    return activities;
  },
});

// Buscar atividades por período
export const byDateRange = query({
  args: {
    start: v.number(),
    end: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_createdAt")
      .order("desc")
      .filter((q: any) => 
        q.and(
          q.gte(q.field("createdAt"), args.start),
          q.lte(q.field("createdAt"), args.end)
        )
      )
      .collect();
    
    return activities;
  },
});

// Estatísticas de atividades
export const stats = query({
  args: {},
  handler: async (ctx: any) => {
    const all = await ctx.db.query("activities").collect();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    
    const todayActivities = all.filter((a: any) => a.createdAt >= todayStart);
    
    return {
      total: all.length,
      today: todayActivities.length,
      completed: all.filter((a: any) => a.status === "completed").length,
      failed: all.filter((a: any) => a.status === "failed").length,
      byType: all.reduce((acc: any, a: any) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {}),
    };
  },
});
