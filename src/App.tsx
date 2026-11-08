import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GenerationPanel } from './components/GenerationPanel';
import { ArticlePreview } from './components/ArticlePreview';
import { SettingsModal } from './components/SettingsModal';
import { PythonScriptModal } from './components/PythonScriptModal';
import { HistoryView } from './components/HistoryView';
import { GenerationConfig, GeneratedArticle, BloggerPublishResult, BloggerSettings } from './types';
import { Sparkles, Terminal, CheckCircle2, AlertTriangle } from 'lucide-react';

const DEFAULT_CONFIG: GenerationConfig = {
  angle: 'Sindh Board Class 10 Physics - Chapter 10: Simple Harmonic Motion and Waves | Comprehensive Chapter Notes, Solved Numericals & MCQs (Sindh Textbook Board Jamshoro - English Medium)',
  category: 'sindh_board',
  tone: 'educational',
  targetWordCount: 900,
  includeKeyTakeaways: true,
  includeCodeExample: false,
  includeHealthDisclaimer: false,
  includeImages: true,
  includeTableOfContents: true,
  seoMetaDescription: '',
  sindhBoardConfig: {
    classLevel: '10',
    subject: 'Physics (Class 10 STBB)',
    contentType: 'notes',
    medium: 'English',
    chapterOrTopic: 'Chapter 10: Simple Harmonic Motion and Waves',
  },
  customPromptExtra: '',
  maxRetries: 5,
  backoffFactor: 4,
};

const DEFAULT_BLOGGER_SETTINGS: BloggerSettings = {
  blogId: '',
  accessToken: '',
  clientId: '',
  clientSecret: '',
  refreshToken: '',
  isDraftDefault: false,
};

export default function App() {
  const [config, setConfig] = useState<GenerationConfig>(() => {
    try {
      const saved = localStorage.getItem('bytepulse_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [bloggerSettings, setBloggerSettings] = useState<BloggerSettings>(() => {
    try {
      const saved = localStorage.getItem('bytepulse_blogger_settings');
      return saved ? JSON.parse(saved) : DEFAULT_BLOGGER_SETTINGS;
    } catch {
      return DEFAULT_BLOGGER_SETTINGS;
    }
  });

  const [history, setHistory] = useState<GeneratedArticle[]>(() => {
    try {
      const saved = localStorage.getItem('bytepulse_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeArticle, setActiveArticle] = useState<GeneratedArticle | null>(null);
  const [activeView, setActiveView] = useState<'studio' | 'history' | 'python' | 'settings'>('studio');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeAttempt, setActiveAttempt] = useState<number>(1);
  const [currentSleepRemaining, setCurrentSleepRemaining] = useState<number>(0);
  const [publishResult, setPublishResult] = useState<BloggerPublishResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serverConfig, setServerConfig] = useState<{
    hasGeminiApiKey: boolean;
    envBlogId: string | null;
    hasOAuthCreds: boolean;
  }>({
    hasGeminiApiKey: false,
    envBlogId: null,
    hasOAuthCreds: false,
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bytepulse_config', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save config:', e);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('bytepulse_blogger_settings', JSON.stringify(bloggerSettings));
    } catch (e) {
      console.warn('Failed to save blogger settings:', e);
    }
  }, [bloggerSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('bytepulse_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history:', e);
    }
  }, [history]);

  // Load server config on initial mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setServerConfig(data);
        if (data.envBlogId && !bloggerSettings.blogId) {
          setBloggerSettings((prev) => ({ ...prev, blogId: data.envBlogId }));
        }
      })
      .catch((err) => console.warn('Could not fetch server config:', err));
  }, []);

  // Set latest article from history if available and not yet set
  useEffect(() => {
    if (!activeArticle && history.length > 0) {
      setActiveArticle(history[0]);
    }
  }, [history]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setPublishResult(null);
    setActiveAttempt(1);
    setCurrentSleepRemaining(0);

    try {
      const res = await fetch('/api/generate-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate article from Gemini API.');
      }

      const newArticle: GeneratedArticle = {
        id: 'post-' + Date.now(),
        title: data.title,
        summary: data.summary,
        seoMetaDescription: data.seoMetaDescription || data.summary,
        htmlContent: data.htmlContent,
        labels: data.labels,
        imageUrl: data.imageUrl,
        category: data.category || config.category,
        sindhBoardMeta: data.sindhBoardMeta || (config.sindhBoardConfig ? {
          classLevel: config.sindhBoardConfig.classLevel,
          subject: config.sindhBoardConfig.subject,
          medium: config.sindhBoardConfig.medium,
          contentType: config.sindhBoardConfig.contentType,
        } : undefined),
        newsMeta: data.newsMeta || (config.newsConfig ? {
          outlet: config.newsConfig.outlet,
          language: config.newsConfig.language,
          newsType: config.newsConfig.newsType,
          isRTL: config.newsConfig.language === 'Urdu' || config.newsConfig.language === 'Sindhi' || config.newsConfig.language === 'Arabic',
        } : undefined),
        model: data.model || 'gemini-3.8-flash',
        createdAt: new Date().toISOString(),
        angle: config.angle,
        successfulAttempt: data.successfulAttempt || 1,
        totalDurationMs: data.totalDurationMs || 0,
        logs: data.logs || [],
      };

      setActiveArticle(newArticle);
      setHistory((prev) => [newArticle, ...prev.slice(0, 49)]);
      setActiveView('studio');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error occurred during article generation.');
    } finally {
      setIsGenerating(false);
      setActiveAttempt(1);
      setCurrentSleepRemaining(0);
    }
  };

  const handlePublishToBlogger = async (isDraft: boolean) => {
    if (!activeArticle) return;

    setIsPublishing(true);
    setPublishResult(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/publish-blogger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: bloggerSettings.blogId,
          title: activeArticle.title,
          content: activeArticle.htmlContent,
          labels: activeArticle.labels,
          isDraft,
          accessToken: bloggerSettings.accessToken,
          clientId: bloggerSettings.clientId,
          clientSecret: bloggerSettings.clientSecret,
          refreshToken: bloggerSettings.refreshToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish to Google Blogger API.');
      }

      setPublishResult(data);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error during Blogger publication.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleQuickSample = () => {
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        bloggerSettings={bloggerSettings}
        historyCount={history.length}
        isGenerating={isGenerating}
        isPublishing={isPublishing}
        serverHasLiveCreds={serverConfig.hasOAuthCreds}
      />

      {/* Global Error Notification */}
      {errorMessage && (
        <div className="bg-rose-950/90 border-b border-rose-800 px-4 py-2.5 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
        {activeView === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-start">
            {/* Left Column: Generation Controls */}
            <div className="lg:col-span-5 xl:col-span-4 h-full">
              <GenerationPanel
                config={config}
                setConfig={setConfig}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                activeAttempt={activeAttempt}
                currentSleepRemaining={currentSleepRemaining}
              />
            </div>

            {/* Right Column: Live Editor, Preview & Publisher */}
            <div className="lg:col-span-7 xl:col-span-8 h-full min-h-[640px]">
              <ArticlePreview
                article={activeArticle}
                onUpdateArticle={setActiveArticle}
                onPublishToBlogger={handlePublishToBlogger}
                isPublishing={isPublishing}
                publishResult={publishResult}
                bloggerSettings={bloggerSettings}
                onOpenSettings={() => setActiveView('settings')}
                onQuickGenerateSample={handleQuickSample}
              />
            </div>
          </div>
        )}

        {activeView === 'history' && (
          <HistoryView
            history={history}
            onSelectArticle={(article) => {
              setActiveArticle(article);
              setActiveView('studio');
            }}
            onClearHistory={() => {
              setHistory([]);
              localStorage.removeItem('bytepulse_history');
            }}
            onDeleteArticle={(id) => {
              setHistory((prev) => prev.filter((a) => a.id !== id));
              if (activeArticle?.id === id) {
                setActiveArticle(null);
              }
            }}
          />
        )}

        {activeView === 'python' && (
          <PythonScriptModal
            config={config}
            settings={bloggerSettings}
            onClose={() => setActiveView('studio')}
          />
        )}

        {activeView === 'settings' && (
          <SettingsModal
            settings={bloggerSettings}
            onSave={(newSettings) => setBloggerSettings(newSettings)}
            onClose={() => setActiveView('studio')}
            serverConfig={serverConfig}
          />
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
        <div className="flex items-center gap-1.5">
          <span>BytePulse AI News Studio</span>
          <span>•</span>
          <span className="font-mono text-cyan-400">gemini-3.8-flash</span>
          <span>•</span>
          <span>Google Blogger API v3</span>
        </div>
        <div className="text-slate-600">
          Smart exponential backoff retry system for 503 & rate-limit resilience
        </div>
      </footer>
    </div>
  );
}
