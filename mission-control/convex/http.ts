import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// ===========================================
// POST /api/activity - Registrar atividade
// ===========================================
http.route({
  path: "/api/activity",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      const { type, title, description, status, metadata } = body as {
        type: string;
        title: string;
        description: string;
        status: string;
        metadata?: any;
      };

      // Validação básica
      if (!type || !title || !status) {
        return new Response(
          JSON.stringify({ error: "Campos obrigatórios: type, title, status" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const activityId = await ctx.runMutation(internal.activities.log, {
        type,
        title,
        description: description || "",
        status,
        metadata,
      });

      return new Response(
        JSON.stringify({ success: true, activityId }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Erro ao processar requisição" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ===========================================
// POST /api/task - Criar tarefa agendada
// ===========================================
http.route({
  path: "/api/task",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      const { title, type, scheduledAt, recurrence, description, metadata } = body as {
        title: string;
        type: string;
        scheduledAt: number;
        recurrence?: string;
        description?: string;
        metadata?: any;
      };

      if (!title || !type || !scheduledAt) {
        return new Response(
          JSON.stringify({ error: "Campos obrigatórios: title, type, scheduledAt" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const taskId = await ctx.runMutation(internal.scheduledTasks.create, {
        title,
        type,
        scheduledAt,
        recurrence,
        description,
        metadata,
      });

      return new Response(
        JSON.stringify({ success: true, taskId }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Erro ao processar requisição" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ===========================================
// POST /api/memory - Criar memória
// ===========================================
http.route({
  path: "/api/memory",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      const { title, content, type, tags, source } = body as {
        title: string;
        content: string;
        type: string;
        tags?: string[];
        source?: string;
      };

      if (!title || !content || !type) {
        return new Response(
          JSON.stringify({ error: "Campos obrigatórios: title, content, type" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const memoryId = await ctx.runMutation(internal.memories.create, {
        title,
        content,
        type,
        tags,
        source,
      });

      return new Response(
        JSON.stringify({ success: true, memoryId }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Erro ao processar requisição" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ===========================================
// GET /api/stats - Estatísticas
// ===========================================
http.route({
  path: "/api/stats",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const stats = await ctx.runQuery(internal.activities.stats, {});
      
      return new Response(
        JSON.stringify(stats),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Erro ao buscar estatísticas" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ===========================================
// GET /api/activities - Listar atividades
// ===========================================
http.route({
  path: "/api/activities",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get("limit") || "50");
      const type = url.searchParams.get("type") || undefined;

      const activities = await ctx.runQuery(internal.activities.list, {
        limit,
        type,
      });
      
      return new Response(
        JSON.stringify(activities),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Erro ao buscar atividades" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// ===========================================
// GET /api/tasks - Listar tarefas
// ===========================================
http.route({
  path: "/api/tasks",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      const startOfWeek = parseInt(url.searchParams.get("startOfWeek") || "0");
      const limit = parseInt(url.searchParams.get("limit") || "20");

      if (startOfWeek > 0) {
        // Buscar tarefas da semana
        const tasks = await ctx.runQuery(internal.scheduledTasks.weekly, { startOfWeek });
        return new Response(
          JSON.stringify(tasks),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      } else {
        // Buscar próximas tarefas
        const tasks = await ctx.runQuery(internal.scheduledTasks.upcoming, { limit });
        return new Response(
          JSON.stringify(tasks),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Erro ao buscar tarefas" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
