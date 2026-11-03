// @ts-check
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

const SITE_URL = (process.env.SITE_URL ?? 'https://www.santoscybergroup.com.br').replace(/\/+$/, '');

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  output: 'static',
  compressHTML: true,
  devToolbar: { enabled: false },
  build: { format: 'file', inlineStylesheets: 'never' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: {
    // Never inline scripts: the CSP in public/_headers allows script-src 'self' only.
    build: { assetsInlineLimit: 0 },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const top = { '/': 1.0, '/servicos': 0.9, '/contato': 0.8, '/metodo': 0.7, '/sobre': 0.7, '/setores': 0.7 };
        /** @type {number} */
        let priority = 0.5;
        if (path in top) priority = top[/** @type {keyof typeof top} */ (path)];
        else if (path.startsWith('/servicos/')) priority = 0.9;
        else if (path.startsWith('/setores/')) priority = 0.7;
        else if (path.startsWith('/insights')) priority = 0.6;
        return {
          ...item,
          priority,
          changefreq: path === '/' || path === '/insights' ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY,
        };
      },
    }),
  ],
});
