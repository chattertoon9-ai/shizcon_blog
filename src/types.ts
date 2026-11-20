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

export interface GenerationConfig {
  angle: string;
  category: 'sindh_board';
  tone: 'educational' | 'authoritative' | 'practical' | 'engaging';
  targetWordCount: number;
  includeKeyTakeaways: boolean;
  includeCodeExample: boolean;
  includeImages: boolean;
  includeTableOfContents: boolean;
  seoMetaDescription?: string;
  imageUrl?: string;
  sindhBoardConfig?: SindhBoardConfig;
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
  category?: 'sindh_board';
  sindhBoardMeta?: {
    classLevel: string;
    subject: string;
    medium: string;
    contentType: string;
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
