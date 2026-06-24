# ClearFeed

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
