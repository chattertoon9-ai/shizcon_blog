import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  RefreshCw,
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  FileText,
  Layers,
  Search,
} from 'lucide-react';
import { GenerationConfig } from '../types';
import { SINDH_BOARD_CLASSES, ClassSubject } from '../data/sindhBoardData';
import { getFeaturedImageUrl } from '../utils/imageHelper';

interface GenerationPanelProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
  activeAttempt?: number;
  currentSleepRemaining?: number;
}

export const GenerationPanel: React.FC<GenerationPanelProps> = ({
  config,
  setConfig,
  onGenerate,
  isGenerating,
  activeAttempt,
  currentSleepRemaining,
}) => {
  // Sindh Board state
  const [selectedClass, setSelectedClass] = useState<string>(config.sindhBoardConfig?.classLevel || '10');
  const [selectedStream, setSelectedStream] = useState<string>(config.sindhBoardConfig?.stream || 'Pre-Medical');
  const [selectedSubject, setSelectedSubject] = useState<string>(config.sindhBoardConfig?.subject || 'Physics (Class 10 STBB)');
  const [selectedChapter, setSelectedChapter] = useState<string>(config.sindhBoardConfig?.chapterOrTopic || 'Chapter 10: Simple Harmonic Motion and Waves');
  const [contentType, setContentType] = useState<'notes' | 'solved_exercises' | 'mcqs' | 'model_paper' | 'book_summary'>(
    config.sindhBoardConfig?.contentType || 'notes'
  );
  const [medium, setMedium] = useState<'English' | 'Urdu' | 'Sindhi'>(
    config.sindhBoardConfig?.medium || 'English'
  );

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState<string>(config.imageUrl || '');
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Get active class definition
  const currentClassDef = SINDH_BOARD_CLASSES.find((c) => c.classLevel === selectedClass) || SINDH_BOARD_CLASSES[9]; // default Class 10

  // Get subjects for current class and stream
  let currentSubjects: ClassSubject[] = [];
  if (currentClassDef.streams && currentClassDef.streams.length > 0) {
    const streamObj = currentClassDef.streams.find((s) => s.name === selectedStream) || currentClassDef.streams[0];
    currentSubjects = streamObj.subjects;
  } else {
    currentSubjects = currentClassDef.subjects;
  }

  // Get active subject definition
  const currentSubjectDef = currentSubjects.find((s) => s.name === selectedSubject) || currentSubjects[0] || { name: 'General', chapters: [] };

  // Sync Sindh Board selections to config.angle whenever selections change
  useEffect(() => {
    const typeLabel =
      contentType === 'notes'
        ? 'Comprehensive Chapter Notes & Key Concepts'
        : contentType === 'solved_exercises'
        ? 'Solved Textbook Exercise Questions & Numericals'
        : contentType === 'mcqs'
        ? 'High-Yield Board MCQs & Solved Objectives'
        : contentType === 'model_paper'
        ? 'Complete Board Exam Model Paper & Guess Questions'
        : 'Textbook Summary, Chapter PDF & Syllabus Guide';

    const streamLabel = (selectedClass === '11' || selectedClass === '12') ? ` (${selectedStream})` : '';
    const constructedAngle = `Sindh Board Class ${selectedClass}${streamLabel} ${selectedSubject} - ${selectedChapter} | ${typeLabel} (Sindh Textbook Board Jamshoro - ${medium} Medium)`;

    const detectedImage = getFeaturedImageUrl('sindh_board', constructedAngle, selectedSubject);

    setConfig((prev) => ({
      ...prev,
      category: 'sindh_board',
      angle: constructedAngle,
      imageUrl: customImageUrl || detectedImage,
      sindhBoardConfig: {
        classLevel: selectedClass,
        subject: selectedSubject,
        stream: selectedStream,
        contentType,
        medium,
        chapterOrTopic: selectedChapter,
      },
      tone: 'educational',
      includeCodeExample: selectedSubject.toLowerCase().includes('computer'),
    }));
  }, [selectedClass, selectedStream, selectedSubject, selectedChapter, contentType, medium, customImageUrl]);

  // Preview current computed or custom image
  const activeImage = customImageUrl || config.imageUrl || getFeaturedImageUrl(
    'sindh_board',
    config.angle,
    config.sindhBoardConfig?.subject
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              Article & Post Studio
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                📚 Sindh Board Class 1–12
              </span>
            </h2>
            <p className="text-xs text-slate-400">Gemini 3.8 Flash • Auto-Images • Blogger v3</p>
          </div>
        </div>

        {/* Quick Image controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImagePreview(!showImagePreview)}
            className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition ${
              config.includeImages
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80 hover:bg-cyan-900/60'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
            title="Toggle featured image preview & URL"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Images</span>
            {config.includeImages && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-4 flex-1">
        {/* Featured Image Configuration Dropdown */}
        {showImagePreview && (
          <div className="p-3.5 bg-slate-950 border border-cyan-900/50 rounded-xl space-y-2.5 text-xs animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                Featured Post Image (Auto-Embedded into Blogger)
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={config.includeImages}
                  onChange={(e) => setConfig((prev) => ({ ...prev, includeImages: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Embed in Post</span>
              </label>
            </div>

            {config.includeImages && (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customImageUrl}
                    onChange={(e) => {
                      setCustomImageUrl(e.target.value);
                      setConfig((prev) => ({ ...prev, imageUrl: e.target.value }));
                    }}
                    placeholder="Enter custom image URL or leave empty for auto-topic match..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-cyan-500 font-mono"
                  />
                  {customImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomImageUrl('');
                        setConfig((prev) => ({ ...prev, imageUrl: undefined }));
                      }}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-[11px]"
                    >
                      Reset Auto
                    </button>
                  )}
                </div>

                {activeImage && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 max-h-28 bg-slate-900 flex items-center justify-center">
                    <img
                      src={activeImage}
                      alt="Featured Preview"
                      className="w-full h-28 object-cover opacity-90 hover:opacity-100 transition"
                      onError={(e) => {
                        // Fallback image if broken
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute bottom-1 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-cyan-300 backdrop-blur-sm border border-slate-800">
                      Blogger Featured Image
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Sindh Board Interactive Module */}
        <div className="p-3.5 bg-slate-950/90 rounded-xl border border-amber-900/40 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              Sindh Textbook Board (STBB) Books & Notes (Class 1–12)
            </span>
            <span className="text-[10px] bg-amber-950/60 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded">
              BSEK / BIEK Curriculum
            </span>
          </div>

          {/* Class Selector Grid */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Select Class Level:</label>
              <span className="text-[11px] text-amber-400 font-medium">
                {parseInt(selectedClass, 10) <= 5
                  ? 'Primary Level'
                  : parseInt(selectedClass, 10) <= 8
                  ? 'Middle Level'
                  : parseInt(selectedClass, 10) <= 10
                  ? 'Matric (SSC I-II)'
                  : 'Intermediate (HSSC I-II)'}
              </span>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1">
              {SINDH_BOARD_CLASSES.map((c) => {
                const isCurClass = c.classLevel === selectedClass;
                return (
                  <button
                    key={c.classLevel}
                    type="button"
                    onClick={() => {
                      setSelectedClass(c.classLevel);
                      // Reset subject to first of that class
                      const def = SINDH_BOARD_CLASSES.find((sc) => sc.classLevel === c.classLevel);
                      const firstSub = def?.streams ? def.streams[0].subjects[0].name : def?.subjects[0].name;
                      if (firstSub) setSelectedSubject(firstSub);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold transition flex flex-col items-center justify-center border ${
                      isCurClass
                        ? 'bg-amber-600 text-white border-amber-400 shadow-md scale-105'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>C{c.classLevel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stream Selector (For Class 11 and 12) */}
          {(selectedClass === '11' || selectedClass === '12') && currentClassDef.streams && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Intermediate Group / Stream:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentClassDef.streams.map((st) => (
                  <button
                    key={st.name}
                    type="button"
                    onClick={() => {
                      setSelectedStream(st.name);
                      if (st.subjects[0]) {
                        setSelectedSubject(st.subjects[0].name);
                        if (st.subjects[0].chapters[0]) setSelectedChapter(st.subjects[0].chapters[0]);
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      selectedStream === st.name
                        ? 'bg-amber-600/30 text-amber-200 border-amber-500 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subject Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Subject (Class {selectedClass}):
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                const newSub = e.target.value;
                setSelectedSubject(newSub);
                const subDef = currentSubjects.find((s) => s.name === newSub);
                if (subDef && subDef.chapters.length > 0) {
                  setSelectedChapter(subDef.chapters[0]);
                }
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-200 font-medium focus:border-amber-500 outline-none"
            >
              {currentSubjects.map((sub) => (
                <option key={sub.name} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chapter / Topic Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Curriculum Chapter or Topic:
              </label>
              <span className="text-[10px] text-slate-400">
                {currentSubjectDef.chapters.length} STBB Chapters
              </span>
            </div>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 outline-none mb-1.5"
            >
              {currentSubjectDef.chapters.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              placeholder="Or type a custom topic/question..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-amber-500"
            />
          </div>

          {/* Content Type & Medium */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Content Format</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 outline-none"
              >
                <option value="notes">📖 Complete Notes & Theory</option>
                <option value="solved_exercises">📝 Solved Textbook Questions</option>
                <option value="mcqs">🎯 Solved MCQs with Reasons</option>
                <option value="model_paper">📄 Model Paper & Guess Paper</option>
                <option value="book_summary">📚 Textbook PDF Guide & Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Language / Medium</label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-amber-500 outline-none"
              >
                <option value="English">English Medium</option>
                <option value="Urdu">Urdu Medium (اردو)</option>
                <option value="Sindhi">Sindhi Medium (سنڌي)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current Angle Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              Article Topic / Title Angle
              <span className="text-[10px] text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">
                Core Prompt
              </span>
            </label>
            <span className="text-[11px] text-slate-500">{config.angle.length} chars</span>
          </div>
          <textarea
            value={config.angle}
            onChange={(e) => setConfig((prev) => ({ ...prev, angle: e.target.value }))}
            rows={3}
            disabled={isGenerating}
            placeholder="Article topic or Sindh Board chapter notes description..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 outline-none transition resize-none"
          />
        </div>

        {/* Tone and Length */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tone & Voice</label>
            <select
              value={config.tone}
              onChange={(e) => setConfig((prev) => ({ ...prev, tone: e.target.value as any }))}
              disabled={isGenerating}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value="educational">Educational & Exam-Focused</option>
              <option value="authoritative">Curriculum Board Specialist</option>
              <option value="practical">Step-by-Step Solved Guide</option>
              <option value="engaging">Student-Friendly & Engaging</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Length</label>
            <select
              value={config.targetWordCount}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, targetWordCount: parseInt(e.target.value, 10) }))
              }
              disabled={isGenerating}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-blue-500 outline-none"
            >
              <option value={500}>~500 words (Quick Overview)</option>
              <option value={900}>~900 words (Standard Post)</option>
              <option value={1500}>~1500 words (Full Comprehensive Guide)</option>
            </select>
          </div>
        </div>

        {/* SEO Meta Description Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              SEO Meta Description (160 Characters)
            </label>
            <span
              className={`text-[11px] font-mono ${
                (config.seoMetaDescription?.length || 0) > 160
                  ? 'text-rose-400 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {config.seoMetaDescription ? `${config.seoMetaDescription.length}/160 chars` : 'Auto-generated (160 chars)'}
            </span>
          </div>
          <input
            type="text"
            maxLength={180}
            placeholder="Auto-generated by Gemini following the title (or enter custom SEO focus)..."
            value={config.seoMetaDescription || ''}
            onChange={(e) => setConfig((prev) => ({ ...prev, seoMetaDescription: e.target.value }))}
            disabled={isGenerating}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition"
          />
          <p className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Automatically crafts a 160-char snippet following title for Google Search & Blogger.</span>
            {config.seoMetaDescription && (
              <button
                type="button"
                onClick={() => setConfig((prev) => ({ ...prev, seoMetaDescription: '' }))}
                className="text-cyan-400 hover:text-cyan-300 underline ml-2 shrink-0"
              >
                Reset to Auto
              </button>
            )}
          </p>
        </div>

        {/* Feature Checkboxes */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
          {/* Include Image Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={config.includeImages}
              onChange={(e) => setConfig((prev) => ({ ...prev, includeImages: e.target.checked }))}
              disabled={isGenerating}
              className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-0"
            />
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            Include High-Resolution Featured Image in Blogger Post
          </label>

          {/* Add Table of Contents Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={config.includeTableOfContents ?? true}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, includeTableOfContents: e.target.checked }))
              }
              disabled={isGenerating}
              className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
            />
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Add Table of Contents (Auto-generate quick navigation at start)
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={config.includeKeyTakeaways}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, includeKeyTakeaways: e.target.checked }))
              }
              disabled={isGenerating}
              className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
            />
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            Include "Board Exam Golden Tips & FAQ" Box
          </label>
        </div>

        {/* Advanced Accordion: Retries & Backoff Settings */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1.5 transition"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              Model Resiliency & Backoff Settings
            </span>
            <span className="text-[11px] text-slate-500">
              {showAdvanced ? 'Hide' : `Max Retries: ${config.maxRetries} (${config.backoffFactor}s backoff)`}
            </span>
          </button>

          {showAdvanced && (
            <div className="mt-2.5 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 font-medium">Max Retries on 503 / High Load:</span>
                  <span className="text-cyan-400 font-mono font-semibold">{config.maxRetries} attempts</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={config.maxRetries}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, maxRetries: parseInt(e.target.value, 10) }))
                  }
                  disabled={isGenerating}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 font-medium">Backoff Factor (Seconds per retry):</span>
                  <span className="text-cyan-400 font-mono font-semibold">{config.backoffFactor}s</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  step={1}
                  value={config.backoffFactor}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, backoffFactor: parseInt(e.target.value, 10) }))
                  }
                  disabled={isGenerating}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Custom Extra Instruction</label>
                <input
                  type="text"
                  placeholder="e.g. Include 10 past paper questions, add Sindhi translation, solve numerical 5"
                  value={config.customPromptExtra}
                  onChange={(e) => setConfig((prev) => ({ ...prev, customPromptExtra: e.target.value }))}
                  disabled={isGenerating}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-600 outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !config.angle.trim()}
          className="w-full relative group overflow-hidden rounded-xl p-px font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.99] bg-gradient-to-r from-amber-600 via-orange-600 to-amber-400 shadow-amber-500/25"
        >
          <div className="relative px-5 py-3 rounded-[11px] bg-slate-900/40 backdrop-blur-sm group-hover:bg-transparent transition duration-200 flex items-center justify-center gap-2">
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                <span className="text-sm font-medium text-white">
                  {currentSleepRemaining && currentSleepRemaining > 0
                    ? `Backoff wait: ${currentSleepRemaining}s before retry...`
                    : activeAttempt
                    ? `Attempt ${activeAttempt}/${config.maxRetries}: Generating with Gemini...`
                    : 'Generating article & notes...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition duration-200" />
                <span className="text-sm font-semibold tracking-wide">
                  {`Generate Class ${selectedClass} Notes & Post`}
                </span>
              </>
            )}
          </div>
        </button>

        <p className="text-[11px] text-center text-slate-500 mt-2">
          Model: <span className="font-mono text-slate-400">gemini-3.8-flash</span> • Direct HTML & Image Blogger publishing
        </p>
      </div>
    </div>
  );
};
