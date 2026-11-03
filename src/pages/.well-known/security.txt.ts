/** RFC 9116 security.txt. Expires one year after each build. */
import type { APIRoute } from 'astro';
import { site } from '../../data/site';

export const GET: APIRoute = ({ site: astroSite }) => {
  const base = (astroSite?.href ?? site.url).replace(/\/+$/, '');
  const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().replace(/\.\d+Z$/, 'Z');
  const contacts = [site.securityEmail && `mailto:${site.securityEmail}`, `${base}/contato`].filter(Boolean);
  const body = [
    ...contacts.map((c) => `Contact: ${c}`),
    `Expires: ${expires}`,
    'Preferred-Languages: pt, en',
    `Canonical: ${base}/.well-known/security.txt`,
    `Policy: ${base}/privacidade`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
