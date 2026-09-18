import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 正式域名确定后，把下面的 site 改成你的域名（含 https://）。
// RSS / sitemap / 绝对链接都会基于它生成，页面里用 Astro.site 读取。
export default defineConfig({
  site: 'https://your-domain.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
