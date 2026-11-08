import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  RefreshCw,
  Zap,
  HeartPulse,
  Code2,
  BookOpen,
  ShieldCheck,
  Activity,
  GraduationCap,
  Image as ImageIcon,
  Check,
  FileText,
  HelpCircle,
  Layers,
  ChevronDown,
  Languages,
  Search,
  Newspaper,
  Radio,
  Tv,
  Globe,
} from 'lucide-react';
import { GenerationConfig, SindhBoardConfig, NewsLanguage, NewsConfig } from '../types';
import { SINDH_BOARD_CLASSES, ClassDefinition, ClassSubject } from '../data/sindhBoardData';
import { getFeaturedImageUrl } from '../utils/imageHelper';

interface NewsOutletItem {
  id: string;
  name: string;
  nativeName: string;
  badge: string;
  defaultLang: NewsLanguage;
  availableLangs: NewsLanguage[];
}

const NEWS_OUTLETS: NewsOutletItem[] = [
  {
    id: 'dawn',
    name: 'Dawn News',
    nativeName: 'ڈان نیوز / Dawn',
    badge: 'Premier National & Global',
    defaultLang: 'English',
    availableLangs: ['English', 'Urdu'],
  },
  {
    id: 'thenews',
    name: 'The News International',
    nativeName: 'دی نیوز',
    badge: 'Investigative & National',
    defaultLang: 'English',
    availableLangs: ['English'],
  },
  {
    id: 'aaj',
    name: 'Aaj News',
    nativeName: 'آج نیوز',
    badge: '24/7 TV & Breaking News',
    defaultLang: 'Urdu',
    availableLangs: ['Urdu', 'English'],
  },
  {
    id: 'sindhtv',
    name: 'Sindh TV News',
    nativeName: 'سنڌ ٽي وي نيوز',
    badge: 'Sindh Satellite Network',
    defaultLang: 'Sindhi',
    availableLangs: ['Sindhi', 'Urdu', 'English'],
  },
  {
    id: 'ktn',
    name: 'KTN News',
    nativeName: 'ڪي ٽي اين نيوز',
    badge: 'First 24-Hour Sindhi News',
    defaultLang: 'Sindhi',
    availableLangs: ['Sindhi', 'Urdu'],
  },
  {
    id: 'kawish',
    name: 'Daily Kawish / Awami Awaz',
    nativeName: 'روزاني ڪاوش / عوامي آواز',
    badge: 'Sindhi Print & Investigative',
    defaultLang: 'Sindhi',
    availableLangs: ['Sindhi'],
  },
  {
    id: 'geo_ary',
    name: 'Geo News / ARY News',
    nativeName: 'جیو نیوز / اے آر وائی',
    badge: 'Top Urdu Broadcast Networks',
    defaultLang: 'Urdu',
    availableLangs: ['Urdu', 'English'],
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera / Arab News',
    nativeName: 'الجزيرة / عرب نيوز',
    badge: 'Arabic & Middle East Hub',
    defaultLang: 'Arabic',
    availableLangs: ['Arabic', 'English'],
  },
];

const NEWS_PRESETS = [
  {
    outlet: 'Dawn News',
    lang: 'English' as NewsLanguage,
    categoryLabel: 'National & Economy',
    headline: 'Dawn News: Federal Government Approves Multi-Billion IT Export Roadmap and Freelance Remittance Tax Relief Package',
  },
  {
    outlet: 'The News International',
    lang: 'English' as NewsLanguage,
    categoryLabel: 'Judiciary & Governance',
    headline: 'The News International: Supreme Court Constitutional Bench Begins Landmark Hearings on Governance and Public Petitions',
  },
  {
    outlet: 'Dawn News',
    lang: 'English' as NewsLanguage,
    categoryLabel: 'Sindh Infrastructure',
    headline: 'Dawn: ECNEC Greenlights Greater Karachi Water Supply Project (K-IV) and Hyderabad-Sukkur Motorway Financing',
  },
  {
    outlet: 'Aaj News',
    lang: 'Urdu' as NewsLanguage,
    categoryLabel: 'قومی و معیشت',
    headline: 'آج نیوز: وفاقی کابینہ کا عوام کے لیے بڑے ریلیف پیکیج کا اعلان، بجلی اور گیس کے ٹیرف میں سبسڈی کی حتمی منظوری',
  },
  {
    outlet: 'Aaj News',
    lang: 'Urdu' as NewsLanguage,
    categoryLabel: 'مارکیٹ و تجارت',
    headline: 'آج نیوز: پاکستان اسٹاک ایکسچینج میں ریکارڈ تیزی، 100 انڈیکس میں تاریخی اضافہ اور ڈالر کے مقابلے میں روپیہ مستحکم',
  },
  {
    outlet: 'Sindh TV News',
    lang: 'Sindhi' as NewsLanguage,
    categoryLabel: 'سنڌ صوبائي ترقي',
    headline: 'سنڌ ٽي وي نيوز: سنڌ حڪومت پاران ڪراچي، حيدرآباد ۽ سکر ۾ تعليم ۽ صحت کاتي لاءِ نون ترقياتي پيڪيجز جو اعلان',
  },
  {
    outlet: 'KTN News',
    lang: 'Sindhi' as NewsLanguage,
    categoryLabel: 'سنڌ جون خبرون',
    headline: 'ڪي ٽي اين نيوز: وڏي وزير جي صدارت هيٺ اهم اجلاس: سنڌ جي سرڪاري اسپتالن ۽ بنيادي صحت مرڪزن جي فوري بحاليءَ جا حڪم',
  },
  {
    outlet: 'Daily Kawish / Awami Awaz',
    lang: 'Sindhi' as NewsLanguage,
    categoryLabel: 'زراعت ۽ سنڌو درياءُ',
    headline: 'روزاني ڪاوش: سنڌ جي آبادگارن لاءِ زرعي بجلي ۽ ڀاڻ تي فوري سبسڊي جو مطالبو، ڪڻڪ ۽ ڪپهه جا نوان اگهه مقرر',
  },
  {
    outlet: 'Daily Kawish / Awami Awaz',
    lang: 'Sindhi' as NewsLanguage,
    categoryLabel: 'آبپاشي ۽ بئراج',
    headline: 'عوامي آواز: سکر بئراج، ڪوٽڙي ۽ گڊو بئراج جي بچاءَ بندن جي حفاظت لاءِ سالياني معائني ۽ مرمت بابت تفصيلي رپورٽ',
  },
  {
    outlet: 'Al Jazeera / Arab News',
    lang: 'Arabic' as NewsLanguage,
    categoryLabel: 'عالمي و اقتصاد عربي',
    headline: 'الجزيرة نت: باكستان ودول مجلس التعاون الخليجي توقعان اتفاقيات شراكة استراتيجية بمليارات الدولارات في مجالات الطاقة والزراعة والتعدين',
  },
  {
    outlet: 'Al Jazeera / Arab News',
    lang: 'Arabic' as NewsLanguage,
    categoryLabel: 'الشرق الأوسط',
    headline: 'عرب نيوز: وزير التجارة الباكستاني يختتم مباحثات موسعة في الرياض لتعزيز التبادل التجاري وتسهيل الصادرات المتبادلة',
  },
];

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
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'news' | 'sindh_board' | 'health' | 'tech' | 'longevity'>(
    config.category || 'news'
  );

  // News State
  const [selectedOutlet, setSelectedOutlet] = useState<string>(config.newsConfig?.outlet || 'Dawn News');
  const [selectedNewsLanguage, setSelectedNewsLanguage] = useState<NewsLanguage>(config.newsConfig?.language || 'English');
  const [selectedNewsType, setSelectedNewsType] = useState<'breaking' | 'bulletin' | 'in_depth_report' | 'editorial' | 'regional_sindh'>(
    config.newsConfig?.newsType || 'breaking'
  );
  const [selectedDatelineCity, setSelectedDatelineCity] = useState<string>(config.newsConfig?.datelineCity || 'Islamabad');

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
    if (selectedCategoryTab === 'sindh_board') {
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
        includeHealthDisclaimer: false,
      }));
    }
  }, [selectedClass, selectedStream, selectedSubject, selectedChapter, contentType, medium, selectedCategoryTab, customImageUrl]);

  const handleOutletSelect = (outletItem: NewsOutletItem) => {
    setSelectedOutlet(outletItem.name);
    let langToUse = selectedNewsLanguage;
    if (!outletItem.availableLangs.includes(selectedNewsLanguage)) {
      langToUse = outletItem.defaultLang;
      setSelectedNewsLanguage(outletItem.defaultLang);
    }
    const detectedImg = getFeaturedImageUrl('news', config.angle || outletItem.name);
    setConfig((prev) => ({
      ...prev,
      imageUrl: customImageUrl || detectedImg,
      newsConfig: {
        outlet: outletItem.name,
        language: langToUse,
        newsType: selectedNewsType,
        datelineCity: selectedDatelineCity,
      },
    }));
  };

  const handleNewsLanguageSelect = (lang: NewsLanguage) => {
    setSelectedNewsLanguage(lang);
    setConfig((prev) => ({
      ...prev,
      newsConfig: {
        outlet: selectedOutlet,
        language: lang,
        newsType: selectedNewsType,
        datelineCity: selectedDatelineCity,
      },
    }));
  };

  const handleNewsTypeSelect = (type: 'breaking' | 'bulletin' | 'in_depth_report' | 'editorial' | 'regional_sindh') => {
    setSelectedNewsType(type);
    setConfig((prev) => ({
      ...prev,
      newsConfig: {
        outlet: selectedOutlet,
        language: selectedNewsLanguage,
        newsType: type,
        datelineCity: selectedDatelineCity,
      },
    }));
  };

  const handleDatelineChange = (city: string) => {
    setSelectedDatelineCity(city);
    setConfig((prev) => ({
      ...prev,
      newsConfig: {
        outlet: selectedOutlet,
        language: selectedNewsLanguage,
        newsType: selectedNewsType,
        datelineCity: city,
      },
    }));
  };

  const handleSelectNewsPreset = (preset: { outlet: string; headline: string; lang: NewsLanguage }) => {
    setSelectedOutlet(preset.outlet);
    setSelectedNewsLanguage(preset.lang);
    const img = getFeaturedImageUrl('news', preset.headline);
    setConfig((prev) => ({
      ...prev,
      category: 'news',
      angle: preset.headline,
      imageUrl: customImageUrl || img,
      tone: 'informative',
      newsConfig: {
        outlet: preset.outlet,
        language: preset.lang,
        newsType: selectedNewsType,
        datelineCity: selectedDatelineCity,
      },
      includeCodeExample: false,
      includeHealthDisclaimer: false,
    }));
  };

  const handleCategorySwitch = (cat: 'news' | 'sindh_board' | 'health' | 'tech' | 'longevity') => {
    setSelectedCategoryTab(cat);

    if (cat === 'news') {
      const defaultAngle =
        selectedNewsLanguage === 'Urdu'
          ? 'آج نیوز: وفاقی کابینہ کا عوام کے لیے بڑے ریلیف پیکیج کا اعلان، بجلی اور گیس بلوں میں سبسڈی کی تفصیلات'
          : selectedNewsLanguage === 'Sindhi'
          ? 'سنڌ ٽي وي نيوز: سنڌ جي مختلف ضلعن ۾ ترقياتي رٿائن، تعليم ۽ صحت کاتي جي سڌارن بابت تفصيلي رپورٽ'
          : selectedNewsLanguage === 'Arabic'
          ? 'الجزيرة نت: باكستان والدول العربية تعززان الشراكة الاقتصادية والاستثمار المشترك في الطاقة والزراعة'
          : 'Dawn News: Federal Government Approves Multi-Billion IT Export Roadmap and Freelance Remittance Tax Relief Package';
      const detectedImage = getFeaturedImageUrl('news', defaultAngle);
      setConfig((prev) => ({
        ...prev,
        category: 'news',
        angle: defaultAngle,
        tone: 'informative',
        imageUrl: customImageUrl || detectedImage,
        newsConfig: {
          outlet: selectedOutlet,
          language: selectedNewsLanguage,
          newsType: selectedNewsType,
          datelineCity: selectedDatelineCity,
        },
        includeCodeExample: false,
        includeHealthDisclaimer: false,
      }));
    } else if (cat === 'sindh_board') {
      const detectedImage = getFeaturedImageUrl('sindh_board', 'Class 10 Physics', 'Physics');
      setConfig((prev) => ({
        ...prev,
        category: 'sindh_board',
        tone: 'educational',
        imageUrl: detectedImage,
        includeHealthDisclaimer: false,
      }));
    } else if (cat === 'health') {
      const healthAngle = '10 Actionable Daily Health Habits That Supercharge Cellular Energy, Mental Clarity, and Immunity';
      const detectedImage = getFeaturedImageUrl('health', healthAngle);
      setConfig((prev) => ({
        ...prev,
        category: 'health',
        angle: healthAngle,
        tone: 'empathetic',
        imageUrl: detectedImage,
        includeHealthDisclaimer: true,
        includeCodeExample: false,
      }));
    } else if (cat === 'tech') {
      const techAngle = 'Innovative coding and software engineering practices for beginners';
      const detectedImage = getFeaturedImageUrl('tech', techAngle);
      setConfig((prev) => ({
        ...prev,
        category: 'tech',
        angle: techAngle,
        tone: 'engaging',
        imageUrl: detectedImage,
        includeCodeExample: true,
        includeHealthDisclaimer: false,
      }));
    } else {
      const longevAngle = 'Daily Habits of Super-Agers: Science-Backed Longevity, Joint Mobility, and Cognitive Fitness Protocols';
      const detectedImage = getFeaturedImageUrl('health', longevAngle);
      setConfig((prev) => ({
        ...prev,
        category: 'longevity',
        angle: longevAngle,
        tone: 'evidence-based',
        imageUrl: detectedImage,
        includeHealthDisclaimer: true,
        includeCodeExample: false,
      }));
    }
  };

  // Preview current computed or custom image
  const activeImage = customImageUrl || config.imageUrl || getFeaturedImageUrl(
    config.category,
    config.angle,
    config.sindhBoardConfig?.subject
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl flex flex-col h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-lg ${
              selectedCategoryTab === 'news'
                ? 'bg-red-500/10 text-red-400'
                : selectedCategoryTab === 'sindh_board'
                ? 'bg-amber-500/10 text-amber-400'
                : selectedCategoryTab === 'health'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-blue-500/10 text-blue-400'
            }`}
          >
            {selectedCategoryTab === 'news' ? (
              <Newspaper className="w-5 h-5" />
            ) : selectedCategoryTab === 'sindh_board' ? (
              <GraduationCap className="w-5 h-5" />
            ) : selectedCategoryTab === 'health' ? (
              <HeartPulse className="w-5 h-5" />
            ) : (
              <Code2 className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              Article & Post Studio
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {selectedCategoryTab === 'news'
                  ? '📰 News Wire (Dawn • The News • Aaj • Sindhi • Arabic)'
                  : selectedCategoryTab === 'sindh_board'
                  ? '📚 Sindh Board Class 1–12'
                  : selectedCategoryTab === 'health'
                  ? '🩺 Health & Wellness'
                  : selectedCategoryTab === 'tech'
                  ? '💻 Tech & Code'
                  : '🌿 Longevity'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Gemini 3.8 Flash • Auto-Images • Blogger v3</p>
          </div>
        </div>

        {/* Quick Image & Random controls */}
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
        {/* Category Mode Switcher Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Category / Domain:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleCategorySwitch('news')}
              className={`py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${
                selectedCategoryTab === 'news'
                  ? 'bg-red-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-red-200" />
              <span className="truncate">News & Media</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch('sindh_board')}
              className={`py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${
                selectedCategoryTab === 'sindh_board'
                  ? 'bg-amber-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="truncate">Sindh Board</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch('health')}
              className={`py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${
                selectedCategoryTab === 'health'
                  ? 'bg-emerald-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span className="truncate">Health</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch('tech')}
              className={`py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${
                selectedCategoryTab === 'tech'
                  ? 'bg-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="truncate">Tech & Code</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch('longevity')}
              className={`py-1.5 px-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${
                selectedCategoryTab === 'longevity'
                  ? 'bg-teal-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="truncate">Longevity</span>
            </button>
          </div>
        </div>

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

        {/* News Media Interactive Module */}
        {selectedCategoryTab === 'news' && (
          <div className="p-3.5 bg-slate-950/90 rounded-xl border border-red-900/40 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <Newspaper className="w-4 h-4 text-red-400" />
                Multi-Channel News Wire (English, Urdu, Sindhi, Arabic)
              </span>
              <span className="text-[10px] bg-red-950/60 text-red-300 border border-red-800 px-1.5 py-0.5 rounded">
                Live Press Wire
              </span>
            </div>

            {/* News Outlet Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select News Channel / Press Outlet:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {NEWS_OUTLETS.map((outlet) => {
                  const isSelected = selectedOutlet === outlet.name;
                  return (
                    <button
                      key={outlet.id}
                      type="button"
                      onClick={() => handleOutletSelect(outlet)}
                      className={`p-2 rounded-xl text-left border transition relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-red-950/50 border-red-500 shadow-md ring-1 ring-red-500/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-red-300' : 'text-slate-200'}`}>
                          {outlet.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate" dir="auto">
                        {outlet.nativeName}
                      </div>
                      <div className="text-[9px] text-slate-500 mt-1 truncate">
                        {outlet.badge}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language, News Beat & Dateline Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Language Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-cyan-400" />
                  Language & Script:
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {(['English', 'Urdu', 'Sindhi', 'Arabic'] as NewsLanguage[]).map((lang) => {
                    const isSelected = selectedNewsLanguage === lang;
                    const nativeLabel =
                      lang === 'English'
                        ? 'English'
                        : lang === 'Urdu'
                        ? 'اردو'
                        : lang === 'Sindhi'
                        ? 'سنڌي'
                        : 'العربية';
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleNewsLanguageSelect(lang)}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition border flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500'
                            : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <span>{lang}</span>
                        <span className="text-[11px] font-normal opacity-80" dir={lang !== 'English' ? 'rtl' : 'ltr'}>
                          {nativeLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* News Beat / Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  News Format / Beat:
                </label>
                <select
                  value={selectedNewsType}
                  onChange={(e) => handleNewsTypeSelect(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-red-500 outline-none"
                >
                  <option value="breaking">🚨 Breaking News Flash</option>
                  <option value="bulletin">📺 24/7 TV Bulletin & Rundown</option>
                  <option value="in_depth_report">📰 In-Depth Investigative Report</option>
                  <option value="editorial">✍️ Editorial & Op-Ed Analysis</option>
                  <option value="regional_sindh">🏛️ Sindh Regional & District Beat</option>
                </select>
              </div>

              {/* Dateline Bureau */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Dateline Bureau:
                </label>
                <select
                  value={selectedDatelineCity}
                  onChange={(e) => handleDatelineChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:border-red-500 outline-none"
                >
                  <option value="Islamabad">Islamabad (Federal Bureau)</option>
                  <option value="Karachi">Karachi (Sindh Bureau)</option>
                  <option value="Hyderabad">Hyderabad (Lower Sindh)</option>
                  <option value="Sukkur">Sukkur (Upper Sindh)</option>
                  <option value="Larkana">Larkana (Sindh)</option>
                  <option value="Lahore">Lahore (Punjab Bureau)</option>
                  <option value="Peshawar">Peshawar (KP Bureau)</option>
                  <option value="Quetta">Quetta (Balochistan Bureau)</option>
                  <option value="Riyadh">Riyadh (Middle East)</option>
                  <option value="Dubai">Dubai (Gulf Bureau)</option>
                  <option value="Cairo">Cairo (Arab League)</option>
                  <option value="London">London (International)</option>
                  <option value="Washington">Washington D.C. (World)</option>
                </select>
              </div>
            </div>

            {/* Quick News Wire Presets */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                ⚡ Quick News Wire Presets (Click to Load):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
                {NEWS_PRESETS.map((preset, idx) => {
                  const isCur = config.angle === preset.headline;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectNewsPreset(preset)}
                      className={`p-2 rounded-lg text-left border transition text-xs flex flex-col justify-between ${
                        isCur
                          ? 'bg-red-950/40 border-red-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-red-400">{preset.outlet}</span>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                          {preset.lang}
                        </span>
                      </div>
                      <p className="line-clamp-2 leading-relaxed text-[11px]" dir={preset.lang !== 'English' ? 'rtl' : 'ltr'}>
                        {preset.headline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sindh Board Interactive Module */}
        {selectedCategoryTab === 'sindh_board' && (
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
        )}

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
            dir={selectedCategoryTab === 'news' && selectedNewsLanguage !== 'English' ? 'rtl' : 'ltr'}
            disabled={isGenerating}
            placeholder={
              selectedCategoryTab === 'news'
                ? selectedNewsLanguage === 'Urdu'
                  ? 'خبر کی سرخی یا تفصیل درج کریں...'
                  : selectedNewsLanguage === 'Sindhi'
                  ? 'خبر جي سُرخي يا تفصيل هتي لکو...'
                  : selectedNewsLanguage === 'Arabic'
                  ? 'اكتب عنوان الخبر أو التقرير الصحفي هنا...'
                  : 'Enter news headline, press release, or investigative angle...'
                : 'Article topic or Sindh Board chapter notes description...'
            }
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
              {selectedCategoryTab === 'news' ? (
                <>
                  <option value="informative">Fast-Paced News Bulletin & Ticker</option>
                  <option value="authoritative">Senior Bureau Chief & Editorial Analysis</option>
                  <option value="technical">Special Investigative & Data-Driven</option>
                  <option value="engaging">Catchy Breaking News & Public Interest</option>
                </>
              ) : selectedCategoryTab === 'sindh_board' ? (
                <>
                  <option value="educational">Educational & Exam-Focused</option>
                  <option value="authoritative">Curriculum Board Specialist</option>
                  <option value="practical">Step-by-Step Solved Guide</option>
                  <option value="engaging">Student-Friendly & Engaging</option>
                </>
              ) : selectedCategoryTab === 'health' ? (
                <>
                  <option value="empathetic">Empathetic & Practical</option>
                  <option value="evidence-based">Evidence-Based & Scientific</option>
                  <option value="engaging">Engaging & Motivational</option>
                  <option value="authoritative">Authoritative Health Guide</option>
                </>
              ) : (
                <>
                  <option value="engaging">Engaging & Catchy</option>
                  <option value="informative">Informative & News Style</option>
                  <option value="technical">Technical Deep-Dive</option>
                  <option value="authoritative">Authoritative / Expert</option>
                </>
              )}
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
            {selectedCategoryTab === 'news'
              ? 'Include "Key News Highlights & Bulletins" Box'
              : selectedCategoryTab === 'sindh_board'
              ? 'Include "Board Exam Golden Tips & FAQ" Box'
              : selectedCategoryTab === 'health'
              ? 'Include "Actionable Health Tips" Box'
              : 'Include Key Takeaways Box'}
          </label>

          {selectedCategoryTab === 'health' && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={config.includeHealthDisclaimer}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, includeHealthDisclaimer: e.target.checked }))
                }
                disabled={isGenerating}
                className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Include Medical & Educational Disclaimer
            </label>
          )}

          {selectedCategoryTab === 'tech' && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={config.includeCodeExample}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, includeCodeExample: e.target.checked }))
                }
                disabled={isGenerating}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
              />
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              Include Practical Code or Architecture Example
            </label>
          )}
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
          className={`w-full relative group overflow-hidden rounded-xl p-px font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.99] ${
            selectedCategoryTab === 'sindh_board'
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-400 shadow-amber-500/25'
              : selectedCategoryTab === 'health'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 shadow-emerald-500/25'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-blue-500/25'
          }`}
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
                  {selectedCategoryTab === 'sindh_board'
                    ? `Generate Class ${selectedClass} Notes & Post`
                    : selectedCategoryTab === 'health'
                    ? 'Generate Health Article for Blogger'
                    : 'Generate Article for Blogger'}
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
