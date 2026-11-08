import React, { useState } from 'react';
import { Settings, Key, Shield, Globe, ExternalLink, Check, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { BloggerSettings } from '../types';

interface SettingsModalProps {
  settings: BloggerSettings;
  onSave: (newSettings: BloggerSettings) => void;
  onClose: () => void;
  serverConfig?: {
    hasGeminiApiKey: boolean;
    envBlogId: string | null;
    hasOAuthCreds: boolean;
  };
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
  serverConfig,
}) => {
  const [localSettings, setLocalSettings] = useState<BloggerSettings>(settings);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/publish-blogger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: localSettings.blogId,
          title: 'BytePulse Connection Test',
          content: '<p>Testing Google Blogger API connection from BytePulse Studio.</p>',
          isDraft: true,
          accessToken: localSettings.accessToken,
          clientId: localSettings.clientId,
          clientSecret: localSettings.clientSecret,
          refreshToken: localSettings.refreshToken,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.isSandbox
            ? 'Sandbox Mode Active: Payload verified! Add Live Blogger Credentials below to send directly to your real blog.'
            : 'Connection Successful! Google Blogger API accepted the test post.',
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Failed to connect to Blogger API.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Network error during connection test.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 max-w-2xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Google Blogger API Settings</h2>
            <p className="text-xs text-slate-400">Configure your target blog and OAuth credentials</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-sm font-medium px-2 py-1"
        >
          ✕
        </button>
      </div>

      <div className="space-y-5 text-xs sm:text-sm">
        {/* Environment Status Notice */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <span className="font-semibold text-slate-300 block mb-1">Server Status:</span>
          <div className="grid grid-cols-2 gap-2 text-slate-400">
            <div>
              Gemini API Key:{' '}
              <span className={serverConfig?.hasGeminiApiKey ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                {serverConfig?.hasGeminiApiKey ? 'Active (Ready)' : 'Using Environment / Auto-injected'}
              </span>
            </div>
            <div>
              Server Env Blog ID:{' '}
              <span className="text-slate-200 font-mono">
                {serverConfig?.envBlogId || 'None (Using UI input)'}
              </span>
            </div>
          </div>
        </div>

        {/* Blog ID input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              Blogger Blog ID
            </label>
            <a
              href="https://www.blogger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              How to find Blog ID <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <input
            type="text"
            value={localSettings.blogId}
            onChange={(e) => setLocalSettings({ ...localSettings, blogId: e.target.value })}
            placeholder="e.g. 84920491029482019"
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none font-mono"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Found in your Blogger URL: <code>blogger.com/blog/posts/[BLOG_ID]</code>
          </p>
        </div>

        {/* Authentication Mode 1: Direct Access Token */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-xs font-semibold text-slate-200 block mb-1">
            Option A: Google Access Token (Quick Test)
          </label>
          <input
            type="password"
            value={localSettings.accessToken}
            onChange={(e) => setLocalSettings({ ...localSettings, accessToken: e.target.value })}
            placeholder="ya29.a0AfH6SM..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none font-mono"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Paste a temporary Bearer token with <code>https://www.googleapis.com/auth/blogger</code> scope.
          </p>
        </div>

        {/* Authentication Mode 2: Full Python-style OAuth Creds */}
        <div className="pt-2 border-t border-slate-800/80">
          <label className="text-xs font-semibold text-slate-200 block mb-1">
            Option B: OAuth Client Credentials & Refresh Token (Matches Python Script)
          </label>

          <div className="space-y-2 mt-2">
            <div>
              <span className="text-[11px] text-slate-400">Client ID:</span>
              <input
                type="text"
                value={localSettings.clientId}
                onChange={(e) => setLocalSettings({ ...localSettings, clientId: e.target.value })}
                placeholder="xxxx.apps.googleusercontent.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Client Secret:</span>
              <input
                type="password"
                value={localSettings.clientSecret}
                onChange={(e) => setLocalSettings({ ...localSettings, clientSecret: e.target.value })}
                placeholder="GOCSPX-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400">Refresh Token:</span>
              <input
                type="password"
                value={localSettings.refreshToken}
                onChange={(e) => setLocalSettings({ ...localSettings, refreshToken: e.target.value })}
                placeholder="1//04..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono outline-none"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">
            If left blank, BytePulse operates in Sandbox/Preview mode, creating realistic previews and verified payloads.
          </p>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800 text-rose-300'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            )}
            <div>{testResult.message}</div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
            Test Blogger Connection
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
