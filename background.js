// =============================================
//  ClearFeed — background.js (service worker)
//  Two jobs, both reacting to the master on/off state:
//   1. Handle the `toggle-blocking` keyboard command — flip
//      `enabled` and tell every tab to re-scan (mirrors the
//      popup's master toggle).
//   2. Keep the toolbar icon in sync: full-colour when on,
//      a greyed icon with a red slash when off, so the state
//      is visible at a glance without opening the popup.
// =============================================

const ICON_ON = { 16: "icon16.png", 48: "icon48.png", 128: "icon128.png" };
const ICON_OFF = { 16: "icon16-off.png", 48: "icon48-off.png", 128: "icon128-off.png" };

function updateIcon(enabled) {
  // setIcon may reject if the worker is tearing down; ignore — it re-runs on wake.
  chrome.action.setIcon({ path: enabled ? ICON_ON : ICON_OFF }).catch(() => {});
}

function syncIconFromStorage() {
  chrome.storage.local.get(["enabled"], (data) => updateIcon(data.enabled !== false));
}

// Keyboard command: flip the master state and broadcast a re-scan.
chrome.commands.onCommand.addListener((command) => {
  if (command !== "toggle-blocking") return;
  chrome.storage.local.get(["enabled"], (data) => {
    const next = data.enabled === false; // flip (default is on)
    chrome.storage.local.set({ enabled: next }, () => {
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tb) => {
          if (tb.id != null) {
            chrome.tabs.sendMessage(tb.id, { type: "RELOAD" }).catch(() => {});
          }
        });
      });
    });
  });
});

// Single source of truth for the icon: whoever changes `enabled`
// (popup toggle or the command above) triggers this.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    updateIcon(changes.enabled.newValue !== false);
  }
});

// Set the icon when the worker spins up (install, browser start, wake).
chrome.runtime.onInstalled.addListener(syncIconFromStorage);
chrome.runtime.onStartup.addListener(syncIconFromStorage);
syncIconFromStorage();
