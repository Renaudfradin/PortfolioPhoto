/**
 * Allowlist HTML sanitizer (no extra dependency).
 * Strips scripts/handlers/dangerous URIs and unknown tags.
 */

const ALLOWED_TAGS = new Set([
  'a',
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'p',
  'br',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'code',
  'pre',
  'span',
  'div',
  'img',
  'figure',
  'figcaption',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height', 'title']),
  '*': new Set(['class']),
};

const VOID_TAGS = new Set(['br', 'hr', 'img']);

function isSafeUrl(value: string): boolean {
  const trimmed = value.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('data:text/html')
  ) {
    return false;
  }
  // Allow http(s), relative, mailto, and common image data URIs
  if (trimmed.startsWith('data:image/')) return true;
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../')
  ) {
    return true;
  }
  // Relative paths without scheme
  return !/^[a-z][a-z0-9+.-]*:/i.test(trimmed);
}

function sanitizeAttributes(tag: string, rawAttrs: string): string {
  const allowed = new Set([
    ...(ALLOWED_ATTRS['*'] ?? []),
    ...(ALLOWED_ATTRS[tag] ?? []),
  ]);
  if (allowed.size === 0) return '';

  const parts: string[] = [];
  const attrRe =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match: RegExpExecArray | null;

  while ((match = attrRe.exec(rawAttrs)) !== null) {
    const name = match[1].toLowerCase();
    if (name.startsWith('on')) continue;
    if (!allowed.has(name)) continue;

    const value = match[2] ?? match[3] ?? match[4] ?? '';
    if ((name === 'href' || name === 'src') && !isSafeUrl(value)) continue;

    // Force safe link behavior
    if (tag === 'a' && name === 'target' && value === '_blank') {
      parts.push('target="_blank"', 'rel="noopener noreferrer"');
      continue;
    }

    const escaped = value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    parts.push(`${name}="${escaped}"`);
  }

  return parts.length ? ` ${[...new Set(parts)].join(' ')}` : '';
}

export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Drop whole dangerous blocks first
  let input = html
    .replace(/<(script|style|iframe|object|embed|form|link|meta|base|svg|math)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed|form|link|meta|base|svg|math)[^>]*\/?>/gi, '');

  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;

  return input.replace(tagRe, (full, rawName: string, rawAttrs: string) => {
    const name = rawName.toLowerCase();
    const isClosing = full.startsWith('</');

    if (!ALLOWED_TAGS.has(name)) {
      return '';
    }

    if (isClosing) {
      return VOID_TAGS.has(name) ? '' : `</${name}>`;
    }

    const attrs = sanitizeAttributes(name, rawAttrs ?? '');
    if (VOID_TAGS.has(name)) {
      return `<${name}${attrs} />`;
    }
    return `<${name}${attrs}>`;
  });
}
