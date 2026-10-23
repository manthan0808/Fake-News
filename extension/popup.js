/**
 * VeriScope Chrome Extension Popup Logic (v2.5)
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
const telemetryStrip = document.getElementById('telemetryStrip');
const telemetryArticles = document.getElementById('telemetryArticles');
const telemetryQueries = document.getElementById('telemetryQueries');
const telemetryTime = document.getElementById('telemetryTime');

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

function updateChecklistStep(stepIndex, pct, message) {
  progressFill.style.width = `${pct}%`;
  progressStep.textContent = message;

  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`step${i}`);
    if (!el) continue;
    if (i < stepIndex) {
      el.className = 'check-item completed';
    } else if (i === stepIndex) {
      el.className = 'check-item active';
    } else {
      el.className = 'check-item';
    }
  }
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

  // Stage 1: DOM Extraction
  updateChecklistStep(1, 15, 'Extracting article content & author metadata...');

  let pageData = null;
  try {
    const response = await chrome.tabs.sendMessage(currentActiveTab.id, { action: 'EXTRACT_PAGE_DATA' });
    if (response && response.success && response.data) {
      pageData = response.data;
    }
  } catch (e) {
    pageData = {
      url: currentActiveTab.url,
      title: currentActiveTab.title,
      domain: new URL(currentActiveTab.url).hostname.replace(/^www\./, ''),
      bodyText: null
    };
  }

  // Simulated realistic checklist cadence while backend is querying real news APIs
  const t1 = setTimeout(() => {
    updateChecklistStep(2, 30, 'Identifying checkable factual claims...');
  }, 600);

  const t2 = setTimeout(() => {
    updateChecklistStep(3, 45, 'Generating targeted multi-source queries...');
  }, 1200);

  const t3 = setTimeout(() => {
    updateChecklistStep(4, 65, 'Searching news sources & knowledge graphs...');
  }, 1800);

  const t4 = setTimeout(() => {
    updateChecklistStep(5, 80, 'Comparing supporting vs contradicting evidence...');
  }, 2700);

  const t5 = setTimeout(() => {
    updateChecklistStep(6, 92, 'Calculating consensus and confidence...');
  }, 3600);

  try {
    const res = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData)
    });

    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    clearTimeout(t4);
    clearTimeout(t5);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    const json = await res.json();
    currentReport = json.report;

    updateChecklistStep(7, 100, 'Report compiled successfully!');
    for (let i = 1; i <= 6; i++) {
      const el = document.getElementById(`step${i}`);
      if (el) el.className = 'check-item completed';
    }

    setTimeout(() => {
      displayResults(currentReport);
    }, 400);

  } catch (err) {
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    clearTimeout(t4);
    clearTimeout(t5);
    console.error('Scan failed:', err);
    errorMessageEl.textContent = err.message || 'Unable to complete verification scan. Ensure backend is running.';
    switchView('error');
  }
}

// 3. Render Results View
function displayResults(report) {
  const verifiedCount = (report.counts?.supported || 0) + (report.counts?.partiallySupported || 0);
  resVerifiedBadge.textContent = `VERIFIED: ${verifiedCount}`;
  resTotalBadge.textContent = `TOTAL: ${report.counts?.total || 1}`;
  resScore.textContent = report.credibilityScore;

  // Real Telemetry
  if (report.searchTelemetry) {
    telemetryArticles.textContent = `${report.searchTelemetry.uniqueArticlesRetrieved || 0} articles retrieved`;
    telemetryQueries.textContent = `${report.searchTelemetry.queriesAttempted || 3} queries attempted`;
    const sec = ((report.searchTelemetry.analysisDurationMs || 2000) / 1000).toFixed(1);
    telemetryTime.textContent = `${sec}s analysis time`;
  }

  claimsList.innerHTML = '';
  (report.claims || []).slice(0, 4).forEach(c => {
    const item = document.createElement('div');
    item.className = 'claim-item';

    const status = c.verdict?.status || 'UNVERIFIED';
    const cleanStatusClass = status.replace(/\s+/g, '_');
    const label = c.verdict?.label || 'Unverified';
    const conf = c.verdict?.confidence !== null ? `${c.verdict?.confidence}% confidence` : 'Insufficient data';
    const sourcesCount = c.verdict?.coverageSummary?.totalSourcesFound || 0;
    const supCount = c.verdict?.coverageSummary?.supportingCount || 0;
    const conCount = c.verdict?.coverageSummary?.contradictingCount || 0;

    item.innerHTML = `
      <div class="claim-item-top">
        <span class="claim-status-pill claim-status-${cleanStatusClass}">${label.toUpperCase()}</span>
        <span style="font-size: 10px; color: #78716c; font-family: monospace;">${conf}</span>
      </div>
      <div class="claim-item-text">"${c.text}"</div>
      <div class="claim-sources-micro">
        <span>📰 ${sourcesCount} sources checked</span> · 
        <span>✓ ${supCount} agree</span> · 
        <span>✕ ${conCount} dispute</span>
      </div>
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
