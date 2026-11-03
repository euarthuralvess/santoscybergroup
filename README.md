# Santos Cyber Group: site

Static Astro site for Santos Cyber Group, a managed cybersecurity firm for small and mid-sized companies in Brazil (Natal/RN, remote nationwide). Portuguese only.

## Visual direction

Product-grade security look, in the line of taurasecurity.com: deep night-sky navy in layers, thin display type, mono labels, rounded cards and **illustrative product mockups** that show what the client receives (Raio-X view, prioritised findings, action plan, same-day alert, 2-page monthly report). Every mockup is labelled "Exemplo ilustrativo".

- **Colour** (`src/styles/tokens.css`): navy surfaces from `--night #050b2e` to `--surface-3 #1f2a4b`; one brand blue taken from the SG shield (`--brand #2f6fe4`, `--accent #78b4ff`). Amber, green and red appear only as status inside mockups.
- **Type**: Sora (display, weights 300 to 400), Geist (body), Geist Mono (uppercase tracked labels). All self-hosted through Fontsource, with no third-party requests.
- **Logo**: the official SG shield, `src/assets/images/logo-sg.jpg`. `pnpm brand` keys out its black background into `logo-sg.png` (used by `src/components/ui/Shield.astro`) and derives the favicons, icons and `og.png` from it.
- **Motion**: a seeded constellation canvas behind the hero, inner page heroes and the final CTA (it reacts to the pointer and pauses off screen); the Raio-X tabs; the layer stack, which lights up as the list is hovered. `prefers-reduced-motion` is respected everywhere.

## Stack

- Astro 7, static output, no UI framework. Vanilla TS islands live in `src/scripts`.
- Content collection for articles (`src/content/insights/*.md`).
- `@astrojs/sitemap`, JSON-LD `@graph` on every page (ProfessionalService, Person, WebPage, BreadcrumbList, Service, FAQPage, Article), `/llms.txt`, `/robots.txt` and `/.well-known/security.txt` (RFC 9116).
- No inline scripts. The strict CSP in `public/_headers` (`script-src 'self'`) holds on every page.

```sh
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # dist/
pnpm check        # astro check (0 errors expected)
pnpm brand        # regenerates favicon PNGs, icons and og.png (needs Google Chrome)
```

## Where things live

| What | File |
|---|---|
| Company facts, contact, founder, clients, testimonials, FAQ | `src/data/site.ts` |
| Services: copy, deliverables, steps, FAQ, SEO | `src/data/services.ts` |
| Sectors: risks, legal references, recommended route | `src/data/sectors.ts` |
| Raio-X demo findings, Sentinela layers, method steps | `src/data/findings.ts`, `layers.ts`, `method.ts` |
| Articles | `src/content/insights/*.md` |
| Home sections | `src/components/sections/*` |

Every page is generated from these files. To add a service or a sector, add an entry. Its page, footer link, sitemap entry, JSON-LD and `llms.txt` line follow automatically.

## Contact form

The form has no backend. It builds a WhatsApp message from the fields and opens `wa.me`, so nothing is stored by the site. This is a privacy point the policy page makes. If a backend is wanted later, swap `src/scripts/contact.ts`.

## Indexing and deploy

Previews are **noindex** by default (`robots.txt` disallows everything, meta robots is `noindex`). Production builds must set:

```sh
PUBLIC_INDEXABLE=true pnpm build
```

**Production:** https://www.santoscybergroup.com.br is served by GitHub Pages (Cloudflare in front). `.github/workflows/deploy.yml` builds with `PUBLIC_INDEXABLE=true` and publishes `dist` on every push to `main` (Settings → Pages → Source must be "GitHub Actions"). `public/CNAME` keeps the custom domain. GitHub Pages ignores `public/_headers`; set those headers in Cloudflare if wanted.

**Current preview:** https://santos-cyber-group.vercel.app (Vercel project `santos-cyber-group`, production env `SITE_URL=https://santos-cyber-group.vercel.app` so canonical and og:image point at the preview, and still noindex). `vercel.json` carries the same security headers as `public/_headers`. Redeploy with `vercel deploy --prod`. On launch day, point the real domain at the project, remove `SITE_URL` and set `PUBLIC_INDEXABLE=true`.

Alternative host: **Cloudflare Pages**. The company already uses Cloudflare in front of GitHub Pages, and Pages applies `public/_headers` (CSP, HSTS, frame and referrer policies, immutable cache for `/_astro`). Build command `pnpm build`, output `dist`, env `PUBLIC_INDEXABLE=true`.

## Pending from the client

Empty values in `src/data/site.ts` are hidden on the site until filled:

- `email`: contact page and footer.
- `securityEmail`: `security.txt` (falls back to the contact page).

Copy to validate with Arthur before launch:

- The service steps and FAQ answers in `services.ts`: written from the original site's promises, but the specifics (for example, the scan not interrupting operations) are his to confirm.
- The scope of the Sentinela plans **Essencial** and **Gerenciado**, which the original site names without describing.
- The three seed articles in `src/content/insights`: factual, citing LGPD arts. 46 and 48 and the ANPD's three-business-day notification rule, but published in his name.
- Permission to name the five clients, and whether logos can be used in place of names.
- The sector pages' legal lines, which cite only the statutes. A lawyer's read is recommended.
- The photo is the one from the current site (`euarthuralvess.github.io`). A professional portrait would lift the About page.
