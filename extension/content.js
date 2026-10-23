/**
 * VeriScope Content Script — DOM Extractor & In-Page Claim Highlighter
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
  // Priority: <article>, [itemprop="articleBody"], main, .story-body, or density of <p>
  const articleContainer = document.querySelector('article, [itemprop="articleBody"], .article-body, .story-body, main') || document.body;
  const paragraphs = Array.from(articleContainer.querySelectorAll('p'))
    .map(p => p.innerText.trim())
    .filter(text => text.length > 25 && !/^(cookie|advertisement|sign up|subscribe|copyright)/i.test(text));

  const bodyText = paragraphs.join('\n\n').slice(0, 18000);

  // Check if user has highlighted text on the page
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

// In-page highlight injector for verified/flagged claims
function highlightClaimsOnPage(claims) {
  if (!claims || !Array.isArray(claims)) return;

  // Remove any previous highlights
  const existing = document.querySelectorAll('.veriscope-claim-mark');
  existing.forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.innerText), el);
    }
  });

  const bodyHtml = document.body;
  for (const claim of claims) {
    if (!claim.text || claim.text.length < 15) continue;
    
    // Search paragraphs containing the claim
    const ps = bodyHtml.querySelectorAll('p, h1, h2, h3, li');
    for (const p of ps) {
      const pText = p.innerText;
      const cleanClaim = claim.text.slice(0, 50).trim();
      if (pText.includes(cleanClaim)) {
        const status = claim.verdict ? claim.verdict.status : 'UNVERIFIED';
        let bg = 'rgba(234, 179, 8, 0.2)'; // amber for unverified
        let border = '#ca8a04';
        if (status === 'SUPPORTED') {
          bg = 'rgba(34, 197, 94, 0.2)';
          border = '#16a34a';
        } else if (status === 'CONTRADICTED') {
          bg = 'rgba(239, 68, 68, 0.2)';
          border = '#dc2626';
        }

        const mark = document.createElement('mark');
        mark.className = 'veriscope-claim-mark';
        mark.style.backgroundColor = bg;
        mark.style.borderBottom = `2px solid ${border}`;
        mark.style.padding = '2px 4px';
        mark.style.borderRadius = '3px';
        mark.title = `[VeriScope Proof Desk] ${status}: ${claim.verdict ? claim.verdict.verdictReason : ''}`;
        mark.innerText = p.innerText;

        p.innerHTML = '';
        p.appendChild(mark);
        break;
      }
    }
  }
}

// Message Listener from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'EXTRACT_PAGE_DATA') {
    const data = extractPageData();
    sendResponse({ success: true, data });
  } else if (request.action === 'HIGHLIGHT_CLAIMS') {
    highlightClaimsOnPage(request.claims);
    sendResponse({ success: true });
  }
  return true;
});
