// =============================================
//  ClearFeed — content.js  (v1.4)
//  Behaviour:
//   - Respects the list of EXCLUDED sites (banking,
//     e-mail…) → no scanning happens there.
//   - Innermost-match wins, single observer, debounce,
//     counter, word boundaries.
//   - Every category (including Sport) is driven by its
//     own editable word list stored in chrome.storage.
// =============================================

const ARTICLE_SELECTORS = [
  "article",
  "[class*='article']", "[class*='Article']",
  "[class*='news-item']", "[class*='newsItem']", "[class*='news_item']",
  "[class*='story']", "[class*='Story']",
  "[class*='card']", "[class*='Card']",
  "[class*='item']", "[class*='Item']",
  "[class*='post']", "[class*='Post']",
  "[class*='teaser']", "[class*='Teaser']",
  "[class*='entry']",
  "li[class]",
];

// Sport is seeded from words.js (DEFAULT_SPORT_WORDS) on first run,
// then becomes a normal editable category in storage.
const DEFAULT_CATEGORIES = [
  {
    id: "sport",
    name: "Sport",
    enabled: true,
    color: "#e74c3c",
    words: (typeof DEFAULT_SPORT_WORDS !== "undefined") ? DEFAULT_SPORT_WORDS.slice() : []
  }
];

let isEnabled = true;
let activeMatchers = [];
let blockedCount = 0;
let observer = null;
let debounceTimer = null;
const sessionCounted = new Set();

// --------- Excluded sites ---------
function isSiteExcluded(hostname, list) {
  hostname = (hostname || "").toLowerCase();
  return (list || []).some((raw) => {
    const d = String(raw).toLowerCase().trim().replace(/^www\./, "");
    if (!d) return false;
    // matches the domain and its subdomains: "seznam.cz" covers "mail.seznam.cz"
    return hostname === d || hostname.endsWith("." + d);
  });
}

// --------- Build matchers from categories ---------
function buildMatchers(categories) {
  const set = new Set();
  categories.forEach((cat) => {
    if (!cat.enabled) return;
    (cat.words || []).forEach((w) => {
      const t = String(w).toLowerCase().trim();
      if (t.length >= 2) set.add(t);
    });
  });
  return compileMatchers([...set]);
}

function compileMatchers(words) {
  const out = [];
  words.forEach((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      out.push(new RegExp("(?:^|[^\\p{L}])(?:" + escaped + ")", "u"));
    } catch (e) {}
  });
  return out;
}

// --------- Load settings + first scan ---------
function loadAndScan() {
  chrome.storage.local.get(
    ["enabled", "blockedTotal", "categories", "excludedSites"],
    (data) => {
      isEnabled = data.enabled !== false;
      blockedCount = data.blockedTotal || 0;
      const categories = data.categories || DEFAULT_CATEGORIES;
      activeMatchers = buildMatchers(categories);

      const blockedHere = isSiteExcluded(location.hostname, data.excludedSites);

      if (isEnabled && !blockedHere && activeMatchers.length > 0) {
        scanAndBlock();
        watchDynamicContent();
      } else {
        // Disabled or excluded site → stop the observer (no scanning).
        if (observer) { observer.disconnect(); observer = null; }
      }
    }
  );
}

// --------- Main scan ---------
function scanAndBlock() {
  const candidates = findArticleElements();

  const newMatches = [];
  candidates.forEach((el) => {
    if (el.dataset.sportBlocked) return;
    if (el.dataset.sbSeen) return;
    if (containsBlockedWord(getTextContent(el))) {
      newMatches.push(el);
    } else {
      el.dataset.sbSeen = "1";
    }
  });

  if (newMatches.length === 0) return;

  const alreadyBlocked = Array.from(document.querySelectorAll("[data-sport-blocked]"));

  let addedToCount = 0;
  newMatches.forEach((el) => {
    const containsOtherMatch =
      newMatches.some((o) => o !== el && el.contains(o)) ||
      alreadyBlocked.some((o) => el.contains(o));
    if (containsOtherMatch) return;

    hideElement(el);

    if (!sessionCounted.has(el)) {
      sessionCounted.add(el);
      addedToCount++;
    }
  });

  if (addedToCount > 0) bumpCounter(addedToCount);
}

// --------- Hide / unhide ---------
function hideElement(el) {
  el.dataset.sbPrevDisplay = el.style.getPropertyValue("display");
  el.style.setProperty("display", "none", "important");
  el.dataset.sportBlocked = "1";
}

function unhideElement(el) {
  const prev = el.dataset.sbPrevDisplay || "";
  if (prev) el.style.setProperty("display", prev);
  else el.style.removeProperty("display");
  delete el.dataset.sbPrevDisplay;
  delete el.dataset.sportBlocked;
}

// --------- Counter ---------
function bumpCounter(add) {
  chrome.storage.local.get(["blockedTotal"], (d) => {
    const total = (d.blockedTotal || 0) + add;
    blockedCount = total;
    chrome.storage.local.set({ blockedTotal: total });
    chrome.runtime.sendMessage({ type: "COUNT_UPDATE", count: total }).catch(() => {});
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.blockedTotal) {
    blockedCount = changes.blockedTotal.newValue || 0;
  }
});

// --------- Helpers ---------
function findArticleElements() {
  const found = new Set();
  ARTICLE_SELECTORS.forEach((sel) => {
    try { document.querySelectorAll(sel).forEach((el) => found.add(el)); } catch (e) {}
  });
  return Array.from(found);
}

function getTextContent(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll("script, style, noscript, template").forEach((s) => s.remove());
  return clone.textContent.replace(/\s+/g, " ").toLowerCase();
}

function containsBlockedWord(text) {
  return activeMatchers.some((re) => re.test(text));
}

// --------- Watch dynamic content ---------
function watchDynamicContent() {
  if (!document.body) return;
  if (observer) observer.disconnect();
  observer = new MutationObserver((mutations) => {
    const hasNew = mutations.some((m) => m.addedNodes.length > 0);
    if (!hasNew) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(scanAndBlock, 200);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// --------- React to settings changes from the popup ---------
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "RELOAD") {
    document.querySelectorAll("[data-sport-blocked]").forEach(unhideElement);
    document.querySelectorAll("[data-sb-seen]").forEach((el) => delete el.dataset.sbSeen);
    loadAndScan();
  }
});

// --------- Start ---------
loadAndScan();
