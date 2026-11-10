# Website claims to verify

Claims that are on the site but are not (yet) backed by `queen-webapp/docs/modules/*.md`
or by a test. Kept on purpose; each one needs a real check. Rule 4 of `CLAUDE.md`
applies: if a check fails, change the site copy, not the checklist.

## Wholesale and preferred prices (kept on purpose, test later)

Where: `src/content/modules/es-mx/quotes.json`, FAQ "¿Puedo manejar precios distintos
por tipo de cliente?" ("el catálogo de productos admite precios para clientes
mayoristas y preferentes").

- [ ] Find where the app sets prices by customer type. The schema has `Price` and
      `PriceRoleRel`; no guide in `docs/modules` describes a screen for it yet.
- [ ] In a local clone (never production): create a product with a normal, a wholesale and a preferred price.
- [ ] Create a client of each type, make a quote for each, and confirm the line price changes.
- [ ] Write the steps into `docs/modules/tiresList.md` and `salesList.md` (Primer uso), so the guides support the claim.
- [ ] If it does not work, remove the FAQ and the "mayoristas y preferentes" wording from `quotes.json`.

## Other claims without a guide behind them

- [ ] Home, "Datos aislados por taller": subdomain per workshop, sessions tied to the company, login attempt limit. Add a guide section (Usuarios / Accesos) or a security note, then test it.
- [ ] Home, "Modo demo": confirm against `queen-webapp/docs/demo-mode.md` that it hides all real data.
- [ ] Home and pricing, "importar archivos CSV": test one import end to end (see `docs/modules/importsList.md`).
- [ ] Check-in page, 3D model: the app ships one hatchback model. Confirm before saying more than "tamaño chico, mediano o grande".
- [ ] Reloj checador page: confirm the time clock migrations (045, 046) are applied in production before announcing the page, and re-check the STPS date (1 Jan 2027) against the official text.
- [ ] Quotes by Telegram: confirm the bot works for a new workshop (account linking with "Vincular Telegram") and decide whether to link the bot from the page.
- [ ] Pricing: update the Taller price when the app's `Plan` table changes (the site shows $190 MXN per user per month, minimum 2 users, up to 10 users and 2 branches, as the live app does today).

## How to re-check

Run the `verify-website-vs-modules` skill (`.claude/skills/verify-website-vs-modules`).
