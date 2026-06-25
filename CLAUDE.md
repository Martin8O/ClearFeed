# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

**ClearFeed** is a Chrome extension (Manifest V3, no build step, no dependencies) that
hides unwanted content from news sites and feeds. It blocks elements whose text matches
words from user-defined **topics** (categories). On first run nothing is filtered — the user
adds topics from a built-in **suggested-topic library** (or their own). The UI and the seeded
word lists are localized (EN/ES/DE/FR/CS/PL) with a runtime language switcher.

There is no framework, bundler, or package manager — the files are loaded directly by
Chrome as an unpacked extension. Edit the source files and reload the extension to test.

## Architecture

Two execution contexts that communicate through `chrome.storage.local` and runtime messages:

- **Content script** (`content.js`) — injected into every page (`<all_urls>`) at
  `document_idle`. Scans article-like elements and hides matches. No category seed of its own
  (default is empty); storage is the source of truth.
- **Popup** (`popup.html` + `popup.js`, with `i18n.js` + `presets.js`) — the settings UI shown
  from the toolbar icon. Reads/writes settings and tells tabs to re-scan.

### Files

| File | Role |
|------|------|
| `manifest.json` | MV3 manifest. Bump `version` here on release. |
| `i18n.js` | `UI` strings + `LANGS` + `t(lang,key)` / `fmt()`. Loaded before `popup.js`. |
| `presets.js` | Suggested topics: `PRESET_META` + per-language `PRESET_CONTENT`; `getPresets(lang)`. Loaded before `popup.js`. |
| `background.js` | Service worker. Handles the `toggle-blocking` keyboard command (flip `enabled`, broadcast `RELOAD`) and swaps the toolbar icon to the greyed `-off` variant whenever `enabled` is false. |
| `content.js` | Page scanner: builds regex matchers, hides matching elements, counts them, watches dynamic content, reveal mode. |
| `popup.js` | Settings UI logic: topics, suggested presets, language switch, excluded sites, master toggle, counter, backup. |
| `popup.html` | Popup markup + CSS (inline `<style>`); text marked with `data-i18n`/`data-i18n-ph`. |
| `icon16/48/128.png` | Toolbar/store icons. Regenerate with the PIL script (see below). |
| `icon16/48/128-off.png` | Greyed "filtering off" icons with a red slash; set by `background.js` via `chrome.action.setIcon` when `enabled` is false. Derived from the base icons with PIL. |

### Data model (in `chrome.storage.local`)

- `enabled` — master on/off. Read as `data.enabled !== false` (defaults to on).
- `categories` — array of `{ id, name, enabled, color, words[] }`. Empty on first run.
  Added from presets (id `preset_<topic>_<lang>`) or custom (`cat_<ts>`).
- `excludedSites` — array of domains where scanning never runs (matches subdomains too).
- `uiLang` — selected app language (`en`/`es`/`de`/`fr`/`cs`/`pl`); defaults from `navigator.language`.
- `theme` — `light`/`dark`; defaults from `prefers-color-scheme`.
- `blockedTotal` — running count of hidden elements.

`DEFAULT_CATEGORIES` (now `[]`) exists in both `content.js` and `popup.js` — keep in sync.

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

- Popup → **all tabs**: `{ type: "RELOAD" }` after any settings change. The content script
  un-hides everything, clears its "seen" markers, resets reveal mode, and re-scans.
- Popup → active tab: `{ type: "GET_HIDDEN_STATE" }` / `{ type: "TOGGLE_REVEAL" }` for the
  "reveal hidden items" button; the content script responds with `{ count, revealed }`.
- Content → popup: `{ type: "COUNT_UPDATE", count }` to update the live counter.

Hidden elements are marked `data-cf-blocked` (and `data-cf-revealed` while temporarily shown);
scanned-but-clean elements get `data-cf-seen`. Settings import is validated/normalized by
`sanitizeSettings()` in `popup.js` (restricts category color to hex to keep `innerHTML` safe).

## Conventions

- **Welcoming, topic-neutral framing** — ClearFeed helps users *focus*, it isn't anti-anything.
  Don't make any single topic (e.g. Sports) a default or special case; all topics are optional,
  user-added, and fully editable.
- **Comments/docs in English.** UI strings are NOT hardcoded — add them to `UI` in `i18n.js`
  for every language and reference via `t(lang,key)`; mark static markup with `data-i18n`.
- New preset topics go in `presets.js` for **all** languages (keep `PRESET_CONTENT` ids aligned;
  the logic test enforces this). Keep word lists conservative to avoid false positives.
- Vanilla JS, no dependencies. Don't introduce a build step or npm packages.
- The master toggle's checked state must come only from stored `enabled` (no hardcoded
  `checked` in HTML).
- HTML inserted from data must go through `esc()` to avoid injection; preset/import colors are
  restricted to hex.

## Testing / running

Automated tests use Node's built-in runner (zero dependencies), run with `node --test`
and in CI (`.github/workflows/ci.yml`):

- `test/safety.test.mjs` — static audit; fails if shipped code gains network/eval/remote-code
  patterns or unexpected permissions. **Keep this green — it backs the privacy claims.**
- `test/logic.test.mjs` — exercises the real pure logic (matching, domain/word parsing, `esc`)
  by loading source in a VM sandbox (`test/harness.mjs`) with stubbed `chrome`/DOM globals.
- Cross-realm note: arrays returned from the sandbox need `Array.from(...)` before deep-equal.

To verify in the browser:

1. `chrome://extensions` → **Developer mode** → **Load unpacked** → select this folder.
2. After editing, click the reload icon on the extension card, then reload the target page.
3. `node --check <file>.js` is a quick syntax gate before committing.

`chrome.*` APIs only exist in the real extension context — opening `popup.html` directly in
a browser will not populate categories.

## Regenerating icons

Icons are a filter-funnel mark on an indigo gradient, generated with Python + Pillow
(supersampled then downscaled with LANCZOS for crisp edges). Re-run the generation script if
the design changes, and keep all three sizes consistent.
