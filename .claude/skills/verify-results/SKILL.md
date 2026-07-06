---
name: verify-results
description: Audit data/results.json against primary sources (MileSplit, KHSAA, RaceRoster), correct errors, and add missing results. Use when new results are added manually, after a season ends, or when asked to verify/audit race results.
---

# Verify and correct race results

Audits every entry in `data/results.json` against primary sources, fixes discrepancies, and adds anything missing. First run (2026-07-06) found 1 wrong date, 1 wrong relay time, and 13 missing results in otherwise hand-entered data, so assume human error until verified.

**Site principle: every number verifiable.** Never publish a time, place, or date that a primary source doesn't back. If a claim can't be verified, say so to Tommy rather than guessing.

## Sources of truth, in order of preference

1. **Her MileSplit profile stats** (individual events): https://ky.milesplit.com/athletes/15029501-isla-meyn/stats
   - Filter tabs (All / XC / Indoor / Outdoor) are `<button>` elements; click each and re-read, the page shows only one filter at a time.
   - Result rows link to the exact meet result pages; harvest those links for the `link` field.
   - The PR panel on this page must match the site's computed PRs exactly (see Cross-checks).
2. **Meet result pages** (relays, and anything not attributed to her profile): MileSplit `/results/<id>/formatted` or `/raw`. Relays are NOT attributed to athlete profiles; search the meet page for "Highlands" in the event section.
3. **KHSAA** for state meets MileSplit didn't post: `https://khsaa.org/track/<year>/class3adetailed.htm` (also `class3ateam.htm` etc.).
4. **RaceRoster** for road races (Firecracker 5k). JS-rendered; needs browser access, or Tommy pastes the row.

## Browser access (required for paywalled/JS content)

Tommy has MileSplit Pro in Chrome. Ask him to send a message starting with `@browser` to attach the Claude-in-Chrome tools, then drive his logged-in session.

Quirks learned the hard way:
- `ky.milesplit.com` allows JS execution and page reads. `oh.milesplit.com` sometimes denies them (permission varies); `www.milesplit.com` navigation is blocked entirely. Fallback: `WebFetch` works fine for meet-info headers (venue/date/city) on all subdomains, and for article headlines outside the paywall.
- Meet "Results" pages are often a list of result-file links; follow to `/formatted` or `/raw`.
- Extract efficiently with `javascript_tool`: grab `document.body.innerText`, find the event section header (e.g. "Girls 4x800"), slice a window, and search for "Highlands"/"Meyn". Relay sections run ~6000 chars; don't use a small window.
- Batch navigate+extract pairs with `browser_batch`.

## Procedure

1. **Pull the site's current data**: load `data/results.json`; compute per-event PRs and counts with a small python script.
2. **Individual events**: read all four filter tabs of her profile stats page. Build the authoritative list of (event, time, place, meet, date). Diff against the site data programmatically, not by eye.
3. **Relays**: for every relay entry on the site, open that meet's result page and confirm team time + place. For seasons where the team qualified for region/state, check those meet pages for relay entries missing from the site.
4. **Road races**: verify against the RaceRoster links already in the data.
5. **Fix errors exactly** (times to the centisecond, places, dates; MileSplit multi-day meets like "Sep 19-20" — site uses the race day).
6. **Add missing results** with: meetName, ISO date, location (get venue from the meet-info page; do not guess; venues change year to year, e.g. Campbell County 2025 was at Bishop Brossart, 2026 at Tower Park), link (direct result-file URL), events with exact times/places.
7. **Validate and ship**: `python3 -m json.tool data/*.json`, verify all new links return 200, commit with a message listing verified/fixed/added, push, watch the deploy (see IMPROVEMENTS.md working notes for the flaky-deploy retry), and curl the live site to confirm.

## Cross-checks after any change

- **PR panel parity**: site-computed PRs (min time per event) must equal MileSplit's PR panel: as of 2026-07-06 — 800m 2:49.52, 1600m 5:21.66, 3200m 15:03.50, 5K 20:14.90 (plus Road 5k 19:46 and 4x800 9:43.89 which MileSplit's panel doesn't show).
- **New event names** appear in the Results page PR strip automatically, but add them to `PR_ORDER`/`PR_LABELS` in `profile.html` for proper ordering/labels.
- **Badges** (`notable`): `sq` = state qualifier (that performance qualified, including at-large), `pr` = personal record at the time it was run, any other string renders as a purple badge. Don't fabricate; a badge is a claim.
- **Sport groups**: Track & Field, Cross Country, Indoor Track, Road Racing. Fall track events (e.g. the October Freshman Regionals 3200m) go under Track & Field.
- Rendering sorts by date, so entry order in the file doesn't matter.

## Reporting

Summarize as: verified exact (count), corrected (each with old → new and source), added (each with source), unverifiable (needs Tommy). Log the audit in IMPROVEMENTS.md's progress log. No em dashes in any site copy.
