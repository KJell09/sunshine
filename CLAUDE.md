# Sunshine 🌻 — project context

A cute, self-contained **anniversary** greeting web page made for a partner
("Ms.D"). Currently themed as a **first anniversary**; the concept will keep
expanding with new ideas over time.

## What it is
- A single self-contained `index.html` (inline CSS + JS, no external requests)
  so it works as a shared link, offline, or full-screen in Safari for iOS
  screen sharing.
- Flow: a full-screen **tap-to-open** start screen → the greeting card (title,
  a live **years / months / days together** counter, a personal message,
  signature) → a scrollable **"Our Little Journal"** of taped polaroid-style
  photo prints, each with a date stamp, caption, and handwritten note → a soft
  acoustic background song that starts on the open tap (with a mute button).
- Theme: sunflowers + yellow (her favorites). Warm seed-brown text, sunflower
  gold + deep amber accents, leaf-green secondary. Falling sunflowers/petals.

## Live site
- Published to GitHub Pages on every push to `main` via
  `.github/workflows/deploy-pages.yml`.
- URL: **https://kjell09.github.io/sunshine/** (repo is named `sunshine` so the
  link does not spoil the surprise).

## Key files
- `index.html` — the whole greeting. All personalization is in the `CONFIG`
  object near the bottom of `<script>`: `PARTNER_NAME`, `ANNIVERSARY`,
  `ANNIVERSARY_YEAR` (number or `"auto"`), `SUBTITLE`, `MESSAGE`, `SIGN`,
  `JOURNAL_FOOT`, `MUSIC_SRC`, and `JOURNAL` (array of `{src,date,caption,note}`).
- `photos/` — web-optimized journal images (max ~1000px, EXIF-oriented).
- `music/love-song.wav` — a Karplus-Strong plucked arrangement of *Plaisir
  d'amour* (1784, public domain).
- `tests/` — Playwright suite (`logic.spec.js`, `greeting.spec.js`).
- Pure date/logic is exposed on `window.MSARY` so it can be unit-tested in the
  browser with an injected `now` while `index.html` stays a single file.

## Conventions / constraints
- Keep `index.html` a **single self-contained file** (inline everything; embed
  assets by path in `photos/` and `music/`, or as `data:` URIs).
- **Music must be copyright-free** — public-domain compositions or tracks the
  owner has rights to. No modern popular songs (their melody/composition is
  copyrighted even as an instrumental cover). Use WAV or MP3 for iOS Safari.
- **No em dashes** in any user-facing copy.
- Mobile-first; respect `prefers-reduced-motion`; escape any hand-written text
  before it goes into `innerHTML`.
- Photos: optimize before committing (there is no ImageMagick/ffmpeg here; the
  headless Chromium at `/opt/pw-browsers/chromium` can resize/re-encode).

## Run & test
```bash
npm install
npx playwright install chromium   # first time only (a browser is preinstalled here)
npm test                          # runs the Playwright suite
python3 -m http.server 8000       # preview locally at http://localhost:8000
```
CI (`.github/workflows/ci.yml`) runs the suite on every push to `main` and PR.

## Workflow
- Develop on a feature branch, open a PR into `main`, and merge; merging to
  `main` auto-deploys to Pages. Verify changes by running the tests and
  rendering `index.html` in the headless browser (screenshot) before shipping.
