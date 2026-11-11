# islameyn.com

Recruiting profile site for Isla Meyn, Class of 2028 distance runner at Highlands High School (Fort Thomas, KY). Built for college coaches: verified results, meet schedule, academics, and references.

**Live site:** [islameyn.com](https://islameyn.com)

## Site map

| Nav | Page | File |
|---|---|---|
| Bio | Homepage: bio, key stats, page links | `index.html` |
| Athletics → Results | Personal bests, progression chart, every meet | `profile.html` |
| Athletics → Schedule | Upcoming and completed meets, calendar subscribe | `schedule.html` |
| Academics | GPA, coursework, activities | `achievements.html` |
| References | Coach and teacher references, honors | `endorsements.html` |
| (Printable Profile button) | One-page printable summary | `one-pager.html` |

`404.html` is the not-found page. Navigation, the Athletics sub-tabs, and the bottom page-link row are written out by hand in each page, so a nav change means editing all five main pages.

## Content

All content lives in `data/` and is rendered in the browser by an inline `<script>` in each page. Edit it through **Pages CMS** (config in `.pages.yml`), which commits straight to `main`, or edit the JSON by hand.

| File | CMS label | Used by |
|---|---|---|
| `data/results.json` | Meet Results | Results page, homepage stats, one-pager PRs |
| `data/schedule.json` | Schedule | Schedule page, `calendar.ics` |
| `data/academics.json` | Athletic Achievements | Honors on References page and one-pager (the filename is historical; these are athletic honors) |
| `data/academics-page.json` | Academics Page | Academics page, homepage GPA stat, one-pager academics |
| `data/endorsements.json` | Endorsements | References page, one-pager quotes |

Rules of the road:

- **Every number must be verifiable.** Times, places, and dates come from MileSplit, KHSAA, or RaceRoster, with the source linked. The `verify-results` skill in `.claude/skills/` describes the audit.
- **Personal Record badges are computed** on the Results page. Don't add `pr` by hand.
- **Raced meets stay on the schedule** with status `completed`; meets she didn't run are removed.
- **No em dashes** in site copy.

## Automation (GitHub Actions)

- **Validate data files** (`validate.yml`): on any `data/*.json` change, checks JSON syntax, required fields, and time format (`M:SS` or `M:SS.hh`).
- **Venue lookup** (`venue-lookup.yml`): on `data/schedule.json` changes, `scripts/update-venues.mjs` fills in venue addresses from MileSplit for upcoming meets, then `scripts/build-calendar.mjs` rebuilds `calendar.ics`. Failed lookups open a GitHub issue.

## Styling

- `css/styles.css` holds the design tokens (colors, spacing, heading sizes) and custom components. Bump its `?v=` cache-bust in the page `<link>` tags after editing it.
- `css/tailwind.css` is a compiled, minified Tailwind build that only contains classes already used in the HTML. After adding a new Tailwind class, rebuild with `npm run build:css` (or write the rule in `styles.css`).
- Charts use Chart.js 4.4.1 from jsDelivr.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Pages fetch `data/*.json`, so opening the HTML files directly from disk won't work.

## Hosting

GitHub Pages (Jekyll) from `main`, custom domain via `CNAME`. Every push deploys in a minute or two. `_config.yml` keeps working files (this README, `IMPROVEMENTS.md`, `scripts/`, build config, media inboxes) off the public website; they are still visible in the GitHub repo while it is public.

Working notes and the progress log are in `IMPROVEMENTS.md`.
