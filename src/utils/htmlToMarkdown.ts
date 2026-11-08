/**
 * Converts standard HTML post markup into clean GitHub-flavored Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  let md = html;

  // Normalize line breaks
  md = md.replace(/\r\n/g, '\n');

  // Code blocks: <pre><code class="language-xyz">...</code></pre>
  md = md.replace(/<pre><code(?:\s+class=["']language-([a-zA-Z0-9_-]+)["'])?>([\s\S]*?)<\/code><\/pre>/gi, (_, lang, code) => {
    const language = lang || '';
    const unescapedCode = decodeHtmlEntities(code.trim());
    return `\n\n\`\`\`${language}\n${unescapedCode}\n\`\`\`\n\n`;
  });

  // Generic pre tags without code
  md = md.replace(/<pre>([\s\S]*?)<\/pre>/gi, (_, code) => {
    return `\n\n\`\`\`\n${decodeHtmlEntities(code.trim())}\n\`\`\`\n\n`;
  });

  // Inline code: <code>...</code>
  md = md.replace(/<code>(.*?)<\/code>/gi, (_, code) => `\`${decodeHtmlEntities(code)}\``);

  // Headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n\n#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n\n##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n\n###### $1\n\n');

  // Blockquotes: <blockquote[^>]*>...</blockquote>
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    // Clean inner paragraphs/tags
    const inner = content
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '**$1**\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<[^>]+>/g, '')
      .trim();

    const quoted = inner
      .split('\n')
      .map((line: string) => `> ${line.trim()}`)
      .join('\n');
    return `\n\n${quoted}\n\n`;
  });

  // Unordered list items: <li>...</li>
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, (_, item) => `- ${item.trim()}\n`);
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<ul[^>]*>/gi, '\n');
  md = md.replace(/<\/ol>/gi, '\n');
  md = md.replace(/<ol[^>]*>/gi, '\n');

  // Strong / Bold
  md = md.replace(/<(?:strong|b)>(.*?)<\/(?:strong|b)>/gi, '**$1**');

  // Emphasis / Italic
  md = md.replace(/<(?:em|i)>(.*?)<\/(?:em|i)>/gi, '*$1*');

  // Links: <a href="...">...</a>
  md = md.replace(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, '\n\n---\n\n');

  // Paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n\n$1\n\n');

  // Images: <img ... src="..." alt="..." />
  md = md.replace(/<img\s+[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '\n\n![$2]($1)\n\n');
  md = md.replace(/<img\s+[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '\n\n![]($1)\n\n');

  // Strip any remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode standard HTML entities
  md = decodeHtmlEntities(md);

  // Normalize excessive blank lines (max 2 consecutive newlines)
  md = md.replace(/\n{3,}/g, '\n\n').trim();

  return md;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * Builds a complete Markdown document from a generated article
 */
export function generateArticleMarkdown(article: {
  title: string;
  summary: string;
  seoMetaDescription?: string;
  htmlContent: string;
  labels: string[];
  angle: string;
  createdAt: string;
  model?: string;
}): string {
  const bodyMarkdown = htmlToMarkdown(article.htmlContent);
  const formattedDate = new Date(article.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const seoDesc = (article.seoMetaDescription || article.summary || '').trim();

  return `---
title: "${article.title.replace(/"/g, '\\"')}"
description: "${seoDesc.replace(/"/g, '\\"')}"
seo_meta_description: "${seoDesc.replace(/"/g, '\\"')}"
date: "${formattedDate}"
labels: [${article.labels.map((l) => `"${l}"`).join(', ')}]
angle: "${article.angle.replace(/"/g, '\\"')}"
model: "${article.model || 'gemini-3.8-flash'}"
---

# ${article.title}

> **SEO Description (160 Chars):** ${seoDesc}

**Date:** ${formattedDate} | **Labels:** ${article.labels.map((l) => `\`#${l}\``).join(' ')}

---

${bodyMarkdown}
`;
}
