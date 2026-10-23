/**
 * VeriScope Background Service Worker (Manifest V3)
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('[VeriScope] Extension installed successfully.');
  
  // Context menu item: "Verify claim with VeriScope"
  try {
    chrome.contextMenus.create({
      id: 'veriscope-verify-selection',
      title: 'Verify statement with VeriScope Proof Desk',
      contexts: ['selection']
    });
  } catch (e) {
    // Context menu creation handler
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'veriscope-verify-selection' && info.selectionText) {
    // Open verification dashboard with selected text
    const targetUrl = `http://localhost:5173/check?text=${encodeURIComponent(info.selectionText)}`;
    chrome.tabs.create({ url: targetUrl });
  }
});
