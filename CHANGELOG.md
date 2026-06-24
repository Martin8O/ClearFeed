# Changelog

All notable changes to ClearFeed are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [2.2] - 2026-06-24

### Fixed
- Switching the app language now **re-localizes already-added suggested topics** (name and
  words) so everything stays in one language. Previously a topic added in one language kept
  that language after switching. (Editing a topic's words and then switching language re-seeds
  them for the new language.)

### Changed
- **Narrower popup** and a tidier layout.
- **Suggested topics are now a vertical list** of full-width rows (easier to scan) instead of
  wrapped chips.
- **Slimmer, sticky footer** that stays visible while scrolling; clearer About (info icon) and
  a labeled "Buy me a coffee" button.

## [2.1] - 2026-06-24

### Added
- **Light / dark theme** with a one-tap toggle in the header (defaults to your system
  preference, then remembers your choice). Full UI restyle via CSS variables.
- **About panel** — app version, tagline, links to the source and privacy policy.
- **"Buy me a coffee"** button (coffee icon) — a placeholder for future support links.

### Changed
- Cleaner, more elegant popup visuals (spacing, rounded cards, accent color, transitions).
- The safety audit now allowlists the single user-clicked GitHub link instead of banning all
  URLs — it still fails on any network call or unexpected URL.

## [2.0] - 2026-06-24

### Changed
- **Rebrand to a welcoming, topic-neutral product.** ClearFeed is now about *focusing your
  feed*, not blocking one thing. **Sports is no longer a default** — on first run nothing is
  filtered until you choose.
- New tagline and description: "Clean your feed. Focus on what matters to you."

### Added
- **Suggested-topic library** — one-click topics, each seeded with a keyword list: Sports,
  Politics, Celebrity gossip, Crime & disasters, Money & crypto, Spoilers. Add your own too.
- **Multi-language UI + word lists** — switch the app between **English, Español, Deutsch,
  Français** at runtime; seeded topic words are localized so filtering works on local news.
- Empty-state guidance when no topics are selected yet.

### Removed
- `words.js` (the fixed Sport seed list); replaced by `presets.js` + `i18n.js`.

## [1.5] - 2026-06-24

### Added
- **Settings backup** — export your categories and excluded sites to a JSON file and import
  them back (with validation). Useful since storage is local-only by design.
- **Reveal hidden items** — a popup button temporarily shows what ClearFeed hid on the current
  page (with a dashed outline), then re-hides them, for full transparency.

### Changed
- Settings changes now apply to **all open tabs** immediately, not just the active one.
- Renamed internal `data-sport-*` element markers to `data-cf-*` (ClearFeed namespace).

## [1.4] - 2026-06-24

### Changed
- Renamed the extension from "Sport Blocker" to **ClearFeed**.
- Translated the entire UI, code comments, and docs to **English only**.
- Replaced the placeholder black-circle icon with a filter-funnel mark (16/48/128).

### Added
- Every category, including the built-in **Sport** category, is now fully editable.
- Privacy policy, security policy, and an automated **safety audit** (zero-network / no
  remote code), plus functional logic tests and GitHub Actions CI.
- MIT license, Chrome Web Store listing pack, and promo images.

### Fixed
- Master toggle now reflects the stored on/off state correctly (previously could show
  "active" regardless of state) and shows an explicit "Blocking active / paused" label.
