export function markdownToHtml(md: string): string {
  // Very small, safe-ish markdown -> HTML converter for basic content.
  // Supports headings (#...), unordered lists, paragraphs, simple code fences and inline code.
  if (!md) return '';

  // Normalize line endings
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let inList = false;
  let inCode = false;
  let codeBuf: string[] = [];

  const flushParagraph = (p: string) => {
    if (!p) return;
    out.push(`<p>${p}</p>`);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeBuf = [];
      } else {
        // close code
        inCode = false;
        out.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
      }
      continue;
    }

    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    if (line.startsWith('#')) {
      const m = line.match(/^(#+)\s*(.*)$/);
      if (m) {
        const level = Math.min(6, m[1].length);
        out.push(`<h${level}>${escapeHtml(inlineFormatting(m[2]))}</h${level}>`);
        continue;
      }
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      if (!inList) {
        inList = true;
        out.push('<ul>');
      }
      const item = line.replace(/^\s*[-*+]\s+/, '');
      out.push(`<li>${escapeHtml(inlineFormatting(item))}</li>`);
      // lookahead to close list on next non-list
      const next = lines[i + 1] || '';
      if (!/^\s*[-*+]\s+/.test(next)) {
        out.push('</ul>');
        inList = false;
      }
      continue;
    }

    if (line.trim() === '') {
      // blank line
      out.push('');
      continue;
    }

    // paragraph line
    out.push(`<p>${escapeHtml(inlineFormatting(line))}</p>`);
  }

  return out.join('\n');
}

function inlineFormatting(text: string): string {
  // Inline code
  text = text.replace(/`([^`]+)`/g, (_m, g1) => `<code>${escapeHtml(g1)}</code>`);
  // bold **text**
  text = text.replace(/\*\*([^\*]+)\*\*/g, (_m, g1) => `<strong>${escapeHtml(g1)}</strong>`);
  // italic *text*
  text = text.replace(/\*([^\*]+)\*/g, (_m, g1) => `<em>${escapeHtml(g1)}</em>`);
  return text;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default markdownToHtml;
