---
name: video-highlights
description: Process rough race clips into stylized hero-rotation footage for islameyn.com. Use when Tommy drops clips in videos-inbox/ or asks to add, edit, or swap site video.
---

# Race clip pipeline

Turns rough iPhone clips into short, muted, grayscale highlights that rotate in the homepage hero. Proven end-to-end 2026-07-06 with two clips. Tommy's intent: video is **ambiance that makes the site more appealing**, not a footage library. He removed the labeled "Race Footage" section on the Results page; hero rotation only. Restraint rules: short clips, no sound, everything matched to a verified result.

## Folders

- `videos-inbox/` (gitignored): rough originals from Tommy.
- `video-review/` (gitignored): trimmed candidates + posters for his approval. Open them for him: `open video-review/<clip>.mp4` (QuickTime).
- `videos/` (committed): processed clips the site serves.

## Pipeline

1. **Identify**: `ffprobe -print_format json -show_format -show_streams` → creation date (`com.apple.quicktime.creationdate`) → match to a meet in `data/results.json`. If metadata is stripped, identify from content.
2. **See the clip** (you can't watch video; you can read frames):
   - Whole-clip contact sheet: `ffmpeg -i IN -vf "fps=16/DURATION,scale=380:-1,tile=4x4" -frames:v 1 sheet.jpg`, then Read it.
   - Refine the action window at 1 fps: `-ss START -t LEN -vf "fps=1,scale=380:-1,tile=4x3"`.
   - You're looking for: where Isla enters, the closest/biggest moment, the exit; camera steadiness; whether other identifiable kids are prominent (public-race standard applies, same as photos).
3. **Cut + process** (~10s max, ending on the payoff):
   `ffmpeg -ss START -t LEN -i IN -vf "deshake=rx=32:ry=32" -an -c:v libx264 -preset slow -crf 23 -movflags +faststart OUT.mp4`
   - This machine's ffmpeg has NO vidstab; `deshake` is the available stabilizer.
   - `-an` always: race audio is wind/crowd noise.
   - Target ≤5MB per clip (≈10s 720p at crf 23).
4. **Mobile variant**: phones cover-crop the wide frame, so distant footage reads as empty. Cut a tighter sub-clip of just the close-up seconds: `ffmpeg -ss X [-t Y] -i OUT.mp4 -an -c:v libx264 -preset slow -crf 23 -movflags +faststart OUT-mobile.mp4`.
5. **Poster** (for review, and if a clip is ever placed with controls): `ffmpeg -ss T -i OUT.mp4 -frames:v 1 -q:v 3 poster.jpg`.
6. **Review gate**: candidates to `video-review/`, `open` them, wait for Tommy's approve/re-cut/drop. Never push unapproved cuts.

## Hero rotation (already built, in index.html)

- Markup: `#heroMedia` holds `.hero-slide` elements (one `img` + N `video muted playsinline preload="none"`), each video with `data-src-mobile`. Gradient overlay div stays last.
- CSS (inline `<style>` in index.html): `.hero-slide` absolute cover, opacity 0→0.6 on `.hero-active`, 1.2s fade, `filter: grayscale(1)` **locked — Tommy explicitly killed the hover color reveal ("it is flipping to full color")**. Grayscale also unifies mismatched venues (red track / blue track / night photo).
- JS (inline script, index.html): rotation starts after `load` + 7s of the still; videos advance on `ended`; next slide's `preload` flips to `auto` one step ahead; `prefers-reduced-motion` gets the still only; on `max-width: 767px` swaps in `data-src-mobile` and runs a rAF pan (`objectPosition` 0→100% synced to playback) because she travels left→right.
- Adding a clip = add one `<video>` line with both srcs; the script picks it up. Keep total rotation under ~40s and repo video weight reasonable (if it grows past ~30MB, revisit YouTube/MileSplit embeds).

## Placement principles

- Hero rotation is THE video surface. No labeled video sections (tried, removed by Tommy).
- New clips must map to a verified result in `data/results.json`.
- The still photo stays first in rotation (instant LCP; videos never block first paint).
- After any change: verify locally, push, watch deploy, curl-verify live (see IMPROVEMENTS.md working notes; bump `?v=` on tailwind.css only if Tailwind classes changed — the hero CSS/JS is inline in index.html so no bump needed).
