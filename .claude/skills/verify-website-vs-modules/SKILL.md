---
name: verify-website-vs-modules
description: Verify that what the marketing site says about the product is backed by the module guides in ../queen-webapp/docs/modules/*.md, and that the guides cover what the site sells. Use when asked to check, audit or align the website with the module documentation, after editing site copy, or after a guide changes.
---

# Verify the website against the module guides

Rule 4 of `CLAUDE.md`: no invented facts. A product claim on the site must be backed by a guide in
`../queen-webapp/docs/modules/`. The guides are written from the real screens; the site must not say more.

## 1. Run the mechanical check

```
pnpm verify:claims                                   # against ../queen-webapp (its current checkout)
MODULE_DOCS=/path/to/docs/modules pnpm verify:claims # against another checkout or worktree
pnpm verify:claims -- --verbose                      # also list every backed claim
```

It reads `docs/claims-map.json` and fails when:

- a site page has no mapping, or maps to a guide that does not exist;
- a guide is neither on the site nor listed in `notOnSite` with a reason;
- a claim in `evidence` is not on the page any more, or its guide never says the matching label (UNBACKED);
- a banned term appears (WhatsApp outside the legal pages, "sellos");
- the specialists counter differs from the task catalog guide, or the journey stages differ from the stage pages.

Warnings are the claims kept on purpose (see `docs/CLAIMS-TO-VERIFY.md`). Make sure the webapp checkout
is the branch you mean: guide changes that are not merged yet will show as UNBACKED.

## 2. Read the pages against the guides (what a script cannot do)

For each page in `claims-map.json -> pages`, read the page JSON (`src/content/modules/es-mx/<page>.json`)
and its guides side by side. Check, in this order:

1. **Names and labels:** the buttons, tabs, types and statuses the page names exist in the guide with the same words.
2. **Lists and counts:** every list on the site (specialists, payment groupings, stages) equals the guide's list.
3. **Behaviour:** verbs such as "envía", "calcula", "avisa", "aprueba" are described in the guide. If not, it is a claim without evidence.
4. **Numbers and prices:** compare with the live app, not with memory:
   `curl -s https://yuriapp.queentires.com.mx/pricing` (price per user, minimum and maximum users, branches).
5. **Documented but missing:** guides in `notOnSite` are still fair to question; ask whether a selling point is being missed.

## 3. Decide, never invent

For each mismatch there are only three outcomes, and the user decides when it is not obvious:

| Situation | Action |
|---|---|
| Site is right, guide is incomplete | Fix the guide in `queen-webapp` (its own PR), then re-run |
| Guide is right, site says more | Cut the site copy back to the guide |
| Nobody knows | Keep the copy only if the user says so, and add it to `docs/CLAIMS-TO-VERIFY.md` with how to test it |

If the user says the website is the truth (for example a new specialist), the app and the guide change, not the site.

## 4. After changing site copy or pages

1. New page: add it to `claims-map.json -> pages`, and add `evidence` entries for each claim it makes.
2. `pnpm brand:assets` (share images; it throws if a title or tagline does not fit) and commit the output.
3. `pnpm build` (runs `astro check`). SEO limits are schema-enforced: `seoTitle` up to 70 characters, `seoDescription` 70 to 160, three or more FAQs per module page.
4. Re-run `pnpm verify:claims`.
5. Keep the site's rules: es-MX copy, WCAG 2.2 AAA, no code comments, one feature per PR, English for docs and commits.

## 5. Report

End with a table: claim, page, guide, status (backed, unbacked, unverified), and what you changed. Say plainly what you
could not check (for example a price you could not read from the live app).
