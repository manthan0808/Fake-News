/**
 * VeriScope Chrome Extension Popup Logic
 */

const API_BASE = 'http://localhost:5000/api';
let currentActiveTab = null;
let currentReport = null;

// UI Elements
const tabDomainEl = document.getElementById('tabDomain');
const tabTitleEl = document.getElementById('tabTitle');
const scanBtn = document.getElementById('scanBtn');
const retryBtn = document.getElementById('retryBtn');
const initialView = document.getElementById('initialView');
const loadingView = document.getElementById('loadingView');
const errorView = document.getElementById('errorView');
const resultView = document.getElementById('resultView');
const progressFill = document.getElementById('progressFill');
const progressStep = document.getElementById('progressStep');
const errorMessageEl = document.getElementById('errorMessage');
const resVerifiedBadge = document.getElementById('resVerifiedBadge');
const resTotalBadge = document.getElementById('resTotalBadge');
const resScore = document.getElementById('resScore');
const claimsList = document.getElementById('claimsList');
const openReportBtn = document.getElementById('openReportBtn');
const highlightBtn = document.getElementById('highlightBtn');

function switchView(viewName) {
  initialView.classList.add('hidden');
  loadingView.classList.add('hidden');
  errorView.classList.add('hidden');
  resultView.classList.add('hidden');

  if (viewName === 'initial') initialView.classList.remove('hidden');
  if (viewName === 'loading') loadingView.classList.remove('hidden');
  if (viewName === 'error') errorView.classList.remove('hidden');
  if (viewName === 'result') resultView.classList.remove('hidden');
}

// 1. Detect Active Tab on Open
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
      currentActiveTab = tabs[0];
      const url = new URL(currentActiveTab.url || 'about:blank');
      tabDomainEl.textContent = url.hostname.replace(/^www\./, '') || 'Browser Internal Tab';
      tabTitleEl.textContent = currentActiveTab.title || 'Untitled Page';

      // Restrict scanning on chrome:// or edge:// pages
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        scanBtn.disabled = true;
        scanBtn.textContent = 'Cannot scan browser internal pages';
      }
    }
  } catch (err) {
    tabDomainEl.textContent = 'Active Page';
    tabTitleEl.textContent = 'Ready to scan';
  }
});

// 2. Scan Button Click Handler
scanBtn.addEventListener('click', () => initiateScan());
retryBtn.addEventListener('click', () => initiateScan());

async function initiateScan() {
  if (!currentActiveTab) return;
  switchView('loading');

  // Step 1: DOM Extraction
  progressFill.style.width = '20%';
  progressStep.textContent = '1/4: Extracting article and metadata from DOM...';

  let pageData = null;
  try {
    const response = await chrome.tabs.sendMessage(currentActiveTab.id, { action: 'EXTRACT_PAGE_DATA' });
    if (response && response.success && response.data) {
      pageData = response.data;
    }
  } catch (e) {
    // If content script was not already injected, fallback to tab properties
    pageData = {
      url: currentActiveTab.url,
      title: currentActiveTab.title,
      domain: new URL(currentActiveTab.url).hostname.replace(/^www\./, ''),
      bodyText: null
    };
  }

  // Step 2: Sending to Proof Desk Pipeline
  progressFill.style.width = '45%';
  progressStep.textContent = '2/4: Identifying factual assertions & regional script...';

  setTimeout(() => {
    progressFill.style.width = '70%';
    progressStep.textContent = '3/4: Cross-referencing public evidence archives...';
  }, 900);

  try {
    const res = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    const json = await res.json();
    currentReport = json.report;

    progressFill.style.width = '100%';
    progressStep.textContent = '4/4: Proof compiled. Rendering results...';

    setTimeout(() => {
      displayResults(currentReport);
    }, 400);

  } catch (err) {
    console.error('Scan failed:', err);
    errorMessageEl.textContent = err.message || 'Unable to complete verification scan.';
    switchView('error');
  }
}

// 3. Render Results View
function displayResults(report) {
  resVerifiedBadge.textContent = `VERIFIED: ${report.counts.verified}`;
  resTotalBadge.textContent = `TOTAL: ${report.counts.total}`;
  resScore.textContent = report.credibilityScore;

  claimsList.innerHTML = '';
  (report.claims || []).slice(0, 4).forEach(c => {
    const item = document.createElement('div');
    item.className = 'claim-item';

    const status = c.verdict ? c.verdict.status : 'UNVERIFIED';
    const label = c.verdict ? c.verdict.label : 'Unverified';

    item.innerHTML = `
      <div class="claim-item-top">
        <span class="claim-status-pill claim-status-${status}">${label.toUpperCase()}</span>
        <span style="font-size: 10px; color: #78716c;">${c.verdict ? c.verdict.confidence : 0}% confidence</span>
      </div>
      <div class="claim-item-text">"${c.text}"</div>
    `;
    claimsList.appendChild(item);
  });

  switchView('result');
}

// 4. Open Full Proof Report Button
openReportBtn.addEventListener('click', () => {
  if (currentReport && currentReport.id) {
    const reportUrl = `http://localhost:5173/result/${currentReport.id}`;
    chrome.tabs.create({ url: reportUrl });
  }
});

// 5. Highlight Claims in Page
highlightBtn.addEventListener('click', async () => {
  if (currentActiveTab && currentReport && currentReport.claims) {
    try {
      await chrome.tabs.sendMessage(currentActiveTab.id, {
        action: 'HIGHLIGHT_CLAIMS',
        claims: currentReport.claims
      });
      highlightBtn.textContent = '✓ Claims Highlighted in Page';
      setTimeout(() => {
        highlightBtn.textContent = 'Highlight Claims in Page';
      }, 2500);
    } catch (e) {
      alert('Could not highlight directly on this page.');
    }
  }
});
