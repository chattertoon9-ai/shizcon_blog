import React, { useState, useMemo } from 'react';
import {
  Send,
  Eye,
  Code,
  Terminal,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  Edit3,
  Calendar,
  User,
  Tag,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  FileText,
  Clock,
  Layers,
  FileDown,
  Image as ImageIcon,
  GraduationCap,
  HeartPulse,
  Trash2,
  Search,
  Newspaper,
} from 'lucide-react';
import { GeneratedArticle, BloggerPublishResult, BloggerSettings } from '../types';
import { generateArticleMarkdown } from '../utils/htmlToMarkdown';
import { formatBloggerImageHtml } from '../utils/imageHelper';

interface ArticlePreviewProps {
  article: GeneratedArticle | null;
  onUpdateArticle: (updated: GeneratedArticle) => void;
  onPublishToBlogger: (isDraft: boolean) => Promise<void>;
  isPublishing: boolean;
  publishResult: BloggerPublishResult | null;
  bloggerSettings: BloggerSettings;
  onOpenSettings: () => void;
  onQuickGenerateSample: () => void;
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
  onUpdateArticle,
  onPublishToBlogger,
  isPublishing,
  publishResult,
  bloggerSettings,
  onOpenSettings,
  onQuickGenerateSample,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'markdown' | 'logs'>('preview');
  const [copied, setCopied] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [isDraft, setIsDraft] = useState(bloggerSettings.isDraftDefault);
  const [newTagInput, setNewTagInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isEditingSeo, setIsEditingSeo] = useState(false);
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');

  // Calculate word count and estimated reading time (in minutes) based on activeArticle content
  const { wordCount, readingTimeMinutes } = useMemo(() => {
    if (!article?.htmlContent) return { wordCount: 0, readingTimeMinutes: 1 };

    // Strip HTML markup, style/script tags, and HTML entities
    const plainText = article.htmlContent
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z0-9#]+;/gi, ' ');

    const words = plainText.trim().split(/\s+/).filter(Boolean);
    const count = words.length;
    // Standard reading speed: ~200 words per minute
    const minutes = Math.max(1, Math.ceil(count / 200));

    return { wordCount: count, readingTimeMinutes: minutes };
  }, [article?.htmlContent]);

  if (!article) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 lg:p-12 text-center h-full flex flex-col items-center justify-center min-h-[460px]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg shadow-blue-500/10">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Article Generated Yet</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Select or enter a news angle on the left, then click <strong>"Generate Article for Blogger"</strong> to create a ready-to-publish post with Gemini 3.8 Flash.
        </p>

        <button
          onClick={onQuickGenerateSample}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          Generate Sample Article Now
        </button>
      </div>
    );
  }

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(article.htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const seoDesc = (article.seoMetaDescription || article.summary).replace(/"/g, '&quot;');
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${article.title}</title>
  <meta name="description" content="${seoDesc}">
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${seoDesc}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    h1 { color: #0f172a; font-size: 2.2rem; margin-bottom: 0.5rem; }
    h2 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.3rem; margin-top: 1.5rem; }
    pre { background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #3b82f6; margin: 1.5rem 0; padding: 0.5rem 1rem; background: #f8fafc; font-style: italic; }
  </style>
</head>
<body>
  <h1>${article.title}</h1>
  <p><em>${article.summary}</em></p>
  <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e2e8f0;">
  ${article.htmlContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    if (!article) return;
    const mdContent = generateArticleMarkdown(article);
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const sanitizedTitle = article.title
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    a.download = `${sanitizedTitle || 'bytepulse-post'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateArticle({
      ...article,
      labels: article.labels.filter((l) => l !== tagToRemove),
    });
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !article.labels.includes(trimmed)) {
      onUpdateArticle({
        ...article,
        labels: [...article.labels, trimmed],
      });
      setNewTagInput('');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      {/* Top Bar: Tabs & Action Buttons */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Blogger Preview
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'html'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            HTML Source
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'markdown'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Markdown (.md)
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Execution Logs ({article.logs.length})
          </button>
        </div>

        {/* Quick Utilities */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Export as Markdown Button */}
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 hover:text-cyan-100 border border-cyan-800/80 text-xs font-medium flex items-center gap-1.5 shadow-sm transition active:scale-[0.98]"
            title="Export and download current article as a Markdown (.md) file"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            Export as Markdown
          </button>

          <button
            type="button"
            onClick={handleCopyHtml}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            title="Copy clean HTML to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied HTML' : 'Copy HTML'}
          </button>

          <button
            type="button"
            onClick={handleDownloadHtml}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
            title="Download standalone HTML file"
          >
            <Download className="w-3.5 h-3.5" />
            Download HTML
          </button>
        </div>
      </div>

      {/* Editable Title & Metadata Card */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-800 bg-slate-900/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-md">
                  Blogger Post Title
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(!isEditingTitle)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  {isEditingTitle ? 'Done' : 'Edit'}
                </button>
              </div>

              {/* Word Count and Estimated Reading Time Pill Badges */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-800/90 border border-slate-700/80 px-2.5 py-0.5 rounded-md font-mono"
                  title="Article word count"
                >
                  <FileText className="w-3 h-3 text-cyan-400" />
                  <span>{wordCount.toLocaleString()} words</span>
                </span>
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded-md font-mono font-medium"
                  title="Estimated reading time (~200 words per minute)"
                >
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{readingTimeMinutes} min read</span>
                </span>
              </div>
            </div>

            {isEditingTitle ? (
              <input
                type="text"
                value={article.title}
                onChange={(e) => onUpdateArticle({ ...article, title: e.target.value })}
                className="w-full bg-slate-950 border border-blue-500 rounded-lg px-3 py-1.5 text-base sm:text-lg font-bold text-white outline-none focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">
                {article.title}
              </h1>
            )}
            {/* Featured Image Controls */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400 font-medium text-[11px]">Featured Image:</span>
                {article.imageUrl ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={article.imageUrl}
                      alt="Thumbnail"
                      className="w-5 h-5 rounded object-cover border border-slate-700"
                    />
                    <a
                      href={article.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:underline max-w-[220px] truncate"
                    >
                      {article.imageUrl}
                    </a>
                  </div>
                ) : (
                  <span className="text-slate-500 text-[11px] italic">No image embedded</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingImage(!isEditingImage);
                    setCustomImageUrlInput(article.imageUrl || '');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition"
                >
                  <Edit3 className="w-3 h-3 text-cyan-400" />
                  {article.imageUrl ? 'Change Image' : '+ Add Image'}
                </button>
                {article.imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      const cleanedHtml = article.htmlContent.replace(/<div class="separator"[\s\S]*?<\/div>\s*/i, '');
                      onUpdateArticle({
                        ...article,
                        imageUrl: undefined,
                        htmlContent: cleanedHtml,
                      });
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                    title="Remove image from post"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {isEditingImage && (
              <div className="mt-2 p-2 bg-slate-950 rounded-lg border border-cyan-900/60 flex items-center gap-2 text-xs">
                <input
                  type="text"
                  value={customImageUrlInput}
                  onChange={(e) => setCustomImageUrlInput(e.target.value)}
                  placeholder="Paste image URL (https://...)..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-100 font-mono outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newUrl = customImageUrlInput.trim();
                    const cleanedHtml = article.htmlContent.replace(/<div class="separator"[\s\S]*?<\/div>\s*/i, '');
                    const updatedHtml = newUrl ? `${formatBloggerImageHtml(newUrl, article.title)}\n${cleanedHtml}` : cleanedHtml;
                    onUpdateArticle({
                      ...article,
                      imageUrl: newUrl || undefined,
                      htmlContent: updatedHtml,
                    });
                    setIsEditingImage(false);
                  }}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingImage(false)}
                  className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Labels / Tags chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Tag className="w-3 h-3" /> Labels:
          </span>
          {article.labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-800/80 text-cyan-300 border border-slate-700/80 px-2 py-0.5 rounded-full"
            >
              {label}
              <button
                type="button"
                onClick={() => handleRemoveTag(label)}
                className="text-slate-400 hover:text-rose-400 ml-0.5"
              >
                ×
              </button>
            </span>
          ))}

          <div className="inline-flex items-center gap-1">
            <input
              type="text"
              placeholder="+ add label"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="bg-slate-950/70 border border-slate-800 rounded-full px-2.5 py-0.5 text-[11px] text-slate-200 placeholder-slate-600 outline-none w-24 focus:w-32 transition-all focus:border-blue-500"
            />
          </div>
        </div>

        {/* SEO Meta Description (160 Characters) */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Search className="w-3.5 h-3.5" />
              <span>SEO Meta Description</span>
              <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">(Follows Title • Google Snippet)</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-mono ${
                  ((article.seoMetaDescription || article.summary)?.length || 0) > 160
                    ? 'text-rose-400 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {(article.seoMetaDescription || article.summary).length}/160 chars
              </span>
              <button
                type="button"
                onClick={() => setIsEditingSeo(!isEditingSeo)}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
              >
                <Edit3 className="w-3 h-3 text-cyan-400" />
                {isEditingSeo ? 'Done' : 'Edit'}
              </button>
            </div>
          </div>

          {isEditingSeo ? (
            <div className="space-y-1">
              <textarea
                value={article.seoMetaDescription || article.summary}
                maxLength={180}
                onChange={(e) =>
                  onUpdateArticle({
                    ...article,
                    seoMetaDescription: e.target.value,
                  })
                }
                rows={2}
                className="w-full bg-slate-950 border border-cyan-500/80 rounded-lg p-2 text-xs text-slate-100 font-mono outline-none focus:ring-1 focus:ring-cyan-500 resize-none leading-relaxed"
                placeholder="160-character SEO description following the title..."
              />
              <p className="text-[10px] text-slate-500">
                Crafted to fit search engine snippets (140-160 characters) and OpenGraph social share cards.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-300 font-normal bg-slate-950/60 border border-slate-800/80 rounded-lg px-2.5 py-1.5 leading-relaxed">
              {article.seoMetaDescription || article.summary}
            </p>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-950/30">
        {activeTab === 'preview' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 transition">
            {/* Blogger Header Simulation */}
            <div className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                {article.category === 'news' || article.newsMeta ? (
                  <span className="font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Newspaper className="w-4 h-4 text-red-600" />
                    {article.newsMeta?.outlet || 'Dawn News'}
                    {article.newsMeta?.language ? ` • ${article.newsMeta.language}` : ''}
                    {article.newsMeta?.datelineCity ? ` • ${article.newsMeta.datelineCity}` : ''}
                  </span>
                ) : article.category === 'sindh_board' || article.sindhBoardMeta ? (
                  <span className="font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-600" />
                    Sindh Textbook Board (STBB) {article.sindhBoardMeta?.classLevel ? `• Class ${article.sindhBoardMeta.classLevel}` : ''}
                  </span>
                ) : article.category === 'health' ? (
                  <span className="font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-emerald-600" />
                    BytePulse Health & Wellness
                  </span>
                ) : (
                  <span className="font-semibold text-blue-600 uppercase tracking-wider">
                    BytePulse News & Tech Update
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(article.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h1
                className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug"
                dir={article.newsMeta?.isRTL ? 'rtl' : 'ltr'}
              >
                {article.title}
              </h1>
              <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-600">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  BP
                </div>
                <span>By BytePulse Editorial Team</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {readingTimeMinutes} min read ({wordCount.toLocaleString()} words)
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">Angle: {article.angle.slice(0, 45)}...</span>
              </div>
            </div>

            {/* Blogger Post HTML Body */}
            <div className="p-6 sm:p-8 blogger-content">
              {/* Summary Lead & SEO Snippet Preview */}
              <div className="pb-4 mb-4 border-b border-slate-100 space-y-2">
                <div
                  className="text-sm sm:text-base font-medium text-slate-700 italic"
                  dir={article.newsMeta?.isRTL ? 'rtl' : 'ltr'}
                >
                  {article.summary}
                </div>
                {article.seoMetaDescription && (
                  <div className="text-xs bg-cyan-50/70 border border-cyan-200/80 rounded-lg p-2.5 text-slate-700 flex items-start gap-2 not-italic">
                    <span className="font-bold text-cyan-800 text-[10px] uppercase tracking-wider bg-cyan-100/90 border border-cyan-300 px-1.5 py-0.5 rounded shrink-0">
                      SEO Snippet (160 chars)
                    </span>
                    <span
                      className="text-xs leading-relaxed text-slate-600 font-mono"
                      dir={article.newsMeta?.isRTL ? 'rtl' : 'ltr'}
                    >
                      {article.seoMetaDescription}
                    </span>
                  </div>
                )}
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: article.htmlContent }}
                dir={article.newsMeta?.isRTL ? 'rtl' : 'ltr'}
                className="space-y-4 text-slate-800 leading-relaxed text-sm sm:text-base"
              />
            </div>

            {/* Blogger Footer Simulation */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-medium text-slate-600">Labels:</span>
                {article.labels.map((l) => (
                  <span key={l} className="bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                    {l}
                  </span>
                ))}
              </div>
              <span>Generated with Gemini 3.8 Flash</span>
            </div>
          </div>
        )}

        {activeTab === 'html' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2 text-xs text-slate-400">
              <span>Ready for Google Blogger post editor (HTML Mode)</span>
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1 text-amber-300/90 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {readingTimeMinutes} min read ({wordCount.toLocaleString()} words)
                </span>
                <span className="text-slate-500">•</span>
                <span className="font-mono text-[11px]">{article.htmlContent.length.toLocaleString()} chars</span>
              </div>
            </div>
            <textarea
              value={article.htmlContent}
              onChange={(e) => onUpdateArticle({ ...article, htmlContent: e.target.value })}
              className="w-full flex-1 min-h-[420px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
            />
          </div>
        )}

        {activeTab === 'markdown' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Standard Markdown format (.md)</span>
                <span className="text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {readingTimeMinutes} min read ({wordCount.toLocaleString()} words)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const md = generateArticleMarkdown(article);
                    navigator.clipboard.writeText(md);
                    setCopiedMd(true);
                    setTimeout(() => setCopiedMd(false), 2000);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 transition"
                >
                  {copiedMd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedMd ? 'Copied' : 'Copy Markdown'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[11px] font-medium flex items-center gap-1 border border-cyan-800 transition"
                >
                  <FileDown className="w-3 h-3" />
                  Download .md
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={generateArticleMarkdown(article)}
              className="w-full flex-1 min-h-[420px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed outline-none focus:border-blue-500 transition resize-none selection:bg-emerald-900"
            />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 overflow-x-auto min-h-[380px]">
            <div className="text-slate-400 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Terminal className="w-4 h-4" />
                Execution & Retry Telemetry (Python Script Equivalent)
              </span>
              <span className="text-[11px] text-slate-500">
                Duration: {(article.totalDurationMs / 1000).toFixed(2)}s
              </span>
            </div>

            {article.logs.map((log, index) => (
              <div
                key={index}
                className={`py-1 px-2 rounded flex items-start gap-2 ${
                  log.status === 'success'
                    ? 'bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500'
                    : log.status === 'failed'
                    ? 'bg-rose-950/30 text-rose-300 border-l-2 border-rose-500'
                    : log.status === 'retry_wait'
                    ? 'bg-amber-950/30 text-amber-300 border-l-2 border-amber-500'
                    : 'text-slate-300'
                }`}
              >
                <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                <span className="text-slate-400 font-bold shrink-0">[Attempt {log.attempt}]</span>
                <span className="flex-1 break-words">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Publish Control Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Draft Switch & Blog ID Notice */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={isDraft}
              onChange={(e) => setIsDraft(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
            />
            <span>Save as Draft (Do not publish live immediately)</span>
          </label>

          <button
            type="button"
            onClick={onOpenSettings}
            className="text-[11px] text-slate-400 hover:text-cyan-400 underline"
          >
            {bloggerSettings.blogId ? `Blog ID: ${bloggerSettings.blogId}` : 'Configure Blog ID'}
          </button>
        </div>

        {/* Right: Publish Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => onPublishToBlogger(isDraft)}
            disabled={isPublishing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition active:scale-[0.99]"
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Publishing to Blogger API...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-emerald-200" />
                {isDraft ? 'Save Draft to Blogger' : 'Publish to Blogger'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Publish Result Banner */}
      {publishResult && (
        <div
          className={`px-5 py-3 border-t text-xs flex items-center justify-between gap-3 ${
            publishResult.success
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
              : 'bg-rose-950/70 border-rose-800 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {publishResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <div>
              <span className="font-semibold">{publishResult.message}</span>
              {publishResult.isSandbox && (
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-amber-900/60 text-amber-300 border border-amber-700/60">
                  Preview / Sandbox Mode
                </span>
              )}
            </div>
          </div>

          {publishResult.url && (
            <a
              href={publishResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1 transition"
            >
              <span>View Post</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
