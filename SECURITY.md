# Security

ClearFeed is designed to be safe to run on every page you visit. This document explains the
security posture, justifies each permission, and describes the automated checks that back the
claims up.

## Threat model in one line

The biggest risk of any "runs on all sites" extension is that it **exfiltrates what you read**
or **injects remote code**. ClearFeed does neither — and that is verified automatically, not
just promised.

## Automated safety checks

Run the full suite with:

```bash
node --test
```

It runs on every push via GitHub Actions (see the CI badge in the [README](README.md)).
Two kinds of tests:

1. **Safety audit** (`test/safety.test.mjs`) — statically scans all shipped source and fails
   the build if it finds any of:
   - network primitives: `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`
   - remote/dynamic code: `eval(`, `new Function(`, `importScripts`
   - storage that can outlive/leak the session: `document.cookie`, `localStorage`, `indexedDB`
   - any external URL that isn't on a small allowlist (currently just the GitHub repo link
     shown in the About panel — see below)

2. **Logic tests** (`test/logic.test.mjs`) — exercise the real matching and validation code
   (word-boundary matching, domain normalization, excluded-site matching, HTML escaping) so
   behavior changes can't slip in unnoticed.

## Permissions

ClearFeed requests the minimum needed to work:

| Permission | Why it's needed | What it is **not** used for |
|------------|-----------------|------------------------------|
| `storage` | Save your categories, excluded sites, and counters locally (`chrome.storage.local`). | No syncing, no remote storage. |
| `activeTab` | Let the popup reference the tab you're on (e.g. the "exclude current site" button) and send it a re-scan message. | No background tab access. |
| `content_scripts` on `<all_urls>` | The blocker must read page text to find and hide matching articles, and that can happen on any news site. | Page text is read **in memory only** — never stored or sent anywhere. Excluded sites are skipped entirely. |

The host match (`<all_urls>`) is the broadest-looking part, so to be explicit: it grants the
ability to *read and hide elements on the current page*. Because there is no network code
(proven by the safety audit), that access **cannot** be turned into data collection.

## Outbound links

The only external URL in the code is the **GitHub repository link** in the About panel. It is
opened in a new browser tab **only when the user clicks it** — it is a normal navigation you
initiate, not a background request the extension makes. The safety audit allowlists this single
URL and fails the build if any other external URL appears.

## Code-injection safety

The popup builds its UI with `innerHTML`. Every value that originates from user input
(category names, word lists, domains) is passed through an HTML-escaping helper (`esc()`)
before insertion, which neutralizes `< > & " '` and prevents HTML/script injection. Colors
come from a fixed internal palette, not user input.

## No build step

There is no bundler or minifier. The files in this repository are exactly what Chrome loads,
so an auditor reviews the real, running code — nothing is hidden behind a build artifact.

## Reporting a vulnerability

Please open an issue at <https://github.com/Martin8O/ClearFeed/issues>. If the issue is
sensitive, note that in the title and we'll arrange a private channel before details are
shared.
