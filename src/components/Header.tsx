import React from 'react';
import { Newspaper, Sparkles, Terminal, Settings, History, Send, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { BloggerSettings } from '../types';

interface HeaderProps {
  activeView: 'studio' | 'history' | 'python' | 'settings';
  setActiveView: (view: 'studio' | 'history' | 'python' | 'settings') => void;
  bloggerSettings: BloggerSettings;
  historyCount: number;
  isGenerating: boolean;
  isPublishing: boolean;
  serverHasLiveCreds?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  bloggerSettings,
  historyCount,
  isGenerating,
  isPublishing,
  serverHasLiveCreds = false,
}) => {
  const hasLiveCredentials = Boolean(
    serverHasLiveCreds ||
    bloggerSettings.accessToken ||
    (bloggerSettings.clientId && bloggerSettings.clientSecret && bloggerSettings.refreshToken)
  );

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                BytePulse <span className="text-cyan-400 font-light">Studio</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Sindh Board Class 1–12 Books & Notes • Health Tips & Tech Studio • Google Blogger Publisher
            </p>
          </div>
        </div>

        {/* Center / Right Nav Items */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Navigation buttons */}
          <nav className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveView('studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'studio'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generator Studio
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'history'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'python'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Python Script
            </button>

            <button
              onClick={() => setActiveView('settings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeView === 'settings'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Blogger API
            </button>
          </nav>

          {/* Blogger status indicator */}
          <div
            onClick={() => setActiveView('settings')}
            className="cursor-pointer group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
            title="Click to configure Google Blogger credentials"
          >
            <div className={`w-2 h-2 rounded-full ${hasLiveCredentials ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div className="text-[11px] leading-tight">
              <span className="text-slate-400">Blogger: </span>
              <span className="font-semibold text-slate-200">
                {bloggerSettings.blogId ? `ID: ${bloggerSettings.blogId.slice(0, 8)}...` : 'Sandbox Mode'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
