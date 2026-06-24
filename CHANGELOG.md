# Changelog

All notable changes to ClearFeed are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

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
