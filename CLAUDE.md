# Padel Section — Claude Reference

## Project identity
- **Name:** BC Padel Section — Booking & Scheduling Manager
- **Owner:** Club admin — personal project
- **Purpose:** Court session booking, player management, weekly schedule management, Hall of Fame
- **Location:** `[local project directory]`
- **Current version:** v1.0
- **Production URL:** GitHub Pages (static, `docs/` folder)
- **Based on:** BC Squash Section app (forked v4.72)

---

## CLAUDE.md maintenance — NON-NEGOTIABLE
Update this file after every non-trivial change.

---

## Architecture

- **Backend:** None — pure static SPA served from GitHub Pages (`docs/`)
- **Database:** Supabase (Postgres) — JS client v2 called directly from browser
- **Auth:** Phone number login → localStorage session persistence; cookie fallback for iOS/PWA
- **Frontend:** Single-page app — `docs/index.html` + `docs/app.js` + `docs/style.css`
- **No framework, no build step** — vanilla JS, Supabase JS CDN, Chart.js CDN

---

## Supabase credentials

- **URL:** `[redacted — see app.js]`
- **Anon key:** `[redacted — see app.js]` (safe to be in client code)
- **Service role key:** stored in memory only — used for seed scripts, never committed

---

## Setup checklist

- [x] Create Supabase project
- [x] Run `db/schema-supabase.sql` in SQL editor
- [x] Run `db/schema-hof.sql` in SQL editor
- [x] Run `db/schema-audit.sql` in SQL editor
- [x] Update Supabase URL + anon key in `docs/app.js`
- [ ] Create GitHub repo `dbaprojects/padel` and push
- [ ] Enable GitHub Pages on `docs/` folder
- [ ] Create GitHub repo `dbaprojects/padel` and push
- [ ] Enable GitHub Pages on `docs/` folder

---

## File structure

```
docs/
  index.html      — SPA shell
  app.js          — all frontend logic
  style.css       — mobile-first styles, BC navy/gold palette
  bcss.png        — BC crest logo (replace with padel-specific logo when available)
  manifest.json   — PWA manifest
  version.json    — version for PWA cache-busting
db/
  schema-supabase.sql  — core tables DDL
  schema-hof.sql       — hof_results table + RLS
  schema-audit.sql     — audit_log table + RLS
```

---

## Data model

Same as Squash app. Handicap history and HoF tables exist but are not actively used yet.

---

## Versioning

**Version bump checklist** — two distinct string forms, both must be updated:
- `APP_VERSION = 'X.Y'` in app.js (no `v` prefix)
- `vX.Y` display strings in app.js, index.html (×2), version.json
- `style.css?v=X.Y` and `app.js?v=X.Y` query strings in index.html

| Version | Description |
|---|---|
| v1.0 | Initial build — forked from BC Squash Section v4.72 |
