export const SITE = {
  // 站点标题（浏览器标签 / SEO）
  title: 'Zb|不务正业',
  // 导航左侧品牌名
  brand: 'ZBiao',
  // Hero 上的打字机副标题
  subtitle: '心有猛虎，细嗅蔷薇',
  description: '记录技术、生活与思考。',
  author: 'Zbiao',
  lang: 'zh-CN',
  // 头像
  avatar: '/img/avatar.png',
  // Hero 背景大图
  hero: '/img/default.png',
  // 兼容旧 Hero 组件
  banner: '/img/default.png',
  // 侧边栏个人简介
  bio: '一名后端开发者，喜欢折腾技术与生活。',
  // 页脚起始年份
  since: 2022,
  // 备案号：备案通过后填在这里，会显示在页脚
  icp: '',
  // 公安备案号（可选）
  police: '',
};

export const NAV = [
  { label: '首页', href: '/', icon: 'home' },
  { label: '归档', href: '/archives/', icon: 'archive' },
  { label: '分类', href: '/categories/', icon: 'category' },
  { label: '标签', href: '/tags/', icon: 'tags' },
  { label: '关于', href: '/about/', icon: 'user' },
];

// 侧边栏 / 页脚社交链接
export const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Bigotry-zb', icon: 'github' },
  { label: 'Email', href: 'mailto:1923613738@qq.com', icon: 'email' },
  { label: 'RSS', href: '/rss.xml', icon: 'rss' },
];

// giscus 评论（GitHub Discussions）
// 启用步骤：仓库 Settings → Features 勾选 Discussions → 安装 giscus App
// → 打开 https://giscus.app 填入仓库，复制生成的 categoryId 到下面
export const GISCUS = {
  repo: 'Bigotry-zb/zbblog',
  repoId: 'R_kgDOUgVZiw',
  category: 'Announcements',
  categoryId: '',
  mapping: 'pathname',
  reactions: '1',
  lang: 'zh-CN',
  inputPosition: 'top',
};

// APlayer + MetingJS 音乐播放器（可选）
export const MUSIC = {
  enable: false,
  server: 'netease',
  type: 'playlist',
  id: '2619449091',
  name: '我的歌单',
};

// 每页文章数
export const POSTS_PER_PAGE = 8;
