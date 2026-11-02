// Modified from Astro Theme Pure v4.1.6 for this blog.
import type { Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  title: '我的博客',
  author: '我的博客',
  description: '我的博客',
  favicon: '/favicon/favicon.ico',
  socialCard: '/images/blog-card.svg',
  locale: { lang: 'zh-CN', attrs: 'zh_CN', dateLocale: 'zh-CN', dateOptions: { year: 'numeric', month: 'short', day: 'numeric' } },
  logo: { src: '/src/assets/avatar.png', alt: '博客' },
  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',
  head: [],
  customCss: [],
  header: { menu: [ { title: '文章', link: '/blog' }, { title: '归档', link: '/archives' }, { title: '标签', link: '/tags' } ] },
  footer: { year: `© ${new Date().getFullYear()}`, links: [], credits: true, social: [ { icon: 'github', label: 'GitHub', href: 'https://github.com/lolicer' }, { icon: 'rss', label: 'RSS', href: '/rss.xml' } ] },
  content: { externalLinks: { content: ' ↗', properties: { style: 'user-select:none' } }, blogPageSize: 8, imageCaption: true, share: [] }
}
export const integ: IntegrationUserConfig = {
  pagefind: true,
  quote: { server: 'https://dummyjson.com/quotes/random', target: '(data) => data.quote' },
  typography: { class: 'prose text-base', blockquoteStyle: 'italic', inlineCodeBlockStyle: 'modern' },
  mediumZoom: { enable: true, selector: '.prose .zoomable', options: { className: 'zoomable' } },
  waline: { enable: false, server: '' }
}
const config = { ...theme, integ } as Config
export default config

