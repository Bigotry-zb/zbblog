export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (body.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\b\w+\b/g) || [])
    .length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

// 标签 URL 片段：小写、空格转连字符。中文标签保留原样，
// 在生成链接时由 encodeURIComponent 负责编码。
export function slugifyTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(slugifyTag(tag))}/`;
}
