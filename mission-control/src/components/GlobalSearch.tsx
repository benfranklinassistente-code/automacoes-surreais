"use client";

import { useSearch } from "@/lib/use-data";
import { useState, useEffect } from "react";
import { FiSearch, FiX, FiFile, FiCheckSquare, FiBook, FiFileText } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const typeIcons: Record<string, React.ReactNode> = {
  memory: <FiBook className="w-4 h-4" />,
  document: <FiFileText className="w-4 h-4" />,
  task: <FiCheckSquare className="w-4 h-4" />,
  note: <FiFile className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  memory: "text-purple-400 bg-purple-500/10",
  document: "text-blue-400 bg-blue-500/10",
  task: "text-green-400 bg-green-500/10",
  note: "text-amber-400 bg-amber-500/10",
};

function TimeAgo({ timestamp }: { timestamp: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <span>{formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR })}</span>;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useSearch(debouncedQuery);

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FiSearch className="w-5 h-5" />
        Pesquisa Global
      </h2>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar memórias, documentos, tarefas..."
          className="w-full pl-12 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
        {query && (
          <button onClick={() => { setQuery(""); setDebouncedQuery(""); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {debouncedQuery.length >= 2 && (
        <div className="mt-4">
          {results === undefined ? (
            <div className="text-center py-8 text-slate-400">
              <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Buscando...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Nenhum resultado para "{debouncedQuery}"
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <p className="text-sm text-slate-400 mb-2">{results.length} resultado(s)</p>
              {results.map((result: any) => (
                <div key={result._id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${typeColors[result.type] || typeColors.note}`}>
                      {typeIcons[result.type] || <FiFile className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{result.title}</h3>
                        <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">{result.type}</span>
                      </div>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{result.content?.substring(0, 150)}...</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <TimeAgo timestamp={result.createdAt} />
                        {result.source && <span>• {result.source}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {debouncedQuery.length < 2 && (
        <div className="mt-4 text-sm text-slate-500">
          <p>💡 Digite pelo menos 2 caracteres para buscar</p>
        </div>
      )}
    </div>
  );
}
