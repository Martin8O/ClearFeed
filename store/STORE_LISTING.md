# Chrome Web Store — listing & submission pack

Copy-paste ready content for the Chrome Web Store Developer Dashboard. Generated assets live
alongside this file in `store/`.

---

## Store listing tab

**Item name**

```
ClearFeed — Clean Your News Feed
```

**Summary** (max 132 chars)

```
Mute topics you'd rather not see — politics, gossip, spoilers, sports or any keywords. Private by design: no tracking, all local.
```

**Category:** Productivity
**Language:** English (UI also available in Español, Deutsch, Français, Čeština, Polski)

**Detailed description**

```
ClearFeed helps you focus on what matters. It quietly hides the topics you'd rather not see
from news sites and feeds — so your reading stays calm and relevant. You're always in control:
nothing is hidden unless you ask for it.

★ PICK YOUR TOPICS
Add ready-made topics with one click — Politics, Celebrity gossip, Crime & disasters,
Money & crypto, Spoilers, Sports — each with a built-in keyword list. Or create your own
from any keywords. Every topic is fully editable, and a word stem is enough: "elect" catches
election, elections, electoral…

★ WORKS IN YOUR LANGUAGE
Switch the app and its suggested word lists between English, Español, Deutsch, Français,
Čeština and Polski, so filtering works on your local news too.

★ YOU STAY IN CONTROL
• Per-topic and master on/off switches.
• "Reveal hidden" shows exactly what was filtered on a page — nothing happens behind your back.
• Excluded sites — never filter on your bank, e-mail, or any site you choose.
• Backup and restore your setup as a file.

★ PRIVATE BY DESIGN
• Zero network requests — nothing you read ever leaves your device.
• No tracking, no analytics, no accounts, no ads.
• Settings are stored locally in your browser only.
• Open source and auditable — a safety test fails the build if any network or remote-code
  call is ever added: https://github.com/Martin8O/ClearFeed

Free, lightweight, no dependencies.
```

---

## Privacy practices tab

**Single purpose**

```
ClearFeed has one purpose: to hide articles and feed items on web pages that match
user-defined keyword topics, so the user can keep topics they'd rather not see (such as
politics, gossip, or spoilers) out of the sites they browse.
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
| Screenshots | 1280×800, 1–5 | ✅ `store/screenshots/01-popup.png`, `02-before-after.png`, `03-reveal.png` |

> The popup screenshot (`01-popup.png`) is rendered from the **real** `popup.html` + `popup.js`
> (seeded with sample data via headless Chrome), so it reflects the actual UI. The before/after
> and reveal screenshots use a representative news-feed mock to illustrate behavior. If you want
> screenshots captured against a specific real news site, do a quick manual capture once the
> extension is loaded unpacked and drop them in `store/screenshots/`.

---

## Build the upload package

The store wants a `.zip` of the runtime files only (no tests, CI, or docs). `.gitattributes`
marks dev files `export-ignore`, so:

```bash
git archive --format=zip -o clearfeed-1.4.zip HEAD
```

produces a zip containing only: `manifest.json`, `content.js`, `popup.js`, `popup.html`,
`words.js`, `icon16/48/128.png`, and `LICENSE`.
