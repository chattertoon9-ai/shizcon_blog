/**
 * Content Formatter: Handles Math/Chemical Formulas, Table of Contents, and JSON sanitization
 */

/**
 * Sanitizes unescaped backslashes in raw JSON strings produced by LLMs
 * (e.g. \text, \times, \frac, \sqrt, \pm) which otherwise crash JSON.parse
 */
export function sanitizeJsonWithLatex(rawText: string): string {
  if (!rawText) return '{}';

  // Remove markdown code fences if present
  let cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();

  // Fix unescaped backslashes inside JSON strings that are not valid JSON escape sequences
  // Valid JSON escape sequences are: \", \\, \/, \b, \f, \n, \r, \t, \uXXXX
  // Replace invalid single backslashes like \text, \times, \alpha with double backslashes \\text
  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    // Escape solitary backslashes that aren't valid JSON escape sequences
    const sanitized = cleaned.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
    return sanitized;
  }
}

/**
 * Converts LaTeX-style math and chemical expressions ($$...$$ and $...$) into
 * beautifully styled HTML formula blocks that render flawlessly in Google Blogger.
 * Specifically resolves expressions like:
 * $$\text{Molecular Formula} = n \times \text{Empirical Formula}$$
 */
export function renderMathFormulas(html: string): string {
  if (!html) return '';

  let output = html;

  // Process block math: $$...$$
  output = output.replace(/\$\$([\s\S]*?)\$\$/g, (_, equation) => {
    const formattedEquation = formatMathExpression(equation.trim());
    return `<div class="math-formula-box" style="background: #f1f5f9; border: 1px solid #cbd5e1; border-left: 4px solid #0284c7; border-radius: 8px; padding: 0.85rem 1.25rem; margin: 1.25rem 0; font-family: 'JetBrains Mono', monospace; font-size: 1.05rem; color: #0f172a; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.04); overflow-x: auto;">
  <span style="display: inline-block; font-weight: 600;">${formattedEquation}</span>
</div>`;
  });

  // Process inline math: $...$ (avoiding currency amounts like $50 or $100)
  output = output.replace(/(?<!\\)\$([^\$\n]+?)\$(?!\$)/g, (match, equation) => {
    // If it looks like plain currency (e.g. $50 or $100), leave untouched
    if (/^\d+(?:\.\d+)?(?:\s*(?:million|billion|thousand|USD|k))?$/i.test(equation.trim())) {
      return match;
    }
    const formattedEquation = formatMathExpression(equation.trim());
    return `<span class="inline-math-formula" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.15rem 0.4rem; font-family: 'JetBrains Mono', monospace; font-size: 0.95em; color: #0369a1; font-weight: 500;">${formattedEquation}</span>`;
  });

  return output;
}

/**
 * Internal helper to convert common LaTeX tokens to clean HTML/Unicode
 */
function formatMathExpression(eq: string): string {
  let res = eq;

  // \text{...} or \mathrm{...} -> <strong>...</strong>
  res = res.replace(/\\(?:text|mathrm|textbf)\{([^}]*)\}/g, '<strong>$1</strong>');

  // \times -> &times; (×)
  res = res.replace(/\\times/g, '&times;');

  // \cdot -> &bull; (•)
  res = res.replace(/\\cdot/g, '&bull;');

  // \div -> &divide; (÷)
  res = res.replace(/\\div/g, '&divide;');

  // \pm -> &plusmn; (±)
  res = res.replace(/\\pm/g, '&plusmn;');

  // \approx -> &approx; (≈)
  res = res.replace(/\\approx/g, '&approx;');

  // \neq -> &ne; (≠)
  res = res.replace(/\\neq/g, '&ne;');

  // \leq -> &le; (≤), \geq -> &ge; (≥)
  res = res.replace(/\\leq/g, '&le;');
  res = res.replace(/\\geq/g, '&ge;');

  // \rightarrow / \to -> &rarr; (→)
  res = res.replace(/\\(?:rightarrow|to)/g, '&rarr;');

  // \Delta -> &Delta; (Δ)
  res = res.replace(/\\Delta/g, '&Delta;');

  // \pi -> &pi; (π)
  res = res.replace(/\\pi/g, '&pi;');

  // \alpha, \beta, \gamma, \theta, \lambda
  res = res.replace(/\\alpha/g, '&alpha;');
  res = res.replace(/\\beta/g, '&beta;');
  res = res.replace(/\\gamma/g, '&gamma;');
  res = res.replace(/\\theta/g, '&theta;');
  res = res.replace(/\\lambda/g, '&lambda;');

  // Fractions: \frac{a}{b} -> (a / b)
  res = res.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1 / $2)');

  // Square roots: \sqrt{...} -> &radic;(...)
  res = res.replace(/\\sqrt\{([^}]*)\}/g, '&radic;($1)');

  // Subscripts: _{...} or _x -> <sub>...</sub>
  res = res.replace(/_\{([^}]*)\}/g, '<sub>$1</sub>');
  res = res.replace(/_([a-zA-Z0-9])/g, '<sub>$1</sub>');

  // Superscripts: ^{...} or ^x -> <sup>...</sup>
  res = res.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>');
  res = res.replace(/\^([a-zA-Z0-9])/g, '<sup>$1</sup>');

  // Strip any remaining unhandled LaTeX backslash words
  res = res.replace(/\\[a-zA-Z]+/g, '');

  return res;
}

/**
 * Automatically inspects the HTML content for headings (<h2> and <h3>),
 * ensures they have anchor IDs, and prepends or generates a beautiful Table of Contents.
 */
export function injectTableOfContents(html: string): string {
  if (!html) return html;

  // If a table of contents is already embedded by the model, return it
  if (html.includes('table-of-contents') || html.includes('id="table-of-contents"')) {
    return html;
  }

  interface HeadingItem {
    level: number;
    text: string;
    id: string;
  }

  const headings: HeadingItem[] = [];
  let headingCount = 0;

  // Replace each <h2> and <h3> with one that has a unique id
  const updatedHtml = html.replace(/<(h[23])(\s+[^>]*)?>(.*?)<\/\1>/gi, (match, tag, attrs = '', innerText) => {
    // Strip inner HTML tags from heading text for anchor and TOC label
    const plainTitle = innerText.replace(/<[^>]+>/g, '').trim();
    if (!plainTitle) return match;

    headingCount++;
    const slug = plainTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `section-${headingCount}`;

    const id = `toc-${headingCount}-${slug.slice(0, 40)}`;
    const level = tag.toLowerCase() === 'h2' ? 2 : 3;

    headings.push({ level, text: plainTitle, id });

    // Ensure we don't duplicate id attribute
    const cleanedAttrs = attrs.replace(/\s*id=["'][^"']*["']/i, '');
    return `<${tag}${cleanedAttrs} id="${id}">${innerText}</${tag}>`;
  });

  // If fewer than 2 headings exist, a TOC isn't necessary
  if (headings.length < 2) {
    return updatedHtml;
  }

  // Construct styled Table of Contents HTML
  const tocList = headings
    .map((h) => {
      const paddingLeft = h.level === 3 ? '1.5rem' : '0.5rem';
      const bulletStyle = h.level === 3 ? '◦' : '▸';
      const fontWeight = h.level === 2 ? '600' : '400';
      const fontSize = h.level === 2 ? '0.92rem' : '0.86rem';
      const color = h.level === 2 ? '#1e40af' : '#475569';

      return `<li style="margin-bottom: 0.45rem; padding-left: ${paddingLeft}; list-style: none;">
  <a href="#${h.id}" style="color: ${color}; text-decoration: none; font-weight: ${fontWeight}; font-size: ${fontSize}; display: inline-flex; align-items: baseline; gap: 0.4rem; transition: color 0.15s ease;" onmouseover="this.style.color='#0284c7'; this.style.textDecoration='underline';" onmouseout="this.style.color='${color}'; this.style.textDecoration='none';">
    <span style="color: #3b82f6; font-size: 0.85em;">${bulletStyle}</span>
    <span>${h.text}</span>
  </a>
</li>`;
    })
    .join('\n');

  const tocBox = `<div class="table-of-contents" style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 1.15rem 1.4rem; margin: 1.75rem 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
  <div style="font-weight: 700; font-size: 1.05rem; color: #0f172a; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.4rem;">
    <span style="font-size: 1.15rem;">📑</span>
    <span>Table of Contents</span>
  </div>
  <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0; margin-top: 0.5rem;">
${tocList}
  </ul>
</div>`;

  // Insert TOC after the featured image or after the first introductory paragraph
  if (updatedHtml.includes('</div>\n<p>')) {
    // There is an image separator container followed by a paragraph
    return updatedHtml.replace(/(<\/div>\s*<p>[\s\S]*?<\/p>)/i, `$1\n${tocBox}`);
  } else if (updatedHtml.includes('</p>')) {
    // Insert right after the first paragraph
    return updatedHtml.replace(/(<p>[\s\S]*?<\/p>)/i, `$1\n${tocBox}`);
  }

  // Fallback: prepend TOC
  return `${tocBox}\n${updatedHtml}`;
}
