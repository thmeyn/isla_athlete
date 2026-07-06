# Site Improvement Plan

Working backlog for islameyn.com. Goal: **catch a college recruiter's eye without being busy or overwhelming.** Recruiters skim for ~30 seconds looking for grad year, events, PRs, GPA, and proof — every change should serve that scan.

**How to use this file:** Each task has a status, priority, and implementation plan. Update the status line when starting/finishing work. Add notes under a task as decisions are made.

Statuses: `TODO` · `IN PROGRESS` · `DONE` · `DEFERRED`

---

## Phase 1 — Credibility fixes (do first)

### 1. Remove placeholder content site-wide
**Status:** DONE (2026-07-06) · **Priority:** Critical · **Effort:** Small

Fake-looking template content undermines everything real on the site.

- [x] `data/endorsements.json` — deleted the 4 placeholder entries; only Coach Savannah Brady's real letter remains.
- [x] `achievements.html` — removed the Awards & Honors section (two "Award Name" placeholder cards). Re-add the section when real academic awards exist.
- [x] Extracurricular Leadership section — Tommy confirmed all three entries were template leftovers; section removed.
- [x] SAT card ("1520") on achievements.html — Tommy confirmed placeholder (she hasn't taken the SAT yet); removed. Class rank 50/240 confirmed real and kept. **Re-add SAT card when she has a real score.**
- [x] Grepped site for remaining artifacts — clean.

### 2. Restore homepage identity (hero headline)
**Status:** DONE (2026-07-06) · **Priority:** Critical · **Effort:** Small

- [x] Hero h1 "Isla Meyn" + subhead "Distance Runner · Highlands High School · Fort Thomas, KY" + factual blurb (5:21 mile, state qualifier, 4.5 weighted GPA).
- [x] Bio rewritten from **Isla's own draft** (she wrote two; draft 1 chosen): rising junior, 4.509 weighted GPA, 4 AP exams passed, state-qualifying 4x800 freshman + sophomore years, freshman MVP, ~3.5-min XC improvement, MileSplit Most Improved feature, Tekluve + D1 Training, YMCA lifeguard/swim instructor.
- [x] Copy style note from Tommy: **no em dashes** — reads as AI-written. Applied site-wide to Claude-drafted copy.
- [x] Bonus fixes: stat numbers were rendering at 16px site-wide (`font-display-xl` class never existed — real Tailwind sizes now used); hero `h-[921px]` → `min-h-[85vh]`.
- [x] GPA updated everywhere to current: 4.509 weighted / 3.966 unweighted.
- [x] Recognition & Awards restored on endorsements page with first real entry: MileSplit KY "Most Improved Girls" XC feature, linked (paywalled but headline/tag visible; upgrade to exact rank if Pro access obtained).
- [x] Community Involvement section on academics page: YMCA lifeguard/swim instructor + Camp Ernst summer lifeguard (camper there since age 8).

### 3. Populate the schedule for fall XC season
**Status:** DONE (2026-07-06, preliminary) · **Priority:** Critical · **Effort:** Small

- [x] Preliminary fall 2026 XC schedule from Tommy — 7 meets (8/29 through State 10/31) in `data/schedule.json`.
- [x] 9/5 entry is a squad split (Run for the Gold vs. Ryle Invitational) — marked `status: "tentative"`; update to the actual meet once decided.
- [x] MileSplit links added for SNL, Trinity Valkyrie, Bluegrass, and Conference (2026-07-06). Conference identified on MileSplit as NKAC/St. Henry Invite, Burlington 10/10.
- [ ] Follow-ups as season firms up: Regional location + link (KHSAA not yet posted), State link (not yet posted), resolve 9/5 squad split — links ready for both: Run for the Gold `ky.milesplit.com/meets/733745` (MileSplit lists it in Boston, KY, not Hardin County — verify), Ryle Invite `ky.milesplit.com/meets/755559`.

---

## Phase 2 — Recruiter-scan features

### 4. Personal Bests strip (auto-computed)
**Status:** DONE (2026-07-06) · **Priority:** High · **Effort:** Medium

- [x] `renderPRs()` inline in `profile.html`, reuses `parseTime()`. PR strip renders above the tabs: 1600m · 5K Cross Country · 5K Road · 4x800m Relay, each with time, meet, and date. New events appear automatically after the featured four (PR_ORDER/PR_LABELS constants).
- [x] Homepage Key Stats echo PRs (task 12).
- [x] All current timeScore values verified parseable.

### 5. Link MileSplit / Athletic.net profiles
**Status:** DONE (2026-07-06) · **Priority:** High · **Effort:** Small

- [x] MileSplit profile linked: `ky.milesplit.com/athletes/15029501-isla-meyn` — "MileSplit Profile →" under homepage Key Stats, "Verify on MileSplit →" in Results page hero.
- [ ] Athletic.net profile: not provided; add later if she has one.

### 6. Surface the PDF one-pager
**Status:** TODO · **Priority:** High · **Effort:** Small

`docs/Meyn-Isla.pdf` exists but is linked nowhere. Coaches forward one-pagers internally.

- [ ] Check the PDF content is current (it's from May 2026 — predates state championship results and Firecracker 5k win). Flag to Tommy if stale.
- [ ] Add a "Download Athletic Profile (PDF)" button — suggest homepage hero area and/or nav Contact area. One prominent placement, not five.

### 7. Open Graph / social preview tags
**Status:** DONE (2026-07-06) · **Priority:** High · **Effort:** Small

- [x] OG + description meta on all 5 pages, per-page titles/descriptions, `og:image` = `images/og-image.jpg` (1200×630 crop of hero photo).
- [ ] Swap og-image for a stronger race photo when task 8 delivers; re-validate with an OG preview tool.

### 8. Add race photos
**Status:** TODO · **Priority:** High · **Effort:** Small (needs photos from Tommy)

One photo site-wide (`images/IMG_5202.jpg`). Visual proof matters more than copy.

- [ ] Get 2–3 photos from Tommy: finish line, relay handoff, podium/medal moments.
- [ ] Placement suggestions: bio section in `index.html` (currently text-only next to Key Stats), endorsements page header, achievements page. Keep it restrained — one photo per page beyond the homepage.
- [ ] Optimize before committing (see task 10 — same pipeline).

---

## Phase 3 — Infrastructure & hygiene

### 9. Replace Tailwind CDN with precompiled CSS
**Status:** DONE (2026-07-06) · **Priority:** Medium · **Effort:** Medium

Done via `npx tailwindcss@3.4.17` (matches CDN v3 behavior; no node_modules). `css/tailwind.css` (12.7KB min) linked after styles.css on all pages. Rebuild with `npm run build:css` after adding new Tailwind classes. All pages visually verified against pre-swap screenshots. Original plan below for reference:

All pages load `https://cdn.tailwindcss.com` — the dev-only, compile-in-browser build. Slow, logs a console warning, breaks if CDN is unreachable.

Implementation plan:
- [ ] Install Tailwind standalone CLI (no node_modules needed: `brew install tailwindcss` or download binary).
- [ ] Create `tailwind.config.js` capturing the custom tokens currently used in class names (`font-label-bold`, `text-headline-md`, `bg-surface`, `margin-mobile`, `container-max`, etc.). **Audit `css/styles.css` first** — the design tokens (CSS vars like `--secondary`) live there; the config must map Tailwind utilities to them.
- [ ] **KNOWN GOTCHA (discovered 2026-07-06):** many typography classes in the HTML (`font-display-xl`, `text-display-xl`, `text-headline-md`, `text-label-bold`, `font-body-lg`, etc.) are defined NOWHERE — styles.css defines `.display-xl` (no `font-`/`text-` prefix) and the CDN has no config, so they're silent no-ops. The visible design comes from styles.css element/utility rules plus real Tailwind utilities. Stat numbers were fixed 2026-07-06 with real utilities (`text-5xl font-black`). When precompiling, either define these tokens in the config or sweep the no-op classes from the HTML — do NOT assume they currently do anything.
- [ ] Build: `tailwindcss -i css/styles.css -o css/tailwind.css --minify` scanning `*.html`.
- [ ] Replace the CDN `<script>` tag with `<link rel="stylesheet" href="css/tailwind.css">` on all 5 pages (admin pages deleted 2026-07-06).
- [ ] Add build command to `package.json` scripts. Document in README: "run `npm run build:css` after adding new Tailwind classes."
- [ ] Verify visually on every page before committing — the CDN build allows arbitrary classes; the compiled build only includes classes present at build time. Dynamic classes built in JS strings (e.g. in `profile.html` render functions) must be safelisted or present in scanned files.

### 10. Optimize hero image
**Status:** DONE (2026-07-06) · **Priority:** Medium · **Effort:** Small

- [x] No WebP encoder on this machine (no cwebp/ImageMagick; sips won't write webp). Used optimized JPEG instead: `images/hero.jpg`, 1600px q55, 234KB (from 458KB) — artifacts hidden by the hero's dark overlay. Original kept as `IMG_5202.jpg` for future re-encodes.
- [x] `width`/`height` + `fetchpriority="high"` on hero img; `min-h-[85vh]`.
- [ ] Same pipeline for any new photos (task 8): `sips -Z 1600 -s format jpeg -s formatOptions 55`.

### 11. Fix js/main.js bugs
**Status:** DONE (2026-07-06) · **Priority:** Medium · **Effort:** Small

- [x] Deleted the contact-button block (invalid `:contains` selector that threw on every page load).
- [x] Deleted the `Element.prototype.contains` override.
- [x] Deleted the performance-timing logger.
- [x] Deleted the unused IntersectionObserver / `[data-animate]` block. If subtle fade-ins are wanted later, reintroduce deliberately as part of a design pass.

### 12. Derive Key Stats from data (stop hardcoding)
**Status:** DONE (2026-07-06) · **Priority:** Medium · **Effort:** Small

- [x] Homepage Key Stats now 4 cells: 1600m PR, 5K PR (best of XC + road), podium count, weighted GPA. First three computed from `results.json` on load (inline script in `index.html`); static markup values remain as fallback if fetch fails.
- [x] Hardcoded "12 Podium Finishes" was wrong — verifiable count is 10.
- [ ] Optional later: `data/profile.json` for bio-level facts (GPA, grad year, MileSplit URL) — revisit with Pages CMS setup (task 14).

### 13. Retire the admin panel
**Status:** DONE (2026-07-06) · **Priority:** Medium · **Effort:** Small

**Decided 2026-07-06: retire it** (Tommy approved as part of security hardening, task 16). `admin/panel.html` edited localStorage only — changes never reached the live site. The password gate was client-side (hash visible in source). Pages CMS (task 14) replaces it.

- [x] Deleted `admin/`, `admin-login.html`, and `login.html`.
- [x] Removed the "Secure Access" footer link from `index.html` **and** `endorsements.html` (grep found it in both).
- [x] Verified no remaining references and all pages return 200 locally; deleted pages 404.

### 14. Pages CMS for no-code content editing
**Status:** DONE (2026-07-06) · **Priority:** Medium · **Effort:** Medium

Replace the "edit JSON + git push" workflow with [Pages CMS](https://pagescms.org) — free, git-backed, hosted UI with mobile-friendly forms. Every save commits to the repo → GitHub Pages auto-deploys. Tommy can add a meet result from his phone at the meet.

Implementation plan:
- [x] `.pages.yml` written 2026-07-06 (schemas for all four data files, verified field names, badge conventions documented in field descriptions). Validate against Pages CMS on first login; original schema notes below:
  - `data/results.json` — fields: season, sport (select: Track & Field / Cross Country / Road Racing), meetName, date, location, link, events (list: eventName, timeScore, place, notable list — `sq` renders "State Qualifier" badge, `pr` renders "Personal Record", any other string renders as-is in a purple badge; document in field descriptions)
  - `data/schedule.json` — fields: season, sport, eventName, location, date, status (select: upcoming / tentative — status text renders as the card badge), link (optional)
  - `data/academics.json` — fields: awardName, description, date, category (currently all "athletic"; renders on Results page Achievements tab, despite the filename)
  - `data/endorsements.json` — fields: quote, name, title, email, fullLetter (textarea, optional; `\n\n` splits paragraphs)
- [ ] Validate the schema shapes against the render functions in `profile.html`, `schedule.html`, `endorsements.html` before finalizing (field names must match exactly).
- [x] GitHub App installed by Tommy; forms render all four content types.
- [x] Round-trip verified live: CMS save committed a location fix, deployed, rendered. CMS normalizes JSON (pretty-print, drops empty notable arrays) — harmless. Renderers now sort by date so CMS append-order never matters.
- [ ] Coordinate with task 12: if bio-level facts (GPA, grad year, MileSplit URL) move to `data/profile.json`, add it to `.pages.yml` too so nearly all content is CMS-editable. Coursework lists in `achievements.html` remain HTML-only unless also migrated.
- [ ] Update README with the new editing workflow (admin panel already retired, task 13).

### 15. Deploy hygiene: 404, favicon, JSON validation
**Status:** DONE (2026-07-06) · **Priority:** Low · **Effort:** Small

- [x] Branded `404.html` (self-contained inline styles, noindex).
- [x] Favicon `<link rel="icon">` (bluebird png) on all pages.
- [x] `.github/workflows/validate.yml`: jq syntax check + required-field assertions on `data/*.json` pushes.
- [x] No-cache meta tags removed from all pages.
- [x] Git identity configured (GitHub no-reply email).

### 16. Security hardening for mobile editing
**Status:** TODO · **Priority:** High · **Effort:** Small

Approved by Tommy 2026-07-06. With Pages CMS (task 14), the GitHub account is the only door — the CMS has no separate password; it defers entirely to GitHub auth + repo write access. These steps secure that door for bleacher editing on public wifi.

**Tommy's actions (5 min on phone, do before/during CMS setup):**
- [ ] Add a passkey to GitHub account (github.com/settings/security) — log in with Face ID, nothing typed over public wifi, phishing-proof.
- [ ] Confirm 2FA is enabled; download recovery codes and store in iCloud Keychain (recovery path if phone is lost at a meet).
- [ ] When installing the Pages CMS GitHub App, scope it to **only** `thmeyn/isla_athlete` — not "all repositories" — so worst-case blast radius is one public site.

**Claude's actions:**
- [x] Deleted the fake admin login (task 13, 2026-07-06).
- [x] Contact email switched to dedicated shared recruiting address `isla.meyn2028@gmail.com` (2026-07-06) — parent+athlete access, keeps scrapers out of her personal inbox.

Still open (Tommy's call, not tracked): confirming Coach Brady consents to her personal email being published in `data/endorsements.json`.

---

## Design principles (apply to all work)

- **Restraint is the brand.** The current aesthetic — big type, red/dark palette, generous whitespace — is good. Add information density, not decoration.
- **Every number verifiable.** Times link to MileSplit/RaceRoster wherever possible.
- **No manufactured hype.** Per coach feedback, division-neutral language only (already removed "Division I Prospect"). Facts pop harder than adjectives.
- **No em dashes in site copy** (Tommy, 2026-07-06): reads as AI-written. Use commas, periods, or restructure. Arrows (→) in UI links are fine.
- **Mobile first-class.** Coaches open texted links on phones. Test every change at 375px width.
- **Recognition bar** (set 2026-07-06 during MileSplit sweep): All-State selections and awards always in; class-scoped rankings roughly top-15 in; deeper rankings, watch lists, weekly-marks roundups out.

## Working notes (for any session picking this up)

- **Run locally:** `python3 -m http.server 8000` from the repo root, then http://localhost:8000. Static site, no build step (until task 9).
- **Deploy:** push to `main` → GitHub Pages "pages build and deployment" workflow → live at islameyn.com in ~1 min. **Deploys flake intermittently** (build succeeds, deploy step fails, ~3x on 2026-07-06). Fix: `git commit --allow-empty -m "Retry Pages deploy" && git push`. Watch status: `curl -s "https://api.github.com/repos/thmeyn/isla_athlete/actions/runs?per_page=1"` (no auth needed; `gh` is not installed on this machine).
- **Verify live after every push** by curl-grepping islameyn.com for the new content; don't trust the workflow status alone (runs occasionally report under the prior commit's SHA).
- **Content lives in** `data/*.json` (results, schedule, academics = athletic achievements, endorsements); rendering is inline `<script>` in each page's HTML, not in js/main.js. Validate JSON before pushing: `python3 -m json.tool data/*.json`.
- **Facts:** Isla Meyn, Highlands HS, Fort Thomas KY, Class of 2028 (rising junior fall 2026). GPA 4.509 weighted / 3.966 unweighted (as of July 2026). Contact: isla.meyn2028@gmail.com (shared parent/athlete recruiting address). MileSplit: ky.milesplit.com/athletes/15029501-isla-meyn.
- **Copy review:** Tommy reviews all user-facing copy before push; he and Isla have final voice.

## Progress log

| Date | Task | Notes |
|------|------|-------|
| 2026-07-06 | — | File created. Tasks 1–14 catalogued from full site review. |
| 2026-07-06 | Task 14 added | Pages CMS for no-code editing (old task 14 → 15). Chosen over Decap (needs OAuth server) and paid options (CloudCannon, Squarespace) — free and purpose-built for GitHub Pages + JSON. |
| 2026-07-06 | Task 16 added | Security hardening approved: passkey + 2FA + scoped app install (Tommy), delete fake admin login (Claude). Task 13 decision made: retire admin panel. Git identity configured (15 partial). |
| 2026-07-06 | Tasks 1, 11, 13 DONE | Placeholders removed (incl. fake SAT score + extracurriculars, confirmed with Tommy), main.js bugs fixed, admin panel deleted. Claude's half of task 16 complete. |
| 2026-07-06 | Task 3 DONE | Preliminary fall XC schedule + MileSplit meet links. Recruiting email switched to isla.meyn2028@gmail.com site-wide. Class rank removed (competitive school, number undersells). |
| 2026-07-06 | Tasks 2, 4, 12 DONE | Hero identity, PR strip, derived stats. Bio from Isla's own draft. GPA current (4.509W/3.966UW). MileSplit Most Improved recognition added (featured-in phrasing; rank unverified behind paywall). Copy rule: no em dashes. Pages deploys flaky today (3 failures) — empty-commit retry works. |
| 2026-07-06 | Results verified vs MileSplit | Full audit of results.json against her MileSplit profile (browser session): 25/26 entries matched exactly; fixed one date (SNL 2024: 9/29→9/28). Added missing history: freshman outdoor 2025 (8 meets, incl. 800m 2:49.52 PR), fall 3200m 15:03.50 PR, freshman indoor 2025 (2 meets, new "Indoor Track" sport group). Site PRs now match MileSplit's PR panel exactly (800/1600/3200/5K). Podium count 10→14 (auto). Relay audit (same day): State 2026, Region 2026, NKAC 2026 verified exact; Campbell 2026 corrected 10:00.31→10:02.34 (typo). Added freshman relays from meet pages: Region 5 2025 4x800 10:14.25 6th (sq) and State 2025 4x800 10:19.56 19th (khsaa.org source; team was at-large qualifier after 6th at region). All results on the site are now verified against primary sources. |
| 2026-07-06 | Tasks 7, 9, 10, 15 DONE; 14a done | OG tags + og-image, precompiled Tailwind (12.7KB, CDN gone, visually verified), hero image 458→234KB, 404/favicon/JSON-validation action, .pages.yml written. Remaining on task 14: Tommy installs the GitHub App. |
| 2026-07-06 | Task 5 DONE; MileSplit sweep | MileSplit profile linked (homepage + results). Full review of her ~170 tagged MileSplit articles via Chrome extension (Tommy's Pro login): added All-State T&F 2nd Team + All-Sophomore (2026), All-State XC 3rd Team + All-Sophomore (2025), 2028 Distance Recruits 9th, Final Outdoor Rankings 9th/15th/29th, Most Improved (exact: 23:40.21→20:14.90). Skipped (verified below bar): Returning 5K #92, Impressive Soph #31, Overall 1600m #48, All Events #49, 2028 Returning #27 (stale), National 2028 #528. Hero now leads "All-State miler". Recognition bar: All-State/awards yes; rankings top-15 class-scoped yes; deeper skip. |
