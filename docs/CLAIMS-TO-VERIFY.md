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
- [ ] Pricing (business plan, set by the owner on 2026-11-09, `../SAAS_PLAN.md` "Proposed pricing"): the site shows Taller $890, Pro $1,590 and Cadena by agreement. **The app, Stripe and the legal texts do not match yet.** Before the site goes live with these prices, settle the plan's open questions:
  - [ ] Does the app (`Plan` table, Stripe prices, signup) sell Taller and Pro? Today it sells FREE, TEAM ($190 per seat) and ENTERPRISE.
  - [ ] Trial or card up front at signup? The site says neither; the sign-up button reads "Crear cuenta".
  - [ ] Is IVA included in $890 and $1,590? The site does not say.
  - [ ] Which modules are in Taller and which in Pro? The site only says what the plan states: Taller has Presupuestos, Órdenes de trabajo and Reloj checador; Pro adds Métricas and the Telegram bot.
  - [ ] Clock-only workers not counting toward the user limit: not claimed on the site until that user type exists.
  - [ ] SLA terms for Cadena (response times, hours, channel).
  - [ ] Plan names are working names (Taller, Pro, Cadena) until the owner confirms.
  - [ ] Legal texts still describe the old billing: `terms.json` ("se cobra cada mes por usuario") and `refunds.json` ("Plan Gratis"). Update them with the lawyer, not in a content PR.

## How to re-check

Run the `verify-website-vs-modules` skill (`.claude/skills/verify-website-vs-modules`).
