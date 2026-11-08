export interface AttemptLog {
  attempt: number;
  timestamp: string;
  status: 'started' | 'success' | 'failed' | 'retry_wait';
  message: string;
  durationMs?: number;
  sleepTimeSeconds?: number;
}

export interface SindhBoardConfig {
  classLevel: string; // '1' to '12'
  subject: string;
  stream?: string; // 'General' | 'Science' | 'Pre-Medical' | 'Pre-Engineering' | 'ICS' | 'Commerce' | 'Arts'
  contentType: 'notes' | 'solved_exercises' | 'mcqs' | 'model_paper' | 'book_summary';
  medium: 'English' | 'Urdu' | 'Sindhi';
  chapterOrTopic: string;
}

export type NewsLanguage = 'English' | 'Urdu' | 'Sindhi' | 'Arabic';

export interface NewsConfig {
  outlet: string; // 'Dawn', 'The News', 'Aaj News', 'Sindh TV News', 'KTN News', 'Kawish / Awami Awaz', 'Geo News', 'Al Jazeera', etc.
  language: NewsLanguage;
  newsType: 'breaking' | 'bulletin' | 'in_depth_report' | 'editorial' | 'regional_sindh';
  datelineCity?: string; // 'Karachi', 'Islamabad', 'Hyderabad', 'Sukkur', 'Lahore', 'Dubai', 'Riyadh', etc.
}

export interface GenerationConfig {
  angle: string;
  category: 'news' | 'sindh_board' | 'health' | 'tech' | 'longevity';
  tone: 'engaging' | 'informative' | 'technical' | 'authoritative' | 'practical' | 'empathetic' | 'evidence-based' | 'educational';
  targetWordCount: number;
  includeKeyTakeaways: boolean;
  includeCodeExample: boolean;
  includeHealthDisclaimer: boolean;
  includeImages: boolean;
  includeTableOfContents: boolean;
  seoMetaDescription?: string;
  imageUrl?: string;
  sindhBoardConfig?: SindhBoardConfig;
  newsConfig?: NewsConfig;
  customPromptExtra: string;
  maxRetries: number;
  backoffFactor: number;
}

export interface GeneratedArticle {
  id: string;
  title: string;
  summary: string;
  seoMetaDescription?: string;
  htmlContent: string;
  labels: string[];
  imageUrl?: string;
  model: string;
  createdAt: string;
  angle: string;
  category?: 'news' | 'sindh_board' | 'health' | 'tech' | 'longevity';
  sindhBoardMeta?: {
    classLevel: string;
    subject: string;
    medium: string;
    contentType: string;
  };
  newsMeta?: {
    outlet: string;
    language: NewsLanguage;
    newsType: string;
    isRTL: boolean;
  };
  successfulAttempt: number;
  totalDurationMs: number;
  logs: AttemptLog[];
}

export interface BloggerPublishResult {
  success: boolean;
  isSandbox: boolean;
  url: string;
  postId?: string;
  title?: string;
  published?: string;
  status: string;
  message: string;
}

export interface BloggerSettings {
  blogId: string;
  accessToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  isDraftDefault: boolean;
}
