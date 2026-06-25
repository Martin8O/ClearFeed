// Static safety audit: fails if any shipped source file contains code that
// could exfiltrate data or run remote code. This is the machine-checkable
// backing for the privacy claims in PRIVACY.md / SECURITY.md.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));

// Executable code shipped to users. The forbidden-pattern scan targets these,
// because that's where a network call or remote-code execution could live.
// manifest.json is metadata (its homepage_url is benign) and is checked
// separately for permission scope below.
const CODE_FILES = ["content.js", "popup.js", "background.js", "i18n.js", "presets.js", "popup.html"];

// Each forbidden pattern => human-readable reason.
const FORBIDDEN = [
  [/\bfetch\s*\(/, "network request via fetch()"],
  [/\bXMLHttpRequest\b/, "network request via XMLHttpRequest"],
  [/\bWebSocket\b/, "WebSocket connection"],
  [/\bEventSource\b/, "EventSource / server-sent events"],
  [/\bsendBeacon\b/, "navigator.sendBeacon exfiltration"],
  [/\beval\s*\(/, "dynamic code execution via eval()"],
  [/\bnew\s+Function\s*\(/, "dynamic code execution via new Function()"],
  [/\bimportScripts\b/, "remote script import"],
  [/\bdocument\.cookie\b/, "cookie access"],
  [/\blocalStorage\b/, "localStorage usage"],
  [/\bindexedDB\b/, "indexedDB usage"],
];

function scan(file) {
  const text = fs.readFileSync(path.join(ROOT, file), "utf8");
  const lines = text.split(/\r?\n/);
  const hits = [];
  for (const [re, reason] of FORBIDDEN) {
    lines.forEach((line, i) => {
      if (re.test(line)) hits.push(`${file}:${i + 1} — ${reason}: ${line.trim()}`);
    });
  }
  return hits;
}

for (const file of CODE_FILES) {
  test(`no unsafe patterns in ${file}`, () => {
    const hits = scan(file);
    assert.deepEqual(hits, [], hits.join("\n"));
  });
}

// External URLs are allowed ONLY for explicit, user-initiated links (opened in a new
// tab on click — never a background request). This test documents exactly which ones
// exist and fails if any unexpected URL is added.
const ALLOWED_URLS = new Set([
  "https://github.com/Martin8O/ClearFeed",
]);

test("only allowlisted external URLs appear in shipped code", () => {
  const offenders = [];
  for (const file of CODE_FILES) {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    const urls = text.match(/https?:\/\/[^\s"'`)]+/g) || [];
    for (const u of urls) if (!ALLOWED_URLS.has(u)) offenders.push(`${file}: ${u}`);
  }
  assert.deepEqual(offenders, [], offenders.join("\n"));
});

test("content script declares no host beyond <all_urls> read scope", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
  const perms = manifest.permissions || [];
  // Guard against scope creep: only these permissions are expected.
  const allowed = new Set(["storage", "activeTab"]);
  const unexpected = perms.filter((p) => !allowed.has(p));
  assert.deepEqual(unexpected, [], `Unexpected permissions: ${unexpected.join(", ")}`);
});
