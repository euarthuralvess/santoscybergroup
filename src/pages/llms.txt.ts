/** /llms.txt: plain-text summary for AI assistants (llmstxt.org), built from src/data. */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site, founder, faq, clients } from '../data/site';
import { services } from '../data/services';
import { sectors } from '../data/sectors';

export const GET: APIRoute = async ({ site: astroSite }) => {
  const base = (astroSite?.href ?? site.url).replace(/\/+$/, '');
  const posts = await getCollection('insights', ({ data }) => !data.draft);
  const body = `# ${site.name}

> ${site.description}

Fundador e responsável técnico: ${founder.name}. ${founder.summary}
Contato: WhatsApp https://wa.me/${site.whatsapp}

## Serviços

${services.map((s) => `- [${s.name}](${base}/servicos/${s.slug}): ${s.summary} ${s.offerNote ?? ''}`.trim()).join('\n')}

## Setores atendidos

${sectors.map((s) => `- [${s.name}](${base}/setores/${s.slug}): ${s.stake}`).join('\n')}

## Páginas

- [Método](${base}/metodo): Raio-X, plano de ação e acompanhamento mensal pelo CIS Controls
- [Sobre](${base}/sobre): fundador, trajetória, treinamentos e palestras
- [Contato](${base}/contato)
${posts.map((p) => `- [${p.data.title}](${base}/insights/${p.id}): ${p.data.description}`).join('\n')}

## Clientes atendidos

${clients.map((c) => `- ${c.name} (${c.country})`).join('\n')}

## Perguntas frequentes

${faq.map((f) => `- ${f.q} ${f.a}`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
