# Changelog

## 1.1.0 - 2026-10-27
- Hero copy: new eyebrow, headline and paragraph; footer tagline "El ERP de tu taller automotriz".
- Demo video block on the home and the 3D check-in page (WebM/MP4 + poster, pause button, reduced-motion safe).
- Share previews: complete Open Graph/Twitter tags on every page and a generated 1200x630 image per page and function (`public/og/`); the generator fails if text does not fit.
- Production domain set to www.queentires.com.mx; deployed as a DigitalOcean static site from `queen-website-dist`.

## 1.0.0 - 2026-10-27
- First version: home, functions index and nine module pages, pricing, contact, privacy draft, 404.
- Content as Zod-validated JSON; block-based front controller; JSON-LD, sitemap, `llms.txt`, OG image.
- CSS scroll-driven animations (progress bar, hero parallax, reveal, journey line, before/after band, counters) with an IntersectionObserver fallback and reduced-motion support.
- Branding sampled from the YuriApp logo (indigo and gold); icons and OG image generated from the master by `pnpm brand:assets`.
- Footer credit to acidkey.xyz.
