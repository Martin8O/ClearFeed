# ClearFeed

[![CI](https://github.com/Martin8O/ClearFeed/actions/workflows/ci.yml/badge.svg)](https://github.com/Martin8O/ClearFeed/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![No network calls](https://img.shields.io/badge/network%20requests-zero-brightgreen.svg)](SECURITY.md#automated-safety-checks)
[![No tracking](https://img.shields.io/badge/tracking-none-brightgreen.svg)](PRIVACY.md)

A lightweight Chrome extension (Manifest V3) that hides unwanted content — sports by default, or **any words you choose** — from news sites and feeds.

## Features

- **Category-based blocking.** Ships with an editable **Sport** category and lets you add your own (politics, celebrities, a specific team — anything).
- **Fully editable word lists.** Every category, including the built-in Sport one, uses a word list you can edit at any time. A word *stem* is enough: `elect` catches *election*, *elections*, *electoral*…
- **Per-category on/off** toggles, plus a master switch to pause all blocking.
- **Excluded sites.** Add domains (banking, e-mail, …) where blocking should never run — one click excludes the site you're currently on.
- **Hidden-article counter** so you can see how much noise it filters out.
- **Word-boundary matching** so short words won't match inside unrelated words.

## How it works

A content script scans article-like elements on each page and hides any whose text matches an enabled category's words. Dynamic content (infinite scroll, AJAX feeds) is handled with a debounced `MutationObserver`. Settings live in `chrome.storage.local`.

## Privacy & safety

ClearFeed is **private by design** — and the claims are machine-checked, not just promised:

- 🔒 **Zero network requests.** No `fetch`, `XMLHttpRequest`, `WebSocket`, or beacons anywhere in the code. Nothing you read can leave your device.
- 🚫 **No tracking, analytics, or accounts.** There is nothing to collect and no one to send it to.
- 💾 **Local-only storage.** Your categories and settings live in `chrome.storage.local` and never sync or upload.
- 🧩 **No remote code.** No `eval`, no `new Function`, no externally loaded scripts.
- 🔍 **Auditable, no build step.** The files in this repo are exactly what Chrome runs — nothing is minified or hidden.
- ✅ **Proven on every commit.** A [static safety audit](test/safety.test.mjs) fails CI if any of the above is ever violated.

Full details: [PRIVACY.md](PRIVACY.md) · [SECURITY.md](SECURITY.md)

## Tests

No build step and zero dependencies — tests use Node's built-in runner:

```bash
node --test
```

This runs the **safety audit** (`test/safety.test.mjs`, scans shipped code for unsafe patterns) and **logic tests** (`test/logic.test.mjs`, exercises word-boundary matching, domain handling, and HTML escaping). Both run automatically via GitHub Actions.

## Install (unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this folder.
4. Pin the ClearFeed icon and open the popup to configure categories.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest (MV3) |
| `content.js` | Scans pages and hides matching articles |
| `words.js` | Default Sport word list used to seed the category |
| `popup.html` / `popup.js` | Settings UI (categories, excluded sites, counter) |
| `icon16/48/128.png` | Toolbar / store icons |
