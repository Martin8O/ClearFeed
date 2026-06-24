# Chrome Web Store — listing & submission pack

Copy-paste ready content for the Chrome Web Store Developer Dashboard. Generated assets live
alongside this file in `store/`.

---

## Store listing tab

**Item name**

```
ClearFeed — Hide Sports & Unwanted News
```

**Summary** (max 132 chars)

```
Hide sports — or any keywords you choose — from news sites and feeds. Private by design: no tracking, no servers, all local.
```

**Category:** Productivity
**Language:** English

**Detailed description**

```
ClearFeed quietly removes the topics you don't want to see from news sites and feeds.

Tired of sports dominating every front page? Turn it off. ClearFeed ships with a Sport
category and lets you create your own — politics, a specific team, a celebrity, spoilers,
anything — then hides every article, card, and feed item that matches.

★ FEATURES
• Category-based blocking — start with Sport, add as many of your own as you like.
• Fully editable word lists — every category, including Sport, is editable. A word stem is
  enough: "elect" catches election, elections, electoral…
• Per-category and master on/off switches.
• Excluded sites — never block on your bank, e-mail, or any site you choose. One click
  excludes the site you're currently on.
• Live counter of how many articles it has hidden for you.

★ PRIVATE BY DESIGN
• Zero network requests — nothing you read ever leaves your device.
• No tracking, no analytics, no accounts, no ads.
• Settings are stored locally in your browser only.
• Open source and auditable — and a safety test fails the build if any network or
  remote-code call is ever added: https://github.com/Martin8O/ClearFeed

ClearFeed reads page text locally to find and hide matches — that text is never stored or
sent anywhere. It's free, lightweight, and has no dependencies.
```

---

## Privacy practices tab

**Single purpose**

```
ClearFeed has one purpose: to hide articles and feed items on web pages that match
user-defined keyword categories, so the user can remove unwanted topics (such as sports)
from the sites they browse.
```

**Permission justifications**

| Field | Justification to paste |
|-------|------------------------|
| `storage` | `Stores the user's categories, blocked words, excluded sites, and on/off state locally via chrome.storage.local. No data is synced or transmitted.` |
| `activeTab` | `Lets the popup reference the current tab so the user can exclude the site they are on, and tells that tab to re-apply settings after a change.` |
| Host permissions (`<all_urls>`) | `The content script must read the text of the current page to find and hide articles matching the user's blocked words, and the user may browse any news site. Page text is processed in memory only and is never stored or transmitted. Sites on the user's exclusion list are skipped entirely.` |
| Remote code | `No. The extension executes no remote or dynamically generated code. There is no eval, no new Function, and no externally loaded scripts. All code is contained in the package.` |

**Data usage disclosures** — check **none**. ClearFeed does not collect or use any of the
listed data types (personally identifiable info, health, financial, authentication, personal
communications, location, web history, user activity, website content).

**Certifications** (all true — tick each):
- ☑ I do not sell or transfer user data to third parties, outside of the approved use cases.
- ☑ I do not use or transfer user data for purposes unrelated to my item's single purpose.
- ☑ I do not use or transfer user data to determine creditworthiness or for lending purposes.

**Privacy policy URL**

```
https://github.com/Martin8O/ClearFeed/blob/main/PRIVACY.md
```

---

## Assets checklist

| Asset | Spec | Status |
|-------|------|--------|
| Store icon | 128×128 PNG | ✅ `icon128.png` |
| Small promo tile | 440×280 PNG | ✅ `store/promo-small-440x280.png` |
| Marquee promo | 1400×560 PNG | ✅ `store/marquee-1400x560.png` |
| Screenshots | 1280×800 (or 640×400), 1–5 | ⬜ **capture from the live popup + a before/after on a news site** |

> Screenshots must show the real UI, so they have to be captured from the running extension
> (Load unpacked → open the popup; and a news page before/after blocking). Recommended set:
> (1) the popup with a few categories, (2) a news feed before, (3) the same feed after.

---

## Build the upload package

The store wants a `.zip` of the runtime files only (no tests, CI, or docs). `.gitattributes`
marks dev files `export-ignore`, so:

```bash
git archive --format=zip -o clearfeed-1.4.zip HEAD
```

produces a zip containing only: `manifest.json`, `content.js`, `popup.js`, `popup.html`,
`words.js`, `icon16/48/128.png`, and `LICENSE`.
