import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { getFeaturedImageUrl, formatBloggerImageHtml } from './src/utils/imageHelper.ts';
import { sanitizeJsonWithLatex, renderMathFormulas, injectTableOfContents } from './src/utils/contentFormatter.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenerateRequest {
  angle: string;
  tone?: string;
  targetWordCount?: number;
  includeKeyTakeaways?: boolean;
  includeCodeExample?: boolean;
  customPromptExtra?: string;
  maxRetries?: number;
  backoffFactor?: number;
}

interface AttemptLog {
  attempt: number;
  timestamp: string;
  status: 'started' | 'success' | 'failed' | 'retry_wait';
  message: string;
  durationMs?: number;
  sleepTimeSeconds?: number;
}

// Helper to delay execution
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to exchange refresh token for access token
async function getAccessTokenFromRefreshToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OAuth token exchange failed (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

// API: System Configuration Status
app.get('/api/config', (req, res) => {
  res.json({
    hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    envBlogId: process.env.BLOG_ID ? process.env.BLOG_ID : null,
    hasOAuthCreds: Boolean(
      process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.REFRESH_TOKEN
    ),
    defaultModel: 'gemini-3.8-flash',
  });
});

// API: Generate News Post with smart retry and exponential backoff
app.post('/api/generate-news', async (req, res) => {
  const {
    angle = '10 Actionable Daily Health Habits That Supercharge Cellular Energy, Mental Clarity, and Immunity',
    category = 'sindh_board',
    tone = 'educational',
    targetWordCount = 900,
    includeKeyTakeaways = true,
    includeCodeExample = false,
    includeHealthDisclaimer = true,
    includeImages = true,
    includeTableOfContents = true,
    seoMetaDescription: userProvidedSeoDescription,
    imageUrl: userProvidedImageUrl,
    sindhBoardConfig,
    newsConfig,
    customPromptExtra = '',
    maxRetries = 5,
    backoffFactor = 4,
  } = req.body as any;

  const modelName = 'gemini-3.8-flash';
  const logs: AttemptLog[] = [];
  const startTime = Date.now();

  const isNews =
    category === 'news' ||
    Boolean(newsConfig) ||
    /dawn|thenews|the news|aaj news|aaj tv|ktn|sindh tv|kawish|awami awaz|geo news|ary news|express news|al jazeera|bulletin|breaking news|نیوز|خبرون|الأخبار/i.test(
      angle
    );

  const isSindhBoard =
    !isNews &&
    (category === 'sindh_board' ||
      Boolean(sindhBoardConfig) ||
      /sindh|stbb|jamshoro|karachi board|bsek|biek|class\s*(?:[1-9]|1[0-2])|matric|intermediate|fsc|inter|pre-medical|pre-engineering/i.test(
        angle
      ));

  const isHealthTopic =
    !isNews &&
    !isSindhBoard &&
    (category === 'health' ||
      /health|wellness|nutrition|diet|sleep|fitness|medical|disease|symptom|doctor|mental|stress|anxiety|gut|cardio|immunity|metabolism|ergonomics|habit|hypertension|diabetes|fatigue|hormone/i.test(
        angle
      ));

  const newsOutlet = newsConfig?.outlet || (/dawn/i.test(angle) ? 'Dawn News' : /the news/i.test(angle) ? 'The News International' : /aaj/i.test(angle) ? 'Aaj News' : /ktn|sindh tv|kawish|awami|سنڌ/i.test(angle) ? 'Sindhi Channel News (KTN / Sindh TV / Kawish)' : /arabic|al jazeera|العربية|الجزيرة/i.test(angle) ? 'Al Jazeera / Arabic News' : 'News Desk Wire');
  const newsLanguage = newsConfig?.language || (/sindhi|سنڌي/i.test(angle) ? 'Sindhi' : /urdu|اردو/i.test(angle) ? 'Urdu' : /arabic|عربي|العربية/i.test(angle) ? 'Arabic' : 'English');
  const isRTL = newsLanguage === 'Urdu' || newsLanguage === 'Sindhi' || newsLanguage === 'Arabic';

  const addLog = (log: Omit<AttemptLog, 'timestamp'>) => {
    logs.push({
      ...log,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const domainLabel = isNews
    ? `News (${newsOutlet} • ${newsLanguage})`
    : isSindhBoard
    ? 'Sindh Board (STBB Class 1-12) Education'
    : isHealthTopic
    ? 'Health & Wellness'
    : 'Tech & Software';

  addLog({
    attempt: 1,
    status: 'started',
    message: `Initiating article generation with model: ${modelName} (${domainLabel}) for: "${angle.slice(0, 70)}${angle.length > 70 ? '...' : ''}"`,
  });

  let rawGeneratedText: string | null = null;
  let successfulAttempt = 0;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const attemptStart = Date.now();
    try {
      addLog({
        attempt,
        status: 'started',
        message: `Attempt ${attempt}/${maxRetries}: Querying ${modelName}...`,
      });

      let personaPrompt = '';
      let specificRequirements = '';

      if (isNews) {
        personaPrompt = `You are an acclaimed senior journalist, special correspondent, and news desk editor at ${newsOutlet}.
Your assignment is to write a comprehensive, timely, verified, and high-impact news story or analysis formatted for Google Blogger.
Reporting Language: ${newsLanguage} (${isRTL ? 'Right-to-Left RTL script' : 'English'}).`;

        specificRequirements = `- Structure for ${newsOutlet} News Report (${newsLanguage}):
  1. Journalistic Headline: Clear, urgent, and accurate news headline in ${newsLanguage} without quotation marks.
  2. News Dateline: Open the first paragraph with an authentic news bureau dateline in ${newsLanguage} (e.g. ${
    newsLanguage === 'Urdu' ? '"اسلام آباد / کراچی (نیوز ڈیسک) —"' :
    newsLanguage === 'Sindhi' ? '"ڪراچي / حيدرآباد (خاص نمائندو / نيوز ڊيسڪ) —"' :
    newsLanguage === 'Arabic' ? '"إسلام آباد / الرياض (غرفة الأخبار) —"' :
    '"ISLAMABAD / KARACHI (News Desk) —"'
  }).
  3. Lead Paragraph: Crisp inverted pyramid format answering Who, What, When, Where, Why, and How.
  4. Story Body: Subheadings with <h2> and <h3>, key details, official statements, quotes, or ministerial announcements.
  5. Context & Significance: Background context, public impact, and economic or regional implications.
  6. Highlights Callout: "Key Highlights / اہم نکات / اهم نقطا / أبرز النقاط" box inside <blockquote>.
  7. Forward Outlook: Upcoming cabinet/court proceedings, inquiry details, or public reaction.
  ${isRTL ? `- CRITICAL RTL STYLING: Wrap the entire article body in <div dir="rtl" style="direction: rtl; text-align: right; font-family: 'Noto Nastaliq Urdu', 'Noto Naskh Arabic', Arial, sans-serif; line-height: 2;">...</div> so that ${newsLanguage} script renders natively with correct alignment and spacing.` : ''}
  - Write entirely, naturally, and fluently in ${newsLanguage}.`;
      } else if (isSindhBoard) {
        const cls = sindhBoardConfig?.classLevel ? `Class ${sindhBoardConfig.classLevel}` : 'Sindh Board';
        const subj = sindhBoardConfig?.subject || 'Subject';
        const cType = sindhBoardConfig?.contentType || 'Comprehensive Notes & Solved Exercises';
        const med = sindhBoardConfig?.medium || 'English';

        personaPrompt = `You are an acclaimed educational author, curriculum specialist, and senior paper setter for the Sindh Textbook Board (STBB Jamshoro / BSEK Karachi / BIEK Karachi and all Sindh Boards).
Your objective is to produce comprehensive, accurate, high-scoring, and syllabus-aligned educational content for students and teachers publishing on Google Blogger.
Target: ${cls} - ${subj} (${med} Medium).`;

        specificRequirements = `- Structure for Sindh Board Education Content:
  1. Catchy, SEO-optimized Title format: "[Class & Subject]: [Chapter / Topic Name] Complete Notes, Solved Questions & Book Summary - Sindh Board STBB".
  2. Student Overview: Introduction to the chapter, board exam weightage, and core learning competencies.
  3. Detailed Conceptual Theory: In-depth explanations, formulas, scientific laws, definitions, or literary summaries using <h2> and <h3> subheadings.
  4. Solved Textbook Exercise Questions:
     - Short Answer Questions (مختصر سوالات) with point-to-point answers.
     - Long Descriptive Questions (تفصیلی سوالات) with derivations, principles, or detailed explanations.
  5. Solved Numerical Problems (if Physics, Chemistry, Math, Commerce) with clear step-by-step working and units.
  6. High-Yield Multiple Choice Questions (MCQs) with correct answers and brief explanations.
  7. "Board Exam Preparation Tips & FAQs" highlighted box inside <blockquote>.
  8. Textbook Summary & PDF study guidelines.
  ${med === 'Urdu' ? '- Write primarily in clear, beautiful Urdu with English technical terms in brackets.' : ''}
  ${med === 'Sindhi' ? '- Write in clear, authentic Sindhi with English technical terms in brackets.' : ''}`;
      } else if (isHealthTopic) {
        personaPrompt = `You are an acclaimed health, wellness, and medical science journalist for BytePulse Health & Wellness. Your mission is to provide evidence-based, empathetic, actionable, and engaging health articles, daily wellness tips, and clear breakdowns of common health issues for Google Blogger readers.`;

        specificRequirements = `- Structure for Health Content:
  1. Catchy, trustworthy, and engaging headline that inspires positive action without fear-mongering.
  2. Engaging introduction explaining the significance of this health issue or wellness goal today.
  3. Root causes, physiological explanations, or mechanisms explained in accessible, clear language using <h2> and <h3> subheadings.
  4. "Actionable Health Tips": 3 to 5 realistic, evidence-backed lifestyle, dietary, or daily routine recommendations.
  5. Warning signs, symptoms, or indicators to be mindful of.
  ${includeKeyTakeaways ? '6. "Key Health Takeaways & Quick Action Plan" highlight box inside <blockquote>.' : ''}
  ${includeHealthDisclaimer ? '7. A standard medical disclaimer callout at the end: "<em>Disclaimer: This article is for informational purposes only and is not medical advice. Always consult a qualified healthcare professional with any questions regarding health conditions.</em>"' : ''}`;
      } else {
        personaPrompt = `You are a premier tech and software engineering journalist for BytePulse, creating engaging, authoritative, and well-structured news and instructional posts for Google Blogger.`;

        specificRequirements = `- Structure for Tech Content:
  1. Catchy, engaging title (punchy and SEO-friendly).
  2. Short hook / intro paragraph summarizing why this matters today.
  3. Key sections with subheadings (use standard <h2> and <h3> tags).
  ${includeKeyTakeaways ? '4. "Key Takeaways" bullet points highlight box.' : ''}
  ${includeCodeExample ? '5. Practical code snippet or architectural diagram description with explanation inside <pre><code>.' : ''}
  6. Forward-looking conclusion / call to action.`;
      }

      const prompt = `${personaPrompt}

Topic / Angle:
"${angle}"

Style and Requirements:
- Tone: ${tone} (crisp, authoritative, student/reader friendly, and highly engaging).
- Target length: approximately ${targetWordCount} words.
${specificRequirements}
- Format the content in clean HTML suitable for direct Google Blogger publishing:
  - Wrap paragraphs in <p> tags.
  - Subheadings in <h2> or <h3> (include id="section-name" attributes for anchor navigation).
  ${includeTableOfContents ? '- Table of Contents: Include a styled Table of Contents box (<div class="table-of-contents">...</div>) near the beginning linking to each section with matching anchor IDs.' : ''}
  - Highlighted callouts inside <blockquote> tags.
  - Lists inside <ul><li>...</li></ul> or <ol><li>...</li></ol>.
  - Tables for comparisons/formulas if helpful: <table border="1">...</table>.
  - Mathematical & Chemical Formulas (CRITICAL): Never output raw LaTeX syntax with unescaped backslashes (such as $$\\text{...}$$ or \\times). Instead, format all equations and formulas (e.g. Molecular Formula = n × Empirical Formula, Hooke’s Law, etc.) using clean HTML: <div class="math-formula-box"><strong>Molecular Formula</strong> = <em>n</em> &times; <strong>(Empirical Formula)</strong></div>. Use HTML entities (&times;, &divide;, &plusmn;, &radic;, &rarr;) and tags (<sub>, <sup>) for subscripts and superscripts so they render cleanly in Google Blogger.
  - SEO Meta Description (CRITICAL): Automatically generate an optimized 140-160 character SEO description (maximum 160 characters) that directly follows and complements the title. It must summarize the post with high-intent keywords, create a high click-through rate hook, and fit perfectly in search engine snippets and social meta tags.
  ${userProvidedSeoDescription ? `- Custom user SEO focus/keywords: "${userProvidedSeoDescription}". Incorporate this into the SEO description.` : ''}
  - Do NOT wrap the whole response in a markdown codeblock (\`\`\`html ... \`\`\`).
${customPromptExtra ? `- Additional user instruction: ${customPromptExtra}` : ''}

CRITICAL: Return the response strictly as valid JSON matching this structure:
{
  "title": "A catchy, SEO-friendly title without quotation marks",
  "seoMetaDescription": "A 140-160 character SEO description that directly follows the title with target keywords (strict max 160 chars)",
  "summary": "A 1-2 sentence meta description / summary of the post",
  "htmlContent": "The complete, rich HTML body formatted for Blogger (without outer markdown backticks)",
  "labels": ["tag1", "tag2", "tag3", "tag4"]
}`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction:
            'You are an expert technical writer and news editor for BytePulse News. Always output strictly valid JSON with title, summary, htmlContent, and labels.',
        },
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        rawGeneratedText = text;
        successfulAttempt = attempt;
        const duration = Date.now() - attemptStart;
        addLog({
          attempt,
          status: 'success',
          message: `Successfully generated content using ${modelName} in ${(duration / 1000).toFixed(2)}s`,
          durationMs: duration,
        });
        break;
      } else {
        throw new Error('Received empty text response from model.');
      }
    } catch (err: any) {
      const duration = Date.now() - attemptStart;
      const errorMsg = err?.message || String(err);
      addLog({
        attempt,
        status: 'failed',
        message: `Model ${modelName} - Attempt ${attempt} failed: ${errorMsg}`,
        durationMs: duration,
      });

      if (attempt < maxRetries) {
        const sleepTime = backoffFactor * attempt;
        addLog({
          attempt,
          status: 'retry_wait',
          message: `Backoff triggered: Waiting ${sleepTime}s before retry attempt ${attempt + 1}...`,
          sleepTimeSeconds: sleepTime,
        });
        await sleep(sleepTime * 1000);
      } else {
        addLog({
          attempt,
          status: 'failed',
          message: `Model ${modelName} reached maximum retries (${maxRetries}).`,
        });
      }
    }
  }

  if (!rawGeneratedText) {
    return res.status(503).json({
      success: false,
      error: 'Model is currently experiencing high demand or quota limits. Please try again later.',
      logs,
    });
  }

  try {
    let parsed: any;
    try {
      parsed = JSON.parse(rawGeneratedText);
    } catch {
      // Fallback: sanitize unescaped LaTeX backslashes and remove code fences
      const sanitized = sanitizeJsonWithLatex(rawGeneratedText);
      parsed = JSON.parse(sanitized);
    }

    const title = parsed.title || (isNews ? `${newsOutlet} Breaking News Update` : isSindhBoard ? 'Sindh Board Complete Notes & Solutions' : 'BytePulse Update');
    let htmlContent = parsed.htmlContent || `<p>${rawGeneratedText}</p>`;
    const summary = parsed.summary || 'Comprehensive news report and bulletin.';
    let seoMetaDescription = (parsed.seoMetaDescription || userProvidedSeoDescription || summary).trim();
    if (seoMetaDescription.length > 160) {
      seoMetaDescription = seoMetaDescription.slice(0, 157).trim() + '...';
    }
    let labels = Array.isArray(parsed.labels) ? parsed.labels : ['News', newsOutlet];

    // Resolve any LaTeX math or chemical equations into clean Blogger-compatible HTML
    htmlContent = renderMathFormulas(htmlContent);

    // Determine featured image
    let finalImageUrl = userProvidedImageUrl;
    if (!finalImageUrl && includeImages !== false) {
      finalImageUrl = getFeaturedImageUrl(
        isNews ? 'news' : isSindhBoard ? 'sindh_board' : isHealthTopic ? 'health' : 'tech',
        angle,
        sindhBoardConfig?.subject
      );
    }

    // Embed featured image at top if not already present in the HTML
    if (finalImageUrl && includeImages !== false && !htmlContent.includes('<img')) {
      const captionText = isNews
        ? `${newsOutlet} • ${newsLanguage} News Desk Report`
        : isSindhBoard
        ? `Sindh Textbook Board (STBB Jamshoro) ${sindhBoardConfig?.classLevel ? `Class ${sindhBoardConfig.classLevel}` : ''} ${sindhBoardConfig?.subject || ''}`
        : undefined;
      const imageHtml = formatBloggerImageHtml(finalImageUrl, title, captionText);
      htmlContent = `${imageHtml}\n${htmlContent}`;
    }

    // Auto-generate and inject Table of Contents if enabled
    if (includeTableOfContents !== false) {
      htmlContent = injectTableOfContents(htmlContent);
    }

    if (isNews) {
      const extraLabels = ['News', newsOutlet];
      if (newsLanguage !== 'English') extraLabels.push(newsLanguage);
      labels = Array.from(new Set([...extraLabels, ...labels]));
    } else if (isSindhBoard) {
      const extraLabels = ['Sindh Board', 'STBB Jamshoro'];
      if (sindhBoardConfig?.classLevel) extraLabels.push(`Class ${sindhBoardConfig.classLevel}`);
      if (sindhBoardConfig?.subject) extraLabels.push(sindhBoardConfig.subject);
      labels = Array.from(new Set([...extraLabels, ...labels]));
    }

    return res.json({
      success: true,
      title,
      seoMetaDescription,
      summary,
      htmlContent,
      labels,
      imageUrl: finalImageUrl,
      category: isNews ? 'news' : isSindhBoard ? 'sindh_board' : isHealthTopic ? 'health' : 'tech',
      newsMeta: isNews ? {
        outlet: newsOutlet,
        language: newsLanguage,
        newsType: newsConfig?.newsType || 'breaking',
        isRTL,
      } : undefined,
      sindhBoardMeta: isSindhBoard && sindhBoardConfig ? {
        classLevel: sindhBoardConfig.classLevel,
        subject: sindhBoardConfig.subject,
        medium: sindhBoardConfig.medium,
        contentType: sindhBoardConfig.contentType,
      } : undefined,
      logs,
      model: modelName,
      successfulAttempt,
      totalDurationMs: Date.now() - startTime,
    });
  } catch (parseError: any) {
    // If JSON parsing fails, treat the raw text as content
    const titleMatch = rawGeneratedText.match(/^#\s+(.*)$/m) || rawGeneratedText.match(/<h[12]>(.*?)<\/h[12]>/i);
    const title = titleMatch ? titleMatch[1].trim() : (isNews ? `${newsOutlet} Update` : isSindhBoard ? 'Sindh Board Notes & Solutions' : 'BytePulse Update');
    
    let fallbackHtml = `<p>${rawGeneratedText.replace(/\n\n/g, '</p><p>')}</p>`;
    fallbackHtml = renderMathFormulas(fallbackHtml);
    let fallbackImageUrl = userProvidedImageUrl || getFeaturedImageUrl(isNews ? 'news' : isSindhBoard ? 'sindh_board' : isHealthTopic ? 'health' : 'tech', angle);
    if (fallbackImageUrl && includeImages !== false && !fallbackHtml.includes('<img')) {
      fallbackHtml = `${formatBloggerImageHtml(fallbackImageUrl, title)}\n${fallbackHtml}`;
    }
    if (includeTableOfContents !== false) {
      fallbackHtml = injectTableOfContents(fallbackHtml);
    }

    let fallbackSeoDesc = (userProvidedSeoDescription || (title ? `${title.slice(0, 120)} - Complete report, updates and bulletin.` : 'Comprehensive news update and bulletin.')).trim();
    if (fallbackSeoDesc.length > 160) {
      fallbackSeoDesc = fallbackSeoDesc.slice(0, 157).trim() + '...';
    }

    return res.json({
      success: true,
      title,
      seoMetaDescription: fallbackSeoDesc,
      summary: 'Generated by BytePulse AI',
      htmlContent: fallbackHtml,
      labels: isNews ? ['News', newsOutlet, newsLanguage] : isSindhBoard ? ['Sindh Board', 'STBB', 'Education'] : ['BytePulse', 'News'],
      imageUrl: fallbackImageUrl,
      category: isNews ? 'news' : isSindhBoard ? 'sindh_board' : isHealthTopic ? 'health' : 'tech',
      newsMeta: isNews ? {
        outlet: newsOutlet,
        language: newsLanguage,
        newsType: newsConfig?.newsType || 'breaking',
        isRTL,
      } : undefined,
      logs,
      model: modelName,
      successfulAttempt,
      totalDurationMs: Date.now() - startTime,
    });
  }
});

// API: Publish to Google Blogger
app.post('/api/publish-blogger', async (req, res) => {
  const {
    blogId = process.env.BLOG_ID,
    title,
    content,
    labels = [],
    isDraft = false,
    accessToken: clientAccessToken,
    refreshToken = process.env.REFRESH_TOKEN,
    clientId = process.env.CLIENT_ID,
    clientSecret = process.env.CLIENT_SECRET,
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      error: 'Title and content are required for publishing.',
    });
  }

  const targetBlogId = blogId || process.env.BLOG_ID;

  // Attempt to acquire an OAuth access token
  let effectiveToken = clientAccessToken;

  try {
    if (!effectiveToken && refreshToken && clientId && clientSecret) {
      effectiveToken = await getAccessTokenFromRefreshToken(clientId, clientSecret, refreshToken);
    }

    // If an effective access token and targetBlogId exist, make the real Blogger API call
    if (effectiveToken && targetBlogId) {
      const url = new URL(`https://www.googleapis.com/blogger/v3/blogs/${targetBlogId}/posts`);
      if (isDraft) {
        url.searchParams.set('isDraft', 'true');
      }

      const bodyPayload = {
        kind: 'blogger#post',
        title,
        content,
        labels: Array.isArray(labels) ? labels : [],
      };

      const bloggerResponse = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!bloggerResponse.ok) {
        const errorText = await bloggerResponse.text();
        return res.status(bloggerResponse.status).json({
          success: false,
          error: `Google Blogger API error (${bloggerResponse.status}): ${errorText}`,
          liveApiAttempted: true,
        });
      }

      const bloggerResult = (await bloggerResponse.json()) as any;
      return res.json({
        success: true,
        isSandbox: false,
        url: bloggerResult.url,
        postId: bloggerResult.id,
        title: bloggerResult.title,
        published: bloggerResult.published,
        status: isDraft ? 'DRAFT' : 'LIVE',
        message: isDraft
          ? 'Draft successfully saved to Google Blogger!'
          : 'Post published successfully to Google Blogger!',
      });
    }

    // If no live credentials are provided or user is testing, provide a clean simulated Blogger publish response
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const simulatedBlog = targetBlogId ? `blog-${targetBlogId}` : 'bytepulse-updates';
    const simulatedUrl = `https://${simulatedBlog}.blogspot.com/${new Date().getFullYear()}/${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}/${slug}.html`;

    return res.json({
      success: true,
      isSandbox: true,
      url: simulatedUrl,
      postId: 'sim-' + Date.now().toString(),
      title,
      status: isDraft ? 'DRAFT (Simulated)' : 'PUBLISHED (Simulated)',
      message: `Verified Blogger payload formatted successfully! To send directly to your live Blogger blog, provide your BLOG_ID and Google OAuth token in Settings or environment variables.`,
      previewPayload: {
        blogId: targetBlogId || 'NOT_SET',
        isDraft,
        title,
        labels,
        contentLength: content.length,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `Failed to publish to Blogger: ${err?.message || String(err)}`,
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BytePulse Studio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
