export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatMonthDay(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) || []).length;
  const words = (body.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\b\w+\b/g) || [])
    .length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

// URL 片段：小写、空格与斜杠转连字符。中文保留原样，
// 生成链接时由 encodeURIComponent 负责编码。
export function slugifyTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/[\s/\\]+/g, '-');
}

export function tagHref(tag: string): string {
  return `/tags/${encodeURIComponent(slugifyTag(tag))}/`;
}

export function slugifyCategory(category: string): string {
  return category.trim().toLowerCase().replace(/[\s/\\]+/g, '-');
}

export function categoryHref(category: string): string {
  return `/categories/${encodeURIComponent(slugifyCategory(category))}/`;
}
