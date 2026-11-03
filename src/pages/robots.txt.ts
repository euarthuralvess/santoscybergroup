import type { APIRoute } from 'astro';
import { indexable } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? '').replace(/\/+$/, '');
  const body = indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap-index.xml\n`
    : `# Preview build: not for indexing. Set PUBLIC_INDEXABLE=true in production.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
