# YuriApp website

Static marketing site for YuriApp (Astro 5, JSON content, CSS scroll-driven animations). Spanish (es-MX).

```
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # astro check + astro build -> dist/
pnpm preview
```

See `CLAUDE.md` for architecture and rules, `USER-MANUAL.md` for day-to-day edits.

## Deployment

Two repos, same pattern as `servi-rapidos-website` / `jis-property-services-website`:

| Repo | Role |
|---|---|
| `acidkeyxyz/queen-website` (this one) | Source. Never deployed directly. |
| `acidkeyxyz/queen-website-dist` | The built `dist/` at its root, one `deploy:` commit per release. |

Both live side by side in `/home/lmendoza/git/queen/` (the commands below rely on `../queen-website-dist`).

DigitalOcean App Platform app **`queen-website`** (id `bab23b22-54d7-4462-bd59-e1c5c66ce1d1`, region `sfo`) is a static site whose source is `queen-website-dist` on `main` with `deploy_on_push: true`. There is **no build step on DigitalOcean**: it serves the files as committed. Default URL: https://queen-website-7dmav.ondigitalocean.app

### Release steps
1. Merge the change into `main` of `queen-website` (one feature per PR) and update your checkout.
2. Build from a clean install. Never trust an old `dist/`:
   ```
   cd /home/lmendoza/git/queen/queen-website
   git switch main && git pull --ff-only
   pnpm install --frozen-lockfile
   pnpm build
   ```
   The build runs `astro check` first and fails on any content or type error.
3. Copy the output into the dist repo. `--delete` removes pages that no longer exist; `.git` is protected:
   ```
   rsync -a --delete --exclude .git dist/ ../queen-website-dist/
   ```
4. Commit and push the dist repo, naming the source commit:
   ```
   cd ../queen-website-dist
   git status --short            # review what changes
   SRC=$(git -C ../queen-website rev-parse --short HEAD)
   SUBJ=$(git -C ../queen-website log -1 --format=%s)
   git add -A
   git commit -m "deploy: $SRC $SUBJ (main)"
   git push origin main
   ```
   Pushing triggers the deployment automatically (about one minute).
5. **Confirm the deployment reached `ACTIVE`** before announcing anything. A failed deploy keeps the previous version serving, so the site being up proves nothing:
   ```
   GET https://api.digitalocean.com/v2/apps/bab23b22-54d7-4462-bd59-e1c5c66ce1d1/deployments?per_page=3
   ```
   (Bearer token from `~/.config/doctl/config.yaml`; check `phase` and that the commit matches.) Also open the default URL and spot-check the pages you changed.
6. Optional: run Lighthouse against the live URL (mobile). The last release scored 95 / 100 / 100 / 100.

### Roll back
Revert the last commit in `queen-website-dist` (`git revert HEAD && git push origin main`). DigitalOcean redeploys the previous content. Fix the source in `queen-website` afterwards and release normally.

### Gotchas
- Never edit files in `queen-website-dist` by hand; the next release overwrites them.
- `og-default.jpg` and `public/brand/*` come from `pnpm brand:assets`; run it and commit the output in `queen-website` before building if the logo changed.
- `business.json` -> `url` drives every canonical URL, the sitemap and `robots.txt`. It is `https://www.queentires.com.mx` while the site is still reachable on the default `*.ondigitalocean.app` URL, so that URL is a duplicate that points its canonical at the real domain.
- The custom domain is **not attached yet**. `queentires.com.mx` is a DigitalOcean DNS zone and `www.queentires.com.mx` currently resolves to something else, so attaching it is a deliberate DNS change: add the domain to the app (Settings -> Domains), then create or edit the `www` record it asks for. Do this only when you are ready to replace what `www` serves today.
- No build runs on DigitalOcean, so the pnpm version and the 24h release-age policy that affect `queen-webapp` do not apply here; they only matter on your machine.

## Launch checklist
- [x] Production domain is set to `https://www.queentires.com.mx` in `src/content/business.json` -> `url` (assumed; confirm before launch). Canonical URLs, sitemap, hreflang and `robots.txt` derive from it.
- [ ] Fill `legalName`, `phone`, `whatsapp`, `address` (every `REPLACE_ME`). WhatsApp and phone buttons appear automatically once real.
- [ ] Have a lawyer review `src/content/pages/es-mx/privacy.json` (it is a draft) and decide on a terms page.
- [ ] Add GTM/GA4 IDs under `analytics` (nothing loads while they are empty) and list campaign landing URLs in `docs/URLS-GOOGLE-ADS-Y-GTM.txt`.
- [ ] Replace the illustrative "Ejemplo" cards with real product screenshots (taken in demo mode, `?demo=true`).
- [ ] Re-run `pnpm brand:assets` if the logo changes.
- [x] Hosting: DigitalOcean static site deploying from `queen-website-dist` (see Deployment).
- [ ] Attach `www.queentires.com.mx` to the app and update DNS (see Deployment, gotchas).
- [ ] After deploy: confirm the deployment reached ACTIVE, run Lighthouse, submit `sitemap-index.xml` to Search Console.

## Quality status (2026-10-27)
Lighthouse mobile/desktop on every page type: Performance 98-100, Accessibility 100, Best Practices 100, SEO 100. Firefox fallback verified.

Contact: Luis Mendoza, lmendoza.escom@gmail.com
