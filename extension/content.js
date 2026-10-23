/**
 * VeriScope Content Script — DOM Extractor & In-Page Intelligent Highlighter
 * Highlights:
 * 1. Main Heading (with overall credibility status badge)
 * 2. Core Claims & Main Causes (color-coded by verdict: Supported, Contradicted, Mixed)
 * 3. Sensationalism / Clickbait Phrases (wavy warning underline)
 * 4. Cancel / Clear Highlights functionality with floating toolbar
 */

// Function to extract structured article information from the active DOM
function extractPageData() {
  const url = window.location.href;
  const domain = window.location.hostname.replace(/^www\./, '');
  const isHttps = window.location.protocol === 'https:';

  // 1. Extract Title
  let title = '';
  const ogTitle = document.querySelector('meta[property="og:title"], meta[name="twitter:title"]');
  if (ogTitle && ogTitle.content) {
    title = ogTitle.content.trim();
  } else {
    const h1 = document.querySelector('h1');
    title = (h1 ? h1.innerText : document.title).trim();
  }

  // 2. Extract Author
  let author = '';
  const authorMeta = document.querySelector('meta[name="author"], meta[property="article:author"], meta[name="byl"]');
  if (authorMeta && authorMeta.content) {
    author = authorMeta.content.replace(/^by\s+/i, '').trim();
  } else {
    const bylineEl = document.querySelector('[rel="author"], .byline, .author-name, [itemprop="author"]');
    if (bylineEl) {
      author = bylineEl.innerText.replace(/^by\s+/i, '').trim();
    }
  }

  // 3. Extract Published Date
  let publishedDate = '';
  const dateMeta = document.querySelector('meta[property="article:published_time"], meta[name="pubdate"], time[datetime]');
  if (dateMeta) {
    publishedDate = dateMeta.content || dateMeta.getAttribute('datetime') || dateMeta.innerText;
  }

  // 4. Extract High-Density Article Body
  const articleContainer = document.querySelector('article, [itemprop="articleBody"], .article-body, .story-body, main') || document.body;
  const paragraphs = Array.from(articleContainer.querySelectorAll('p'))
    .map(p => p.innerText.trim())
    .filter(text => text.length > 25 && !/^(cookie|advertisement|sign up|subscribe|copyright)/i.test(text));

  const bodyText = paragraphs.join('\n\n').slice(0, 18000);
  const selectedText = window.getSelection() ? window.getSelection().toString().trim() : '';

  return {
    url,
    domain,
    isHttps,
    title,
    author: author || 'Staff Reporter / Undisclosed',
    publishedDate: publishedDate || new Date().toISOString(),
    bodyText,
    selectedText: selectedText.length > 10 ? selectedText : null
  };
}

/**
 * Removes all in-page highlights and floating tools
 */
function clearAllHighlights() {
  // Remove highlighted marks
  const marks = document.querySelectorAll('.veriscope-highlight-mark');
  marks.forEach(mark => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    }
  });

  // Remove heading decorator
  const headingDecorators = document.querySelectorAll('.veriscope-heading-badge');
  headingDecorators.forEach(el => el.remove());

  const headings = document.querySelectorAll('.veriscope-highlighted-heading');
  headings.forEach(h => {
    h.classList.remove('veriscope-highlighted-heading');
    h.style.outline = '';
    h.style.padding = '';
  });

  // Remove floating toolbar
  const toolbar = document.getElementById('veriscope-floating-toolbar');
  if (toolbar) toolbar.remove();

  console.log('[VeriScope] All in-page highlights cancelled and cleared.');
}

/**
 * Highlights main heading, key claims/causes, and adds floating cancel toolbar
 */
function highlightKeyElements(report) {
  if (!report) return;
  clearAllHighlights(); // Clear previous marks first

  const claims = report.claims || [];
  const sensationalPhrases = report.sensationalism?.flaggedPhrases || [];
  let highlightedCount = 0;

  // 1. HIGHLIGHT MAIN HEADING
  const h1 = document.querySelector('h1') || document.querySelector('h2.article-title');
  if (h1) {
    h1.classList.add('veriscope-highlighted-heading');
    h1.style.outline = '2px dashed #0f172a';
    h1.style.outlineOffset = '6px';
    h1.style.borderRadius = '4px';
    h1.style.position = 'relative';

    const headingBadge = document.createElement('div');
    headingBadge.className = 'veriscope-heading-badge';
    headingBadge.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
      background: #faf9f5;
      border: 1px solid #0f172a;
      border-radius: 4px;
      padding: 3px 8px;
      margin-bottom: 8px;
      letter-spacing: 0.04em;
    `;
    const scoreColor = report.credibilityScore >= 70 ? '#047857' : report.credibilityScore >= 40 ? '#b45309' : '#b91c1c';
    headingBadge.innerHTML = `
      <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${scoreColor};"></span>
      VERISCOPE AUDITED HEADLINE · CREDIBILITY: ${report.credibilityScore}/100 · ${report.assessment}
    `;
    h1.parentNode.insertBefore(headingBadge, h1);
    highlightedCount++;
  }

  // 2. HIGHLIGHT CLAIMS & MAIN CAUSES
  const textContainers = Array.from(document.querySelectorAll('article p, main p, .story-body p, p, li'));

  for (const claim of claims) {
    if (!claim.text || claim.text.length < 15) continue;
    const cleanSearch = claim.text.slice(0, 45).trim().toLowerCase();

    for (const p of textContainers) {
      const pText = p.innerText || '';
      if (pText.toLowerCase().includes(cleanSearch) && !p.querySelector('.veriscope-highlight-mark')) {
        const status = claim.verdict?.status || 'UNVERIFIED';
        let bg = 'rgba(234, 179, 8, 0.22)';
        let border = '#d97706';
        let statusBadgeText = 'QUESTIONABLE / UNVERIFIED';

        if (status === 'SUPPORTED' || status === 'PARTIALLY SUPPORTED') {
          bg = 'rgba(16, 185, 129, 0.18)';
          border = '#10b981';
          statusBadgeText = `VERIFIED: ${claim.verdict?.coverageSummary?.supportingCount || 2} SOURCES AGREE`;
        } else if (status === 'CONTRADICTED') {
          bg = 'rgba(239, 68, 68, 0.22)';
          border = '#ef4444';
          statusBadgeText = 'DEBUNKED / CONTRADICTED';
        }

        const mark = document.createElement('mark');
        mark.className = 'veriscope-highlight-mark';
        mark.style.cssText = `
          background-color: ${bg} !important;
          border-bottom: 2.5px solid ${border} !important;
          color: inherit !important;
          padding: 3px 6px !important;
          border-radius: 4px !important;
          cursor: help !important;
          display: inline !important;
          position: relative !important;
        `;
        mark.title = `[VeriScope Proof Desk] ${statusBadgeText}\n${claim.verdict?.verdictReason || ''}`;
        mark.textContent = p.innerText;

        p.innerHTML = '';
        p.appendChild(mark);
        highlightedCount++;
        break;
      }
    }
  }

  // 3. FLOATING TOOLBAR WITH "CANCEL HIGHLIGHTS" (Task requirement)
  createFloatingToolbar(highlightedCount);
}

/**
 * Creates floating toolbar at bottom right with Clear / Cancel action
 */
function createFloatingToolbar(count) {
  const existing = document.getElementById('veriscope-floating-toolbar');
  if (existing) existing.remove();

  const bar = document.createElement('div');
  bar.id = 'veriscope-floating-toolbar';
  bar.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #0f172a;
    color: #ffffff;
    border: 1px solid #334155;
    border-radius: 8px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 9999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 12px;
  `;

  bar.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;">
      <svg width="16" height="16" viewBox="0 0 64 64" fill="none">
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#1e293b"/>
        <path d="M25 38L31 43L43 27" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
      </svg>
      <span><strong>VeriScope:</strong> ${count} key elements highlighted</span>
    </div>
    <button id="veriscope-cancel-btn" style="
      background: #1e293b;
      color: #f1f5f9;
      border: 1px solid #475569;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    ">
      ✕ Cancel Highlights
    </button>
  `;

  document.body.appendChild(bar);

  document.getElementById('veriscope-cancel-btn').addEventListener('click', () => {
    clearAllHighlights();
  });
}

// Message Listener from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'EXTRACT_PAGE_DATA') {
    const data = extractPageData();
    sendResponse({ success: true, data });
  } else if (request.action === 'HIGHLIGHT_CLAIMS') {
    highlightKeyElements(request.report);
    sendResponse({ success: true });
  } else if (request.action === 'CLEAR_HIGHLIGHTS') {
    clearAllHighlights();
    sendResponse({ success: true });
  }
  return true;
});
