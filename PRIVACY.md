# Privacy Policy

**Last updated: 2026-06-24**

ClearFeed is built to be private by design. The short version:

> **ClearFeed collects nothing, sends nothing, and talks to no server. Everything stays on your device.**

## What data ClearFeed handles

ClearFeed stores only the settings you create, using the browser's local extension
storage (`chrome.storage.local`):

- Your categories and the words in them
- Your list of excluded sites
- The on/off state and the count of hidden articles

That's it. This data never leaves your computer.

## What ClearFeed does **not** do

- ❌ **No data collection.** We don't gather your browsing history, the pages you visit,
  or anything you read.
- ❌ **No network requests.** ClearFeed makes **zero** outbound connections — no `fetch`,
  no `XMLHttpRequest`, no `WebSocket`, no beacons, no remote scripts. (This is verified by
  an automated test on every commit — see [SECURITY.md](SECURITY.md).)
- ❌ **No analytics or telemetry.** There are no trackers, no usage stats, no third parties.
- ❌ **No accounts, ads, or selling of data.** There is nothing to sell — we never receive it.
- ❌ **No cookies, `localStorage`, or `indexedDB`.** Only the local extension settings store.

The only outbound link is the **GitHub repository** link in the About panel — it opens in a new
tab when *you* click it (a normal navigation you initiate), and ClearFeed still makes no
background requests of its own.

## How page scanning works

To hide unwanted articles, ClearFeed reads the **text already on the page in your browser**
and compares it against your blocked words — entirely locally, in memory. That text is never
stored or transmitted. Sites you add to the *Excluded sites* list are skipped entirely.

## Permissions

See [SECURITY.md](SECURITY.md#permissions) for a line-by-line explanation of why each
permission is requested and what it is (and isn't) used for.

## Open source

ClearFeed is fully open source. You don't have to take our word for any of the above —
you can read every line: <https://github.com/Martin8O/ClearFeed>. There is no build step and
no minified bundle, so the code you audit is exactly the code that runs.

## Contact

Questions about privacy? Open an issue at
<https://github.com/Martin8O/ClearFeed/issues>.
