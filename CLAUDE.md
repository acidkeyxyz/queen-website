# CLAUDE.md — working context for the YuriApp marketing site

Read before proposing structural changes. Architecture mirrors
`../servi-rapidos-website` and `../jis-property-services-website` (Astro static,
content as validated data, SEO first), adapted to a SaaS product and extended
with scroll-driven animations.

## What this is
Marketing site for YuriApp, the ERP for body, paint and tire shops in Mexico
(app: https://yuriapp.queentires.com.mx). Goal: explain the product and send
visitors to the app's `/signup` (self-serve) or `/contact-sales`. es-MX only.

## Stack (decided)
- Astro 5, `output: 'static'`, `trailingSlash: 'always'`, `build.format: 'directory'`. No server. Stylesheets are inlined (`inlineStylesheets: 'always'`) to avoid a render-blocking request.
- Zero framework islands. Every interaction is HTML/CSS (`<details>` menu and FAQ) plus one tiny script (`ScrollFx.astro`).
- Content = JSON in `src/content/**`, validated by Zod (`src/content.config.ts`). A typo fails the BUILD.
- Node 20+, pnpm only. TypeScript pinned to 5.x. Fonts self-hosted via `@fontsource-variable/{manrope,inter}`.

## Hard rules
1. **One front controller:** `src/pages/[...route].astro` (plus 404, `robots.txt.ts`, `llms.txt.ts`). A page is a JSON file with a `blocks[]` array; `BlockList.astro` maps `type` to a component. New page = new JSON.
2. **All URLs come from `src/lib/site.ts`** (`site.href.page/module/home`). Content links use tokens resolved by `src/lib/links.ts`: `app:signup`, `app:sales`, `app:login`, `page:<key>`, `module:<key>`.
3. **NAP and brand facts only in `src/content/business.json`.** `REPLACE_ME` marks unknown values; the UI hides WhatsApp/phone until they are real.
4. **No invented facts.** Prices come from the live plans API (`/api/v1/plans`: Gratis $0, Taller $190 MXN per user/month, min 2 users, Empresarial by agreement). No testimonials, ratings or logos that are not real. Cards labelled "Ejemplo" are illustrative.
5. Rich text never contains HTML; editors use the whitelisted `{placeholders}` in `src/lib/text.ts` (`{brand}`, `{since}`, `{clients}`, `{anchor}`, `{email}`).
6. SEO layers: one JSON-LD `@graph` per page (`lib/schema.ts`), canonical + hreflang (es-MX, x-default), OG/Twitter, sitemap, `llms.txt`. `seoTitle` ≤ 70, `seoDescription` 70–160 (schema-enforced). Each module page has 3+ FAQs (feeds FAQPage).
7. **WCAG 2.2 AAA target:** text ≥ 7:1, targets ≥ 44px, two-tone `:focus-visible` ring, `ui.a11y.newWindow` on every `target="_blank"`, skip link, `prefers-reduced-motion` respected, no-JS works.
8. No code comments; explanations belong in commit/PR descriptions.

## Scroll animations (the new feature)
Researched options: ScrollMagic is effectively superseded (GreenSock recommends ScrollTrigger); GSAP ScrollTrigger is free now but adds ~30 KB of JS and fights the zero-JS rule. Chosen: **CSS scroll-driven animations** (`animation-timeline: view()` / `scroll(root)`), no library.
- Everything is gated by `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`; the default state is fully visible.
- Opt in with `data-reveal` (up) or `data-reveal="left|right|scale"`; stagger with `style="--i:n"`.
- Effects: top progress bar, hero cards parallax (`--depth`), reveal-on-enter, the journey line that draws as you scroll, before/after band, counters (`@property --n`).
- **Fallback** (Firefox without native support): `ScrollFx.astro` adds `.is-in` through IntersectionObserver and a CSS transition runs. Verified in Firefox 144.
- **Gotcha:** the fade uses `filter: opacity()`, not `opacity`. Lighthouse/axe sample elements mid-animation and report false contrast failures on a plain `opacity` fade. Resting states are AAA; do not switch it back.
- Do not animate text opacity in the problem band: a faded card would break AAA contrast.

## Design tokens (sampled from the logo, `src/assets/brand/yuriapp-logo-master.png`)
| Token | Value | Use |
|---|---|---|
| `--ink` | `#18176a` | dark bands, hero, footer, text |
| `--ink-2` | `#272589` | primary buttons, links on light |
| `--accent` | `#e2ab69` | gold: accent button, eyebrow, stats (on `--ink` only, 7.5:1) |
| gold light / copper | `#f4d58d` / `#d2864a` | decorative; copper is never text |
| `--paper` | `#f4f3fb` | alternate section background |
| `--muted` / `--muted-inv` | `#45476b` / `#d4d3f3` | secondary text on light / dark |
Two typefaces: Manrope Variable (display), Inter Variable (text). Boldness is spent on one signature: the journey line. Re-run the contrast check whenever a token changes.

## Gotchas learned
- Don't put `backdrop-filter` on `.hdr`: it clips the fixed mobile menu panel.
- The dock and header are mutually exclusive on mobile (`html.scroll-down`, `at-top`, `at-end` set by `ScrollFx.astro`); `:has(:focus-visible)` keeps them visible for keyboard users.
- Reserve space for the dock inside the footer (`--bar-h`), never as `body` padding.
- Icons: add paths to `Icon.astro` and the `icon` enum in `content.config.ts` together; it spreads `...rest` so scoped CSS reaches it.
- In zsh a loop variable named `path` overwrites `PATH`. Use another name in shell scripts.
- Headings: when a section is the page's h1, its inner card headings are h2 (`Inner` in each block). Keep this or Lighthouse flags heading order.

## Commands
`pnpm dev` · `pnpm build` (runs `astro check` first) · `pnpm preview` · `pnpm brand:assets` (regenerates icons and `og-default.jpg` from the logo master; commit the output).

## Maintainer preferences
English for docs and commits, Spanish only for user-visible copy. One feature per PR. Status updates as a table for Developers / PMs / Non-technical / C-level.
