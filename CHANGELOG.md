# Changelog

All notable changes to ClearFeed are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

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
