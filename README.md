# YuriApp website

Static marketing site for YuriApp (Astro 5, JSON content, CSS scroll-driven animations). Spanish (es-MX).

```
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # astro check + astro build -> dist/
pnpm preview
```

See `CLAUDE.md` for architecture and rules, `USER-MANUAL.md` for day-to-day edits.

## Launch checklist
- [ ] Set the production domain in `src/content/business.json` -> `url` (currently the placeholder `https://yuriapp.example`); canonical URLs, sitemap, hreflang and `robots.txt` all derive from it.
- [ ] Fill `legalName`, `phone`, `whatsapp`, `address` (every `REPLACE_ME`). WhatsApp and phone buttons appear automatically once real.
- [ ] Have a lawyer review `src/content/pages/es-mx/privacy.json` (it is a draft) and decide on a terms page.
- [ ] Add GTM/GA4 IDs under `analytics` (nothing loads while they are empty) and list campaign landing URLs in `docs/URLS-GOOGLE-ADS-Y-GTM.txt`.
- [ ] Replace the illustrative "Ejemplo" cards with real product screenshots (taken in demo mode, `?demo=true`).
- [ ] Re-run `pnpm brand:assets` if the logo changes.
- [ ] Point the host (DigitalOcean App Platform static site) at the repo, build command `pnpm build`, output `dist`.
- [ ] After deploy: confirm the deployment reached ACTIVE, run Lighthouse, submit `sitemap-index.xml` to Search Console.

## Quality status (2026-10-27)
Lighthouse mobile/desktop on every page type: Performance 98-100, Accessibility 100, Best Practices 100, SEO 100. Firefox fallback verified.

Contact: Luis Mendoza, lmendoza.escom@gmail.com
