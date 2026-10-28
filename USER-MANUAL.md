# User manual (non-technical)

Everything you edit lives in `src/content/`. You never touch layout code. After any change, run `pnpm build`: if something is wrong the build fails with a message that names the file and the field, and nothing broken reaches production.

## Change a phone, WhatsApp, email or address
Edit `src/content/business.json`. Replace `REPLACE_ME` with the real value (phone and WhatsApp with country code, digits only, for example `5213312345678`). Buttons and the contact page update by themselves.

## Change a price or a plan
Plans are in `src/content/pages/es-mx/home.json` (the `pricing` block). The real prices are charged by the app; keep both in sync. Mirror any change in `pricing.json`.

## Add a function (module)
1. Copy any file in `src/content/modules/es-mx/` (for example `quotes.json`) to a new name such as `inventory.json`.
2. Edit its fields: `order` (position), `slug` (URL, lowercase and dashes), `icon` (one of the allowed names), titles, `highlights` (3 or more), `faqs` (3 or more), `seoTitle` (max 70 characters) and `seoDescription` (70 to 160).
3. To show it in the home "journey", add `{ "module": "inventory", "label": "...", "text": "..." }` to the `journey` block in `home.json`.
The grid, footer, sitemap and `llms.txt` include it automatically.

## Change the text of a page
Open the page in `src/content/pages/es-mx/`. Each page is a list of blocks (`hero`, `problem`, `journey`, `modules`, `features`, `stats`, `pricing`, `faq`, `cta`, `contact`, `prose`). Edit the text, reorder blocks, or remove one. Do not write HTML. You may use `{brand}`, `{since}`, `{clients}`, `{anchor}` and `{email}`, which are filled from `business.json`.

## Add a question to the FAQ
Add `{ "q": "...", "a": "..." }` to the `faq` block. It also feeds Google's FAQ results.

## Add a new page
Create a JSON file in `src/content/pages/es-mx/` with a `slug`, `title`, SEO fields and `blocks`. Set `"nav": true` and an `order` to show it in the menu.

## Scroll animations
Nothing to configure. Anything with `data-reveal` fades in as it enters the screen. People who set "reduce motion" in their system see everything static.

## Replace the demo video
Put the new recording at `src/assets/media/mazda-hatchback-3d.mov` and run `pnpm video:encode` (needs `ffmpeg`). It writes the WebM, MP4 and poster into `public/media/`; commit them. The caption text lives in `description` of the `demo` block in `home.json` and in `checkin.json`: update it so it still describes what the video shows. Keep recordings short and muted, and never show real customer data.

## Logo
Replace `src/assets/brand/yuriapp-logo-master.png`, then run `pnpm brand:assets` and commit the files it generates in `public/`.

## Publish
Commit and push to `main`. The host builds and deploys automatically. Confirm the deployment finished before announcing a change.
