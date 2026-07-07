# HappyMonthsary 🌻

A cute, self-contained **Happy Monthsary** greeting page (`index.html`) for Ms.D.
Tap to open, then falling sunflowers, an animated title, a live
*months / weeks / days together* counter, a personal message, a soft acoustic
love song, and a photo journal of your memories.

It's one file with no external dependencies, so it works as a shared link or
full-screen in Safari for iOS screen sharing.

## Live link
Every push to `main` is published to GitHub Pages by
`.github/workflows/deploy-pages.yml`:

**https://kjell09.github.io/sunshine/**

## Personalize it
Everything lives in the **CONFIG** block near the bottom of `index.html`
(inside `<script>`):

```js
const CONFIG = {
  PARTNER_NAME: "Ms.D",                    // what you call her (shown everywhere)
  ANNIVERSARY:  "2026-04-19",              // YYYY-MM-DD you got together
  MONTHS:       "auto",                    // a number, or "auto" to compute from the date
  SUBTITLE:     "to my sunshine 🌻",
  MESSAGE:      `your heartfelt note here...`,
  SIGN:         "Always yours 🌻",
  JOURNAL_FOOT: "…and so many more to come. 💛",
  MUSIC_SRC:    "music/love-song.wav",     // background song (leave "" for none)

  JOURNAL: [
    { src: "photos/first-date.jpg", date: "02-01-2026", caption: "our first date", note: "..." },
    // one entry per memory
  ]
};
```

- **Monthsary number:** `"auto"` computes it from `ANNIVERSARY`, or set a number.
- **Photos:** each `JOURNAL` entry takes a `src` (a file in `photos/`, or a
  `data:` URI), a `date` shown as a small stamp, a `caption`, and a `note`.
  Leave `src` empty for a "📷 add photo later" placeholder.
- **Music:** `MUSIC_SRC` points at an audio file. A soft acoustic arrangement of
  *Plaisir d'amour* (1784, public domain — the melody behind "Can't Help Falling
  in Love") ships in `music/love-song.wav`; swap in your own to change it. It
  starts on the first tap (iOS blocks autoplay until then) and a mute button
  appears. Use WAV or MP3 so iOS Safari can play it.

## Preview locally
Double-click `index.html`, or serve it (so the photos and song load):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Tests & CI
- `tests/logic.spec.js`: unit tests of the date/ordinal helpers, with an
  injected date so they're deterministic.
- `tests/greeting.spec.js`: end-to-end tests of the rendered page (tap-to-open
  reveal, title + counter, journal photos/notes/dates, no console errors, no
  horizontal scroll on mobile).

```bash
npm install
npx playwright install chromium   # first time only
npm test
```

CI (`.github/workflows/ci.yml`) runs the full suite on every push to `main` and
on every pull request.
