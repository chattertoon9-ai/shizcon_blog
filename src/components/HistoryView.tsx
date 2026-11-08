import React from 'react';
import { History, Calendar, ArrowRight, Trash2, Tag, CheckCircle2, Clock, FileText } from 'lucide-react';
import { GeneratedArticle } from '../types';

interface HistoryViewProps {
  history: GeneratedArticle[];
  onSelectArticle: (article: GeneratedArticle) => void;
  onClearHistory: () => void;
  onDeleteArticle: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectArticle,
  onClearHistory,
  onDeleteArticle,
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <History className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Articles in History</h3>
        <p className="text-xs text-slate-400">
          Articles you generate will be automatically recorded here so you can review, edit, and re-publish anytime.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 max-w-5xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Generated Article Archive</h2>
            <p className="text-xs text-slate-400">
              {history.length} {history.length === 1 ? 'article' : 'articles'} generated
            </p>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-900/40 hover:bg-rose-950/40 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((article) => (
          <div
            key={article.id}
            className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition group"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.createdAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="flex items-center gap-2">
                  {(() => {
                    const plain = (article.htmlContent || '').replace(/<[^>]+>/g, ' ').trim();
                    const words = plain.split(/\s+/).filter(Boolean).length;
                    const mins = Math.max(1, Math.ceil(words / 200));
                    return (
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock className="w-2.5 h-2.5 text-amber-400" />
                        {mins} min ({words}w)
                      </span>
                    );
                  })()}
                  <span className="text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/30">
                    Attempt {article.successfulAttempt}
                  </span>
                </div>
              </div>

              {article.imageUrl && (
                <div className="mb-2.5 h-24 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                  <img src={article.imageUrl} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />
                </div>
              )}

              <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition line-clamp-2 mb-2">
                {article.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                {article.summary}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {article.labels.slice(0, 3).map((l) => (
                  <span
                    key={l}
                    className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                  >
                    #{l}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onDeleteArticle(article.id)}
                className="text-slate-500 hover:text-rose-400 text-xs p-1 rounded"
                title="Delete this article"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onSelectArticle(article)}
                className="px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-medium flex items-center gap-1.5 transition shadow"
              >
                <span>Load in Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
