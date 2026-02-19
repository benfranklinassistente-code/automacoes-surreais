import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Criar memória/documento
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.string(),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    return await ctx.db.insert("memories", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Busca global
export const search = query({
  args: {
    query: v.string(),
    type: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const results = await ctx.db
      .query("memories")
      .withSearchIndex("search_content", (q: any) => {
        let search = q.search("content", args.query);
        if (args.type) {
          search = search.eq("type", args.type);
        }
        return search;
      })
      .take(20);
    
    return results;
  },
});

// Listar memórias por tipo
export const byType = query({
  args: {
    type: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 50;
    
    return await ctx.db
      .query("memories")
      .withIndex("by_type", (q: any) => q.eq("type", args.type))
      .order("desc")
      .take(limit);
  },
});

// Listar todas as memórias
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const limit = args.limit ?? 50;
    
    return await ctx.db
      .query("memories")
      .order("desc")
      .take(limit);
  },
});

// Atualizar memória
export const update = mutation({
  args: {
    id: v.any(),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Deletar memória
export const remove = mutation({
  args: {
    id: v.any(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});
