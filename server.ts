// Simple, robust Express server that acts as a bridge between the
// React client and the Gemini 3.8 Flash API, plus Google Blogger v3 API.
// Education only: generates Sindh Board Class 1–12 chapter notes,
// solved exercises, MCQs and model papers and publishes them to Blogger.
//
// NOTE: this server is for LOCAL use only. GitHub Pages is static hosting
// and cannot run this Express server, so article generation and Blogger
// publishing do not work on the deployed static site — the UI shows a
// static-hosting notice in that case.
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- Load environment variables ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const DEFAULT_BLOGGER_BLOG_ID = process.env.BLOGGER_BLOG_ID || '';
const DEFAULT_BLOGGER_ACCESS_TOKEN = process.env.BLOGGER_ACCESS_TOKEN || '';
const DEFAULT_BLOGGER_CLIENT_ID = process.env.BLOGGER_CLIENT_ID || '';
const DEFAULT_BLOGGER_CLIENT_SECRET = process.env.BLOGGER_CLIENT_SECRET || '';
const DEFAULT_BLOGGER_REFRESH_TOKEN = process.env.BLOGGER_REFRESH_TOKEN || '';

// --- Types ---
interface GenerationConfig {
  category: string;
  angle: string;
  tone: string;
  targetWordCount: number;
  maxRetries: number;
  backoffFactor: number;
  includeKeyTakeaways: boolean;
  includeTableOfContents: boolean;
  includeImages: boolean;
  imageUrl?: string;
  seoMetaDescription?: string;
  customPromptExtra?: string;
  includeCodeExample: boolean;
  sindhBoardConfig?: {
    classLevel: string;
    subject: string;
    stream?: string;
    contentType: 'notes' | 'solved_exercises' | 'mcqs' | 'model_paper' | 'book_summary';
    medium: 'English' | 'Urdu' | 'Sindhi';
    chapterOrTopic: string;
  };
}

// --- Gemini URL Helper ---
function getGeminiApiUrl(model: string): string {
  const safeModel = model && model.trim() !== '' ? model.trim() : 'gemini-3.8-flash';
  return `https://generativelanguage.googleapis.com/v1beta/models/${safeModel}:generateContent`;
}

// --- Blogger Token Helper (OAuth 2.0) ---
async function refreshBloggerToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const payload = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`OAuth token refresh failed: ${data.error || data.error_description || res.statusText}`);
  }
  return data.access_token;
}

// --- Blogger Publish Helper ---
async function publishToBlogger(
  blogId: string,
  accessToken: string,
  title: string,
  contentHtml: string,
  labels: string[],
  isDraft: boolean
) {
  const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/?isDraft=${isDraft}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      kind: 'blogger#post',
      blog: { id: blogId },
      title,
      content: contentHtml,
      labels,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Blogger API Error ${res.status}: ${data.error?.message || res.statusText}`);
  }
  return data;
}

// --- Helper: HTTP Fetch with Retry Logic (Manual fetch wrapper for Gemini, using global fetch) ---
async function callGeminiWithRetries(
  systemPrompt: string,
  userPrompt: string,
  maxRetries: number,
  backoffFactor: number
): Promise<{ text: string; logs: string[] }> {
  const logs: string[] = [];
  const url = getGeminiApiUrl(GEMINI_MODEL);
  logs.push(`[INIT] Model: ${GEMINI_MODEL} (${url})`);
  logs.push(`[INIT] User: prompt length ${userPrompt.length} chars, System: ${systemPrompt.length} chars`);

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      topK: 40,
      topP: 0.95,
    },
  };

  let attempt = 0;
  let lastError = '';

  while (attempt < maxRetries) {
    attempt++;
    logs.push(`[Attempt ${attempt}/${maxRetries}] Calling Gemini...`);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errText = `HTTP ${response.status}`;
        try {
          const errData = await response.json();
          if (errData.error && errData.error.message) errText = errData.error.message;
        } catch (e) {
          /* ignore */
        }
        lastError = errText;

        // Handle rate limit (429) / overloaded (503) / service unavailable (500) with exponential backoff
        if (response.status === 429 || response.status === 503 || response.status === 500) {
          const waitSeconds = backoffFactor * attempt;
          logs.push(`[Attempt ${attempt}/${maxRetries}] FAILED: ${errText} (HTTP ${response.status}). Backing off for ${waitSeconds}s...`);
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
            continue;
          }
        } else {
          logs.push(`[Attempt ${attempt}/${maxRetries}] FAILED: ${errText} (Non-retryable)`);
          break;
        }
      } else {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!rawText) {
          lastError = 'Empty response from Gemini';
          logs.push(`[Attempt ${attempt}/${maxRetries}] FAILED: Empty response. Retrying...`);
          const waitSeconds = backoffFactor * attempt;
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
            continue;
          }
        } else {
          logs.push(`[Attempt ${attempt}/${maxRetries}] SUCCESS: Generated ${rawText.length} chars.`);
          return { text: rawText, logs };
        }
      }
    } catch (error: any) {
      lastError = error.message || String(error);
      logs.push(`[Attempt ${attempt}/${maxRetries}] NETWORK ERROR: ${lastError}`);
      const waitSeconds = backoffFactor * attempt;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
        continue;
      }
    }
  }

  throw new Error(`Gemini failed after ${maxRetries} attempts. Last error: ${lastError}`);
}

// --- Prompt Builder: Sindh Board education notes ---
function buildArticlePrompt(config: GenerationConfig): { systemPrompt: string; userPrompt: string } {
  const sb = config.sindhBoardConfig;
  const sbLabel = sb
    ? `Sindh Board Class ${sb.classLevel} ${sb.subject}${sb.stream ? ` (${sb.stream})` : ''} - ${sb.chapterOrTopic}`
    : 'Sindh Board Notes';

  const mediumNote =
    sb?.medium === 'Urdu'
      ? `Medium: URDU. All headings, notes and explanations must be written in clear Urdu (اردو), using simple and easy language for students. Keep key terms in English in brackets where helpful.`
      : sb?.medium === 'Sindhi'
      ? `Medium: SINDHI. All headings, notes and explanations must be written in clear Sindhi (سنڌي), using simple and easy language for students. Keep key terms in English in brackets where helpful.`
      : `Medium: ENGLISH. All headings, notes and explanations must be written in clear, simple English for students.`;

  const contentTypeNote =
    sb?.contentType === 'solved_exercises'
      ? `CONTENT FORMAT: SOLVED TEXTBOOK EXERCISES. Write step-by-step solutions for the textbook exercise questions of this chapter, including all numerical problems with full working, formulas and final answers. Add a short theory recap before each section and a "Board Exam Tips" box at the end.`
      : sb?.contentType === 'mcqs'
      ? `CONTENT FORMAT: SOLVED MCQs. Write at least 20 high-yield multiple choice questions from this chapter with 4 options each, the correct answer marked, and a 1-line reason for each answer. End with a quick revision summary and exam tips.`
      : sb?.contentType === 'model_paper'
      ? `CONTENT FORMAT: MODEL PAPER. Create a complete Board Exam model paper for this chapter/subject: Section A (MCQs), Section B (short questions) and Section C (long questions), with marks distribution, time allowed, and a solved answer key / marking scheme at the end.`
      : sb?.contentType === 'book_summary'
      ? `CONTENT FORMAT: TEXTBOOK SUMMARY & GUIDE. Write a complete chapter summary of this textbook chapter: key concepts, important definitions, formulas, diagrams explained in words, important questions list, and a revision checklist.`
      : `CONTENT FORMAT: COMPLETE CHAPTER NOTES. Write full chapter notes: introduction, all key concepts explained simply, important definitions, formulas with examples, solved numericals where relevant, diagrams explained in words, and a summary table at the end.`;

  const systemPrompt = `You are a professional Pakistani education content writer and Sindh Board (STBB Jamshoro / BSEK / BIEK) curriculum expert.

You write original, accurate, exam-focused study material for students of Class 1 to 12 in Pakistan. Your notes follow the Sindh Textbook Board syllabus exactly, use simple student-friendly language, and are structured for board exam preparation (short questions, long questions, MCQs and numericals).

CRITICAL RULES:
1. NEVER invent fake textbook page numbers or claim to quote the textbook verbatim — write original explanations in your own words.
2. All science, maths and facts must be correct and syllabus-accurate for the stated class and subject.
3. Keep the tone educational and encouraging. Use headings, bullet points and tables for readability.
4. Structure the output as clean HTML: <h2>, <h3>, <p>, <ul>, <ol>, <table>, <strong>, <blockquote> are allowed. Do NOT wrap the whole output in markdown code fences.`;

  const userPrompt = `TOPIC / CHAPTER:
${sbLabel}
${config.angle}

${mediumNote}

${contentTypeNote}

TARGET WORD COUNT: approximately ${config.targetWordCount} words.

ADDITIONAL INSTRUCTION: ${config.customPromptExtra || 'Follow the Sindh Board syllabus and keep everything exam-focused.'}

STRUCTURE REQUIREMENTS:
- Start with the title and a short introduction of the chapter/topic.
${config.includeTableOfContents ? '- After the introduction, include a Table of Contents listing the main sections.\n' : ''}- Use clear section headings (h2/h3) for every concept.
- Include solved examples / numericals where the subject needs them.
- End with a summary of key points.
${config.includeKeyTakeaways ? '- End with a "Board Exam Golden Tips & FAQ" box: 5 golden tips and 5 frequently asked exam questions with short answers.\n' : ''}- Close with 5 SEO tags on a separate line starting with "TAGS:".

SEO META DESCRIPTION:
${
    config.seoMetaDescription
      ? `Use exactly this meta description (max 160 characters): "${config.seoMetaDescription}"`
      : `Write a compelling SEO meta description (max 160 characters, following the title) for this study material. Put it on a separate line starting with "META:"`
}

OUTPUT FORMAT (strict):
- First line: the article title (plain text, no HTML tags).
- Then the full article body as clean HTML.
- Then a line starting with "META:" followed by the meta description.
- Then a line starting with "TAGS:" followed by 5 comma-separated tags.
- Do NOT include any markdown fences, JSON, or commentary outside this structure.`;

  return { systemPrompt, userPrompt };
}

// --- Helper: Parse title, summary, tags, meta description from AI output ---
function parseTitleSummaryTags(rawText: string) {
  // Clean markdown fences if present
  let text = rawText.replace(/^```html\s*/i, '').replace(/```$/m, '').trim();

  const lines = text.split('\n');
  let title = 'Sindh Board Notes';
  let metaDescription = '';
  let tags: string[] = [];
  const bodyLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (i === 0 && line && !line.startsWith('<') && !line.toUpperCase().startsWith('META:') && !line.toUpperCase().startsWith('TAGS:')) {
      title = line.replace(/^#+\s*/, '').replace(/^\*+/, '').replace(/\*+$/, '').trim();
      continue;
    }
    if (line.toUpperCase().startsWith('META:')) {
      metaDescription = line.slice(5).trim();
      continue;
    }
    if (line.toUpperCase().startsWith('TAGS:')) {
      const tagStr = line.slice(5).trim();
      tags = tagStr.split(',').map((t) => t.trim()).filter((t) => t.length > 0).slice(0, 5);
      continue;
    }
    bodyLines.push(lines[i]);
  }

  let htmlContent = bodyLines.join('\n').trim();

  // Extract a short summary: first paragraph text (strip HTML)
  let summary = '';
  const pMatch = htmlContent.match(/<p[^>]*>(.*?)<\/p>/is);
  if (pMatch) {
    summary = pMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 200);
  }
  if (!summary) {
    summary = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
  }

  if (!metaDescription) {
    metaDescription = summary.slice(0, 157);
  }

  return { title, htmlContent, summary, tags, metaDescription };
}

// --- Config endpoint ---
app.get('/api/config', (req, res) => {
  res.json({
    geminiConfigured: Boolean(GEMINI_API_KEY),
    model: GEMINI_MODEL,
    hasLiveCreds: Boolean(DEFAULT_BLOGGER_ACCESS_TOKEN || DEFAULT_BLOGGER_REFRESH_TOKEN),
    blogId: DEFAULT_BLOGGER_BLOG_ID || null,
  });
});

// --- Generate Education Article endpoint ---
app.post('/api/generate-education-article', async (req, res) => {
  const config: GenerationConfig = req.body.config || req.body;
  const logs: string[] = [];

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is not configured on the server. Please set it in your .env file.' });
  }

  if (!config || !config.angle || config.angle.trim() === '') {
    return res.status(400).json({ success: false, error: 'Missing topic / chapter angle in config.' });
  }

  try {
    logs.push(`[START] Education article generation requested. Class: ${config.sindhBoardConfig?.classLevel || 'N/A'}, Subject: ${config.sindhBoardConfig?.subject || 'N/A'}`);

    // Build prompts
    const { systemPrompt, userPrompt } = buildArticlePrompt(config);

    // Call Gemini with retries
    const { text: rawText, logs: geminiLogs } = await callGeminiWithRetries(
      systemPrompt,
      userPrompt,
      config.maxRetries || 5,
      config.backoffFactor || 4
    );
    logs.push(...geminiLogs);

    // Parse output
    const { title, htmlContent, summary, tags, metaDescription } = parseTitleSummaryTags(rawText);
    logs.push(`[PARSE] Title: "${title}", Tags: ${tags.join(', ') || 'none'}, Meta: ${metaDescription.slice(0, 60)}...`);

    // Featured image (auto-detect if not supplied)
    let imageUrl = config.imageUrl;
    if (config.includeImages && !imageUrl) {
      const angleLower = config.angle.toLowerCase();
      const subjectLower = (config.sindhBoardConfig?.subject || '').toLowerCase();
      if (subjectLower.includes('physics') || angleLower.includes('physics')) {
        imageUrl = 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1200&q=80';
      } else if (subjectLower.includes('chemistry') || angleLower.includes('chemistry')) {
        imageUrl = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80';
      } else if (subjectLower.includes('biology') || angleLower.includes('biology')) {
        imageUrl = 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80';
      } else if (subjectLower.includes('math') || angleLower.includes('math')) {
        imageUrl = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80';
      } else if (subjectLower.includes('computer') || angleLower.includes('computer')) {
        imageUrl = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80';
      }
    }

    const article = {
      id: crypto.randomUUID(),
      title,
      summary,
      htmlContent,
      tags,
      metaDescription,
      category: 'sindh_board',
      createdAt: new Date().toISOString(),
      wordCount: htmlContent.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
      imageUrl: config.includeImages ? imageUrl : undefined,
      sindhBoardMeta: config.sindhBoardConfig
        ? {
            classLevel: config.sindhBoardConfig.classLevel,
            subject: config.sindhBoardConfig.subject,
            stream: config.sindhBoardConfig.stream,
            contentType: config.sindhBoardConfig.contentType,
            medium: config.sindhBoardConfig.medium,
            chapterOrTopic: config.sindhBoardConfig.chapterOrTopic,
          }
        : undefined,
    };

    logs.push(`[DONE] Article "${title}" generated (${article.wordCount} words).`);
    res.json({ success: true, article, logs });
  } catch (error: any) {
    console.error('Generate error:', error);
    logs.push(`[ERROR] ${error.message}`);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate education article', logs });
  }
});

// --- Publish to Blogger endpoint ---
app.post('/api/publish-blogger', async (req, res) => {
  const { article, settings, isDraft } = req.body;

  if (!article || !article.title || !article.htmlContent) {
    return res.status(400).json({ success: false, error: 'Invalid article payload.' });
  }

  const blogId = settings.blogId || DEFAULT_BLOGGER_BLOG_ID;
  if (!blogId) {
    return res.status(400).json({ success: false, error: 'Blogger Blog ID is missing. Please set it in Settings.' });
  }

  try {
    let accessToken = settings.accessToken || DEFAULT_BLOGGER_ACCESS_TOKEN;

    // Refresh token flow
    if (!accessToken) {
      const clientId = settings.clientId || DEFAULT_BLOGGER_CLIENT_ID;
      const clientSecret = settings.clientSecret || DEFAULT_BLOGGER_CLIENT_SECRET;
      const refreshToken = settings.refreshToken || DEFAULT_BLOGGER_REFRESH_TOKEN;

      if (!clientId || !clientSecret || !refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'No Blogger access token or OAuth refresh credentials found. Please add an Access Token or OAuth Client Credentials in Settings.',
        });
      }
      accessToken = await refreshBloggerToken(clientId, clientSecret, refreshToken);
    }

    // Build full HTML content: featured image + body + meta description note
    let fullContent = article.htmlContent || '';
    if (article.imageUrl) {
      const imageHtml = `<div class="separator" style="clear: both; text-align: center; margin: 1.5rem 0 2rem 0;"><a href="${article.imageUrl}" style="margin-left: 1em; margin-right: 1em;" target="_blank"><img border="0" data-original-height="800" data-original-width="1200" src="${article.imageUrl}" alt="${article.title.replace(/"/g, '&quot;')}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); object-fit: cover; max-height: 480px; width: 100%;" /></a></div>`;
      fullContent = imageHtml + fullContent;
    }

    const labels = [...(article.tags || [])];
    if (article.sindhBoardMeta) {
      labels.push(`Class ${article.sindhBoardMeta.classLevel}`);
      labels.push(article.sindhBoardMeta.subject);
      labels.push('Sindh Board');
    }

    const result = await publishToBlogger(
      blogId,
      accessToken,
      article.title,
      fullContent,
      labels.slice(0, 20),
      Boolean(isDraft)
    );

    res.json({
      success: true,
      url: result.url,
      id: result.id,
      message: isDraft ? 'Post saved as draft on Blogger.' : 'Post published live on Blogger!',
    });
  } catch (error: any) {
    console.error('Publish error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to publish to Blogger' });
  }
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: GEMINI_MODEL, geminiConfigured: Boolean(GEMINI_API_KEY) });
});

app.listen(PORT, () => {
  console.log(`Shizcon Education Studio server running on http://localhost:${PORT}`);
  console.log(`Gemini model: ${GEMINI_MODEL} | Configured: ${Boolean(GEMINI_API_KEY)}`);
});
