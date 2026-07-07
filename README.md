# HappyMonthsary 🌻

A cute, animated **Happy Monthsary** greeting in a single self-contained web page
(`index.html`). Tap to open, then confetti and falling sunflowers, an animated title, a
live *months / weeks / days together* counter, and your personal message.

Perfect for **sending online as a link** or **screen-sharing on iOS**. It opens
full-screen in Safari with no external dependencies.

## Personalize it
Open `index.html` and edit the **CONFIG** block near the bottom (inside `<script>`):

```js
const CONFIG = {
  PARTNER_NAME: "Ms.D",           // what you call her (shown on the card)
  FULL_NAME:    "Dona",           // her real name (used in the journal)
  ANNIVERSARY:  "2026-04-19",     // YYYY-MM-DD you got together
  MONTHS:       "auto",           // a number, or "auto" to compute from the date
  SUBTITLE:     "to my favorite person 🥰",
  MESSAGE:      `your heartfelt note here...`,
  SIGN:         "Always yours 🌻",
  JOURNAL_FOOT: "…and so many more to come. 💕",
  MUSIC_SRC:    "",               // e.g. "our-song.mp3" (leave "" for none)

  // Journal photo prints. Leave "src" empty for a placeholder frame.
  JOURNAL: [
    { src: "", caption: "our first date", note: "The day it all began..." },
    // add as many entries as you like
  ]
};
```

- **Monthsary number:** leave `MONTHS: "auto"` to compute it from `ANNIVERSARY`,
  or set a fixed number.
- **Music:** put an audio file next to `index.html` and set `MUSIC_SRC` to its
  name. It starts on the first tap (iOS blocks autoplay before a tap) and a
  mute button appears.
- **Photos:** add each memory to `JOURNAL` with a `caption` and `note`. Set
  `src` to a filename (e.g. `photos/first-date.jpg`) or a `data:` URI when you
  have the picture; until then it shows a "📷 add photo later" placeholder.

## Preview locally
Just double-click `index.html`, or serve it:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Share it
- **Live link (auto-deployed):** every push to `main` is published to GitHub
  Pages by `.github/workflows/deploy-pages.yml`, so the greeting is live at
  **https://kjell09.github.io/sunshine/**. Text her that URL.
- **iOS screen share:** open the link (or the file) in Safari and share your
  screen; it fills the display.
- **Offline:** AirDrop `index.html` to her phone; it works with no internet
  (unless you added music, which needs the audio file alongside it).

## Tests
Automated tests keep the greeting correct as the project grows:

- `tests/logic.spec.js`: deterministic unit tests of the date/ordinal helpers
  (monthsary count, days-together, ordinal suffixes), with an injected date.
- `tests/greeting.spec.js`: end-to-end tests of the rendered page (tap-to-open
  reveal, title + counter, journal photo prints and notes, no console errors,
  no horizontal scroll on mobile).

Run them locally:

```bash
npm install
npx playwright install chromium   # first time only
npm test
```

CI (`.github/workflows/ci.yml`) runs the full suite on every push to `main`
and on every pull request.
