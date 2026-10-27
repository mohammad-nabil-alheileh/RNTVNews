import {
  ArticleBlock,
  ArticleImageBlock,
  ArticleTextKind,
} from '../../types/story';

const CODE_CHUNK_LINES = 12;
const LINE_BREAK = '\u0000';

const BLOCK =
  /<(h[1-6]|p|li|blockquote|pre|tr)\b[^>]*>([\s\S]*?)<\/\1>|(<img\b[^>]*>)/gi;
const IMAGE = /<img\b[^>]*>/gi;
const SKIPPED_IMAGE = /assets\.dev\.to\/assets\/|avatar|icon/i;
const REMOVED = [
  /<!--[\s\S]*?-->/g,
  /<(script|style|svg|iframe)\b[\s\S]*?<\/\1>/gi,
];

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code[0] === '#') {
      const isHex = code[1] === 'x' || code[1] === 'X';
      const value = parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : entity;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
  });
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

function inlineText(html: string): string {
  const text = stripTags(html.replace(/<br\s*\/?>/gi, LINE_BREAK));
  return decodeEntities(text)
    .replace(/\s+/g, ' ')
    .split(LINE_BREAK)
    .map(line => line.trim())
    .join('\n')
    .trim();
}

function codeChunks(html: string): string[] {
  const lines = decodeEntities(stripTags(html)).replace(/\s+$/, '').split('\n');
  const chunks: string[] = [];
  for (let start = 0; start < lines.length; start += CODE_CHUNK_LINES) {
    chunks.push(lines.slice(start, start + CODE_CHUNK_LINES).join('\n'));
  }
  return chunks.filter(chunk => chunk.trim() !== '');
}

function quoteParagraphs(html: string): string[] {
  const paragraphs = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) ?? [html];
  return paragraphs.map(inlineText).filter(Boolean);
}

function rowText(html: string): string {
  const cells = html.match(/<t[hd]\b[^>]*>[\s\S]*?<\/t[hd]>/gi) ?? [];
  return cells.map(inlineText).filter(Boolean).join(' · ');
}

function attribute(tag: string, name: string): string {
  const match = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function imageBlock(tag: string): ArticleImageBlock | null {
  const url = attribute(tag, 'src');
  if (!/^https:\/\//.test(url) || SKIPPED_IMAGE.test(tag)) {
    return null;
  }
  const width = parseInt(attribute(tag, 'width'), 10);
  const height = parseInt(attribute(tag, 'height'), 10);
  return {
    kind: 'image',
    url,
    alt: attribute(tag, 'alt'),
    aspectRatio: width > 0 && height > 0 ? width / height : null,
  };
}

function pushImages(html: string, blocks: ArticleBlock[]) {
  for (const [tag] of html.matchAll(IMAGE)) {
    const image = imageBlock(tag);
    if (image) {
      blocks.push(image);
    }
  }
}

function kindOf(tag: string): ArticleTextKind {
  if (tag[0] === 'h') {
    return 'heading';
  }
  if (tag === 'li') {
    return 'listItem';
  }
  return 'paragraph';
}

export function parseArticleBody(html: string): ArticleBlock[] {
  const clean = REMOVED.reduce(
    (text, pattern) => text.replace(pattern, ''),
    html,
  );
  const blocks: ArticleBlock[] = [];

  for (const [, rawTag, inner, image] of clean.matchAll(BLOCK)) {
    if (image) {
      pushImages(image, blocks);
      continue;
    }
    const tag = rawTag.toLowerCase();
    if (tag === 'pre') {
      codeChunks(inner).forEach(text => blocks.push({ kind: 'code', text }));
      continue;
    }
    if (tag === 'p' || tag === 'li' || tag === 'blockquote') {
      pushImages(inner, blocks);
    }
    if (tag === 'blockquote') {
      quoteParagraphs(inner).forEach(text =>
        blocks.push({ kind: 'quote', text }),
      );
      continue;
    }
    const kind = kindOf(tag);
    const text = tag === 'tr' ? rowText(inner) : inlineText(inner);
    if (text) {
      blocks.push({ kind, text });
    }
  }
  return blocks;
}
