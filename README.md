# HappyMonthsary 💖

A cute, animated **Happy Monthsary** greeting in a single self-contained web page
(`index.html`). Tap to open → confetti + floating hearts, an animated title, a
live *months / weeks / days together* counter, and your personal message.

Perfect for **sending online as a link** or **screen-sharing on iOS** — it opens
full-screen in Safari with no external dependencies.

## Personalize it
Open `index.html` and edit the **CONFIG** block near the bottom (inside `<script>`):

```js
const CONFIG = {
  PARTNER_NAME: "my love",        // her name / nickname
  ANNIVERSARY:  "2026-01-06",     // YYYY-MM-DD you got together
  MONTHS:       6,                // which monthsary this is
  SUBTITLE:     "to my favorite person 🥰",
  MESSAGE:      `your heartfelt note here...`,
  SIGN:         "— always yours ❤️",
  MUSIC_SRC:    ""                // e.g. "our-song.mp3" (leave "" for none)
};
```

- **Music:** put an audio file next to `index.html` and set `MUSIC_SRC` to its
  name. It starts on the first tap (iOS blocks autoplay before a tap) and a
  mute button appears.
- **Photos:** optional — can be added later as embedded images.

## Preview locally
Just double-click `index.html`, or serve it:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Share it
- **Link (recommended):** enable **GitHub Pages** for this repo
  (Settings → Pages → Deploy from branch → `main` / root). You'll get a
  `https://<user>.github.io/HappyMonthsary/` URL to text her.
- **iOS screen share:** open the link (or the file) in Safari and share your
  screen — it fills the display.
- **Offline:** AirDrop `index.html` to her phone; it works with no internet
  (unless you added music, which needs the audio file alongside it).
