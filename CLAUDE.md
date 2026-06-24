# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

**ClearFeed** is a Chrome extension (Manifest V3, no build step, no dependencies) that
hides unwanted content from news sites and feeds. It blocks elements whose text matches
words from user-defined **categories**. Ships with an editable **Sport** category.

There is no framework, bundler, or package manager — the files are loaded directly by
Chrome as an unpacked extension. Edit the source files and reload the extension to test.

## Architecture

Two execution contexts that communicate through `chrome.storage.local` and runtime messages:

- **Content script** (`words.js` + `content.js`) — injected into every page (`<all_urls>`)
  at `document_idle`. Scans article-like elements and hides matches.
- **Popup** (`popup.html` + `popup.js`, with `words.js`) — the settings UI shown from the
  toolbar icon. Reads/writes settings and tells the active tab to re-scan.

### Files

| File | Role |
|------|------|
| `manifest.json` | MV3 manifest. Bump `version` here on release. |
| `words.js` | Defines `DEFAULT_SPORT_WORDS` — the seed list for the Sport category. Loaded first in **both** contexts, so it's a shared global. |
| `content.js` | Page scanner: builds regex matchers, hides matching elements, counts them, watches dynamic content. |
| `popup.js` | Settings UI logic: categories, excluded sites, master toggle, counter. |
| `popup.html` | Popup markup + CSS (inline `<style>`). |
| `icon16/48/128.png` | Toolbar/store icons. Regenerate with the PIL script (see below). |

### Data model (in `chrome.storage.local`)

- `enabled` — master on/off. Read as `data.enabled !== false` (defaults to on).
- `categories` — array of `{ id, name, enabled, color, words[] }`. Sport has `id: "sport"`.
  Seeded from `DEFAULT_CATEGORIES` on first run; afterwards storage is the source of truth.
- `excludedSites` — array of domains where scanning never runs (matches subdomains too).
- `blockedTotal` — running count of hidden elements.

`DEFAULT_CATEGORIES` is duplicated in `content.js` and `popup.js` — **keep both in sync.**

### How blocking works

1. `buildMatchers()` collects words from all *enabled* categories, then `compileMatchers()`
   builds one regex per word using a word boundary:
   `(?:^|[^\p{L}])(?:<word>)` — so a stem matches its endings but not the inside of an
   unrelated word. Matching is case-insensitive (text is lowercased first).
2. `scanAndBlock()` walks `ARTICLE_SELECTORS`, checks each element's text, and hides matches
   with `display:none !important` (saving the previous value for restore).
3. Innermost match wins — a matched element nested inside another match is skipped to avoid
   hiding a whole container when only a child matched.
4. A debounced `MutationObserver` re-scans on dynamic content (infinite scroll, AJAX feeds).
5. Excluded sites and the disabled state short-circuit before any scanning.

### Popup ↔ content messaging

- Popup → active tab: `{ type: "RELOAD" }` after any settings change. The content script
  un-hides everything, clears its "seen" markers, and re-scans.
- Content → popup: `{ type: "COUNT_UPDATE", count }` to update the live counter.

## Conventions

- **English only** in UI text, comments, and docs.
- Vanilla JS, no dependencies. Don't introduce a build step or npm packages.
- Categories are fully editable, **including Sport** — don't reintroduce a read-only/builtin
  special case.
- The master toggle's checked state must come only from stored `enabled` (no hardcoded
  `checked` in HTML).
- HTML inserted from data must go through `esc()` to avoid injection.

## Testing / running

No automated tests. To verify changes:

1. `chrome://extensions` → **Developer mode** → **Load unpacked** → select this folder.
2. After editing, click the reload icon on the extension card, then reload the target page.
3. `node --check <file>.js` is a quick syntax gate before committing.

`chrome.*` APIs only exist in the real extension context — opening `popup.html` directly in
a browser will not populate categories.

## Regenerating icons

Icons are a filter-funnel mark on an indigo gradient, generated with Python + Pillow
(supersampled then downscaled with LANCZOS for crisp edges). Re-run the generation script if
the design changes, and keep all three sizes consistent.
