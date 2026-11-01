# 我的博客

基于 [Astro Theme Pure](https://github.com/cworld1/astro-theme-pure) v4.1.6（上游提交 `394834030faf2e707ac9e3c3c79022418c539868`）构建，部署于 GitHub Pages。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm preview
```

文章位于 `src/content/blog/`，站点设置位于 `src/site.config.ts`。评论功能暂未启用。主题采用 Apache-2.0 许可证，详见 `LICENSE`；文章内容的许可另行确定。

本站修改了上游的 Astro 配置、站点配置、首页、RSS 和依赖配置，以适配中文博客及 GitHub Pages。
