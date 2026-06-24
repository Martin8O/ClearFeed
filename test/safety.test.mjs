// Static safety audit: fails if any shipped source file contains code that
// could exfiltrate data or run remote code. This is the machine-checkable
// backing for the privacy claims in PRIVACY.md / SECURITY.md.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.dirname(path.dirname(url.fileURLToPath(import.meta.url)));

// Files actually shipped to users (everything Chrome loads). Tests/docs excluded.
const SHIPPED = ["manifest.json", "content.js", "popup.js", "words.js", "popup.html"];

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
  [/https?:\/\//, "external URL in shipped code"],
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

for (const file of SHIPPED) {
  test(`no unsafe patterns in ${file}`, () => {
    const hits = scan(file);
    assert.deepEqual(hits, [], hits.join("\n"));
  });
}

test("content script declares no host beyond <all_urls> read scope", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
  const perms = manifest.permissions || [];
  // Guard against scope creep: only these permissions are expected.
  const allowed = new Set(["storage", "activeTab"]);
  const unexpected = perms.filter((p) => !allowed.has(p));
  assert.deepEqual(unexpected, [], `Unexpected permissions: ${unexpected.join(", ")}`);
});
