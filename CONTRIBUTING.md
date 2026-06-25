# Contributing to ClearFeed

Thanks for your interest! ClearFeed is a small, dependency-free Chrome extension, and
contributions are welcome. Please read this first — a few project rules will save you a
round-trip on review.

## Ground rules

- **No dependencies, no build step.** The files are loaded directly by Chrome as an unpacked
  extension. Don't introduce npm packages, a bundler, or a transpile step. Vanilla JS only.
- **Privacy is the product.** ClearFeed collects nothing, sends nothing, and talks to no
  server. Any network call (`fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`…), remote
  code (`eval`, `new Function`, `importScripts`), or storage like `localStorage`/`cookie`
  will fail the automated safety audit on purpose. Don't add them.
- **Minimal permissions.** The manifest requests only `storage` and `activeTab`. Adding a
  permission needs a very good reason and will be scrutinised.
- **Topic-neutral framing.** ClearFeed helps people *focus*; it isn't against any topic.
  Don't hardcode or privilege a particular subject — every topic is optional and user-added.

## Translations & presets must cover every language

The UI ships in 16 languages. If you touch user-facing text or suggested topics:

- **UI strings** go in the `UI` object in [`i18n.js`](i18n.js) — add your key to **every**
  language block, and reference it with `t(lang, key)` / `data-i18n` (never hardcode text in
  markup).
- **Preset topics** go in [`presets.js`](presets.js) for **all** languages, with aligned ids.
  Keep word lists conservative to avoid false positives.

The logic test enforces that every language exposes the same presets, so a partial
translation will fail CI.

## Before you open a PR

1. **Run the tests** — they're zero-dependency (Node's built-in runner):
   ```
   node --test
   ```
   - `test/safety.test.mjs` is the machine-checkable backing for the privacy claims. **Keep it
     green.**
   - `test/logic.test.mjs` exercises the real matching / parsing logic.
2. **Syntax-check** any file you changed: `node --check content.js` (etc.).
3. **Test it in the browser**: `chrome://extensions` → *Developer mode* → *Load unpacked* →
   select this folder; reload the card and the target page after each edit. `chrome.*` APIs
   only exist in the real extension context, so the popup won't populate if you open
   `popup.html` directly.

## Project layout

See [CLAUDE.md](CLAUDE.md) for a full file-by-file map of the architecture, the storage data
model, and how blocking and popup ↔ content messaging work.

## Reporting bugs & suggesting topics

Open a [GitHub issue](https://github.com/Martin8O/ClearFeed/issues). For a suggested topic,
include the language(s) and a short, conservative word list so it doesn't over-match.

## License

By contributing you agree your work is licensed under the project's [MIT License](LICENSE).
