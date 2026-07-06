# Site Improvement Plan

Working backlog for islameyn.com. Goal: **catch a college recruiter's eye without being busy or overwhelming.** Recruiters skim for ~30 seconds looking for grad year, events, PRs, GPA, and proof — every change should serve that scan.

**How to use this file:** Each task has a status, priority, and implementation plan. Update the status line when starting/finishing work. Add notes under a task as decisions are made.

Statuses: `TODO` · `IN PROGRESS` · `DONE` · `DEFERRED`

---

## Phase 1 — Credibility fixes (do first)

### 1. Remove placeholder content site-wide
**Status:** TODO · **Priority:** Critical · **Effort:** Small

Fake-looking template content undermines everything real on the site.

- [ ] `data/endorsements.json` — delete the 4 placeholder entries ("Coach Name", "Mentor Name", "Training Director", "Team Captain, Former"). Keep only Coach Savannah Brady's real letter. One real letter beats four fake quotes.
- [ ] `achievements.html` (Awards & Honors section, ~lines 98–115) — remove the two "Award Name / Brief description" placeholder cards. Either populate with real academic awards (honor roll, etc.) or hide the section until there's real content.
- [ ] `index.html` Extracurricular check — verify "Student Body Vice President", "Debate Team Captain", "Volunteer Coordinator" in `achievements.html` are real, not template leftovers. **Ask Tommy before deleting.**
- [ ] Grep the whole site for other template artifacts: `grep -rn "Award Name\|Coach Name\|Brief description\|placeholder" --include="*.html" --include="*.json"`

### 2. Restore homepage identity (hero headline)
**Status:** TODO · **Priority:** Critical · **Effort:** Small

The homepage currently has no `<h1>` — removed along with the "Defining the Next Generation" tagline. Above the fold must answer: who, what sport, what class year, headline numbers.

- [ ] Add h1 to hero in `index.html`: **"Isla Meyn"** with subhead **"Distance Runner · Class of 2028 · Fort Thomas, KY"** (style consistent with existing display typography; keep the "Recruiting Class of 2028" badge or fold it into the subhead — don't duplicate).
- [ ] Replace generic hero copy ("raw power with strategic precision… building a legacy") with specific, factual copy naming her sport and top credentials: 1600m 5:21 PR, 2x KHSAA state qualifier, 3.95 GPA. Short — two sentences max.
- [ ] Fix "on and off the field" → "on and off the track" in the bio section (~line 95).
- [ ] Bio section ("Meet Isla") copy is also generic — rewrite with her actual story: no prior sports experience → varsity in one meet → team MVP → state qualifier. Coach Brady's letter in `data/endorsements.json` has the raw material (3.5 min 5k improvement, 5:45→5:21 1600m, injury comeback via swim team).

### 3. Populate the schedule for fall XC season
**Status:** TODO · **Priority:** Critical · **Effort:** Small (needs data from Tommy)

`data/schedule.json` is `[]`. "Come watch her race" is the #1 recruiter call-to-action.

- [ ] Get fall 2026 cross country meet schedule from Tommy (Highlands High School XC).
- [ ] Read `schedule.html` first to determine the expected JSON shape before writing entries.
- [ ] Include: meet name, date, location, and MileSplit meet link where available.

---

## Phase 2 — Recruiter-scan features

### 4. Personal Bests strip (auto-computed)
**Status:** TODO · **Priority:** High · **Effort:** Medium

The single biggest content win. PRs per event with date + meet, computed from `data/results.json` so it never goes stale.

Implementation plan:
- [ ] Write a `computePRs(meets)` function (can live in `js/main.js` or inline in `profile.html`): for each unique `eventName`, find the minimum parsed time using the existing `parseTime()` logic in `profile.html`. Return `{ eventName, time, meetName, date }`.
- [ ] Decide which events to feature (suggest: 1600m Run, 800m, 5000m Run XC, Road 5k — confirm list with Tommy). Filter out relays from the headline strip (relay times aren't individual PRs) or label them clearly as relay splits if split data exists.
- [ ] Render a "Personal Bests" card row at the top of `profile.html` (above the tabs). Style: big time in `--secondary`, event name label, small meet/date caption — mirror the stat-card pattern in `achievements.html` (GPA cards).
- [ ] Echo top 3 PRs on the homepage "Key Stats" card (see task 12 — do these together).
- [ ] Edge cases: `parseTime` currently handles `MM:SS.cs` and a malformed `HH:MM:SS`; verify all timeScore values in results.json parse correctly before trusting the min.

### 5. Link MileSplit / Athletic.net profiles
**Status:** TODO · **Priority:** High · **Effort:** Small (needs URLs from Tommy)

Recruiters verify times on MileSplit anyway; direct links signal transparency.

- [ ] Get Isla's MileSplit profile URL and Athletic.net URL (if she has one) from Tommy.
- [ ] Add links in two places: (a) homepage Key Stats card or bio section, (b) Results page hero blurb. Small text links or badge-style buttons — not loud.

### 6. Surface the PDF one-pager
**Status:** TODO · **Priority:** High · **Effort:** Small

`docs/Meyn-Isla.pdf` exists but is linked nowhere. Coaches forward one-pagers internally.

- [ ] Check the PDF content is current (it's from May 2026 — predates state championship results and Firecracker 5k win). Flag to Tommy if stale.
- [ ] Add a "Download Athletic Profile (PDF)" button — suggest homepage hero area and/or nav Contact area. One prominent placement, not five.

### 7. Open Graph / social preview tags
**Status:** TODO · **Priority:** High · **Effort:** Small

No OG tags exist. When the link is texted/emailed to a coach, the preview card is the first impression.

- [ ] Add to `<head>` of all 5 public pages (index, profile, schedule, achievements, endorsements):
  - `og:title` — e.g. "Isla Meyn | Class of 2028 Distance Runner"
  - `og:description` — one line with PRs + GPA
  - `og:image` — absolute URL to a strong photo, 1200×630 crop (may need to create; see task 8)
  - `og:url`, `og:type` (`profile` or `website`)
  - `twitter:card` = `summary_large_image`
- [ ] Per-page titles/descriptions (Results page describes results, etc.).
- [ ] Validate with an OG preview tool after deploy.

### 8. Add race photos
**Status:** TODO · **Priority:** High · **Effort:** Small (needs photos from Tommy)

One photo site-wide (`images/IMG_5202.jpg`). Visual proof matters more than copy.

- [ ] Get 2–3 photos from Tommy: finish line, relay handoff, podium/medal moments.
- [ ] Placement suggestions: bio section in `index.html` (currently text-only next to Key Stats), endorsements page header, achievements page. Keep it restrained — one photo per page beyond the homepage.
- [ ] Optimize before committing (see task 10 — same pipeline).

---

## Phase 3 — Infrastructure & hygiene

### 9. Replace Tailwind CDN with precompiled CSS
**Status:** TODO · **Priority:** Medium · **Effort:** Medium

All pages load `https://cdn.tailwindcss.com` — the dev-only, compile-in-browser build. Slow, logs a console warning, breaks if CDN is unreachable.

Implementation plan:
- [ ] Install Tailwind standalone CLI (no node_modules needed: `brew install tailwindcss` or download binary).
- [ ] Create `tailwind.config.js` capturing the custom tokens currently used in class names (`font-label-bold`, `text-headline-md`, `bg-surface`, `margin-mobile`, `container-max`, etc.). **Audit `css/styles.css` first** — the design tokens (CSS vars like `--secondary`) live there; the config must map Tailwind utilities to them.
- [ ] Build: `tailwindcss -i css/styles.css -o css/tailwind.css --minify` scanning `*.html`.
- [ ] Replace the CDN `<script>` tag with `<link rel="stylesheet" href="css/tailwind.css">` on all pages (including admin pages if kept).
- [ ] Add build command to `package.json` scripts. Document in README: "run `npm run build:css` after adding new Tailwind classes."
- [ ] Verify visually on every page before committing — the CDN build allows arbitrary classes; the compiled build only includes classes present at build time. Dynamic classes built in JS strings (e.g. in `profile.html` render functions) must be safelisted or present in scanned files.

### 10. Optimize hero image
**Status:** TODO · **Priority:** Medium · **Effort:** Small

`images/IMG_5202.jpg` is 458KB; hero uses fixed `h-[921px]`.

- [ ] Convert to WebP at reasonable width (~1600px, quality ~80): `cwebp` or `sips` + ImageMagick. Target under 120KB. Keep JPEG as fallback via `<picture>` if desired, or just swap (WebP support is universal now).
- [ ] Add explicit `width`/`height` attributes (prevents layout shift).
- [ ] Add `fetchpriority="high"` to the hero img (it's the LCP element).
- [ ] Change `h-[921px]` → `min-h-[85vh]` so it fits laptop viewports.
- [ ] Same pipeline for any new photos (task 8).

### 11. Fix js/main.js bugs
**Status:** TODO · **Priority:** Medium · **Effort:** Small

- [ ] Delete the contact-button block (~lines 50–57): `document.querySelector('button:contains("Contact")')` is an invalid selector that **throws on every page load**.
- [ ] Delete the `Element.prototype.contains` override (~lines 60–63): clobbers the native DOM `contains()` method.
- [ ] Delete or keep the performance-timing logger (harmless, uses deprecated API) — suggest delete.
- [ ] The IntersectionObserver block observes `[data-animate]` elements; none exist in any page. Either delete it or actually use it (subtle fade-ins could serve the "pop without busy" goal — pair with task 13).

### 12. Derive Key Stats from data (stop hardcoding)
**Status:** TODO · **Priority:** Medium · **Effort:** Small

"12 Podium Finishes" is hardcoded in `index.html` and will drift from `data/results.json`.

- [ ] On homepage load, fetch `results.json` and compute podium count (places 1st–3rd across all events).
- [ ] Consider replacing/augmenting the two-stat card with: podium count, GPA, and top PRs (coordinate with task 4's `computePRs` — share the function).
- [ ] GPA stays hardcoded (not in any data file) — fine, or add a `data/profile.json` for bio-level facts (GPA, grad year, school, MileSplit URL) so all copy pulls from one place. **Decide with Tommy: only worth it if it stays simple.**

### 13. Retire the admin panel
**Status:** TODO · **Priority:** Medium · **Effort:** Small

**Decided 2026-07-06: retire it** (Tommy approved as part of security hardening, task 16). `admin/panel.html` edits localStorage only — changes never reach the live site. The password gate is client-side (hash visible in source), so it's decoration, not security, and the "Secure Access" footer link advertises an attack surface. Pages CMS (task 14) replaces it.

- [ ] Delete `admin/`, `admin-login.html`, and `login.html`.
- [ ] Remove the "Secure Access" link from the `index.html` footer.
- [ ] Grep for any other references to the deleted pages before committing.
- [ ] Sequencing: fine to do immediately — the panel isn't part of the current editing workflow (direct JSON edits + git).

### 14. Pages CMS for no-code content editing
**Status:** TODO · **Priority:** Medium · **Effort:** Medium

Replace the "edit JSON + git push" workflow with [Pages CMS](https://pagescms.org) — free, git-backed, hosted UI with mobile-friendly forms. Every save commits to the repo → GitHub Pages auto-deploys. Tommy can add a meet result from his phone at the meet.

Implementation plan:
- [ ] Write `.pages.yml` in the repo root defining media config and content schemas for:
  - `data/results.json` — file collection; fields: season (select), sport (select: Track & Field / Cross Country / Road Racing), meetName, date, location, link, events (list: eventName, timeScore, place, notable list — document the `sq`/`pr` codes + free-text badge convention in field descriptions)
  - `data/schedule.json` — meetName, date, location, link
  - `data/academics.json` — awardName, description, date, category
  - `data/endorsements.json` — quote, name, title, email, fullLetter (textarea)
- [ ] Validate the schema shapes against the render functions in `profile.html` before finalizing (field names must match exactly).
- [ ] **Tommy:** install the Pages CMS GitHub App on `thmeyn/isla_athlete` at pagescms.org and log in with GitHub.
- [ ] Test round-trip: edit a result via CMS UI → verify commit lands → verify deploy → verify page renders.
- [ ] Coordinate with task 12: if bio-level facts (GPA, grad year, MileSplit URL) move to `data/profile.json`, add it to `.pages.yml` too so nearly all content is CMS-editable. Coursework lists in `achievements.html` remain HTML-only unless also migrated.
- [ ] Update README with the new editing workflow; consider retiring the admin panel (task 13) at the same time since the CMS replaces it.

### 15. Deploy hygiene: 404, favicon, JSON validation
**Status:** TODO · **Priority:** Low · **Effort:** Small

- [ ] Add `404.html` (GitHub Pages picks it up automatically) — simple branded page linking home.
- [ ] Verify favicon: pages don't declare one; browsers request `/favicon.ico` (404s now). Generate from `images/images.png` bluebird logo; add `<link rel="icon">` to all pages.
- [ ] Add GitHub Action to validate JSON on push — a stray comma in `results.json` silently blanks the Results page:
  ```yaml
  # .github/workflows/validate.yml
  # on: push → for f in data/*.json; do jq empty "$f"; done
  ```
- [ ] Remove the no-cache meta tags (`Cache-Control`, `Pragma`, `Expires`) from all pages — they fight normal caching; the `?v=1` query strings + `Date.now()` fetch busting already handle staleness. Optional cleanup, low stakes.
- [x] ~~Set git identity on this machine~~ — DONE 2026-07-06 (GitHub no-reply email configured globally).

### 16. Security hardening for mobile editing
**Status:** TODO · **Priority:** High · **Effort:** Small

Approved by Tommy 2026-07-06. With Pages CMS (task 14), the GitHub account is the only door — the CMS has no separate password; it defers entirely to GitHub auth + repo write access. These steps secure that door for bleacher editing on public wifi.

**Tommy's actions (5 min on phone, do before/during CMS setup):**
- [ ] Add a passkey to GitHub account (github.com/settings/security) — log in with Face ID, nothing typed over public wifi, phishing-proof.
- [ ] Confirm 2FA is enabled; download recovery codes and store in iCloud Keychain (recovery path if phone is lost at a meet).
- [ ] When installing the Pages CMS GitHub App, scope it to **only** `thmeyn/isla_athlete` — not "all repositories" — so worst-case blast radius is one public site.

**Claude's action:**
- [ ] Delete the fake admin login (task 13 — decided, execute it). Client-side password check is security theater and the footer link advertises it.

Out of scope (discussed, Tommy's call, not tracked): switching contact email to a parent-monitored address; confirming Coach Brady consents to her personal email being published in `data/endorsements.json`.

---

## Design principles (apply to all work)

- **Restraint is the brand.** The current aesthetic — big type, red/dark palette, generous whitespace — is good. Add information density, not decoration.
- **Every number verifiable.** Times link to MileSplit/RaceRoster wherever possible.
- **No manufactured hype.** Per coach feedback, division-neutral language only (already removed "Division I Prospect"). Facts pop harder than adjectives.
- **Mobile first-class.** Coaches open texted links on phones. Test every change at 375px width.

## Progress log

| Date | Task | Notes |
|------|------|-------|
| 2026-07-06 | — | File created. Tasks 1–14 catalogued from full site review. |
| 2026-07-06 | Task 14 added | Pages CMS for no-code editing (old task 14 → 15). Chosen over Decap (needs OAuth server) and paid options (CloudCannon, Squarespace) — free and purpose-built for GitHub Pages + JSON. |
| 2026-07-06 | Task 16 added | Security hardening approved: passkey + 2FA + scoped app install (Tommy), delete fake admin login (Claude). Task 13 decision made: retire admin panel. Git identity configured (15 partial). |
