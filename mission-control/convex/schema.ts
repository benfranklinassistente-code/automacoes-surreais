import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Feed de Atividades - registra tudo que o agente faz
  activities: defineTable({
    type: v.string(), // "task", "email", "blog", "search", "file", "cron", "message"
    title: v.string(),
    description: v.string(),
    status: v.string(), // "completed", "running", "failed", "scheduled"
    metadata: v.optional(v.any()), // dados extras específicos do tipo
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"])
    .index("by_type", ["type"]),

  // Tarefas Agendadas
  scheduledTasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.number(), // timestamp
    type: v.string(), // "newsletter", "cron", "reminder", "custom"
    status: v.string(), // "pending", "completed", "cancelled"
    recurrence: v.optional(v.string()), // "daily", "weekly", "monthly", null
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_scheduledAt", ["scheduledAt"])
    .index("by_status", ["status"]),

  // Memórias e Documentos (para busca)
  memories: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.string(), // "memory", "document", "task", "note"
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()), // arquivo original
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_type", ["type"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["type"],
    }),
});
