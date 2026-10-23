// ============================================================
// MOCK DATA — Claims, Sources, Evidence, Predictions
// Stage 2: Replace with API calls
// ============================================================

// ── Claims ───────────────────────────────────────────────

export const mockClaims = {
  nr_001: [
    {
      id: 'cl_001',
      text: 'The government has announced a massive cash transfer scheme.',
      status: 'UNVERIFIED',
      explanation: 'No official government notification found. Multiple outlets have reported this but no original source exists.',
    },
    {
      id: 'cl_002',
      text: 'Every citizen above 18 will receive ₹50,000 starting tomorrow.',
      status: 'CONTRADICTED',
      explanation: 'Contradicted by official government press releases. Ministry of Finance explicitly denied this claim.',
      contradictingSource: 'Ministry of Finance Official Statement, Sep 13 2025',
    },
    {
      id: 'cl_003',
      text: 'The scheme was announced in an emergency cabinet session.',
      status: 'UNVERIFIED',
      explanation: 'No records of any emergency cabinet session on this date found in official sources.',
    },
    {
      id: 'cl_004',
      text: 'Financial experts have raised doubts about feasibility.',
      status: 'SUPPORTED',
      explanation: 'Multiple credible economists have indeed commented on budget constraints that make such a scheme unlikely.',
      supportingSource: 'Economic Times, Business Standard',
    },
    {
      id: 'cl_005',
      text: 'The announcement has not been published on any official government portal.',
      status: 'SUPPORTED',
      explanation: 'Confirmed — neither PMO, Finance Ministry, nor any official portal shows this announcement.',
      supportingSource: 'PMO India, Ministry of Finance websites',
    },
  ],
  nr_002: [
    {
      id: 'cl_006',
      text: 'ISRO launched RISAT-2BR2 from Satish Dhawan Space Centre.',
      status: 'SUPPORTED',
      explanation: 'Confirmed by ISRO official press release and live broadcast.',
      supportingSource: 'ISRO.gov.in official press release',
    },
    {
      id: 'cl_007',
      text: 'The satellite is equipped with synthetic aperture radar.',
      status: 'SUPPORTED',
      explanation: 'Confirmed technical specification from official mission documents.',
      supportingSource: 'ISRO Mission Brief',
    },
  ],
};

// ── Sources ──────────────────────────────────────────────

export const mockSources = [
  { id: 'src_001', name: 'ISRO Official', domain: 'isro.gov.in', score: 95, category: 'Government', status: 'Trusted', lastChecked: '2025-09-01' },
  { id: 'src_002', name: 'The Hindu', domain: 'thehindu.com', score: 91, category: 'News', status: 'Trusted', lastChecked: '2025-09-01' },
  { id: 'src_003', name: 'NDTV', domain: 'ndtv.com', score: 85, category: 'News', status: 'Trusted', lastChecked: '2025-09-01' },
  { id: 'src_004', name: 'Times of India', domain: 'timesofindia.com', score: 80, category: 'News', status: 'Trusted', lastChecked: '2025-09-01' },
  { id: 'src_005', name: 'ExampleNews.in', domain: 'examplenews.in', score: 61, category: 'News', status: 'Moderate', lastChecked: '2025-09-01' },
  { id: 'src_006', name: 'Viral Samachar', domain: 'viralsamachar.net', score: 34, category: 'Tabloid', status: 'Low', lastChecked: '2025-09-01' },
  { id: 'src_007', name: 'WhatsApp Forward Blog', domain: 'waforwards.blogspot.com', score: 12, category: 'Blog', status: 'Untrusted', lastChecked: '2025-09-01' },
  { id: 'src_008', name: 'India Today', domain: 'indiatoday.in', score: 88, category: 'News', status: 'Trusted', lastChecked: '2025-09-01' },
  { id: 'src_009', name: 'The Wire', domain: 'thewire.in', score: 78, category: 'News', status: 'Moderate', lastChecked: '2025-09-01' },
  { id: 'src_010', name: 'Unknown Health Blog', domain: 'health-miracle-cures.xyz', score: 5, category: 'Blog', status: 'Untrusted', lastChecked: '2025-09-01' },
];

// ── Evidence ─────────────────────────────────────────────

export const mockEvidence = {
  nr_001: {
    supporting: [
      {
        id: 'ev_001',
        text: 'The government has been exploring various direct benefit transfer mechanisms, confirmed by a Finance Ministry spokesperson.',
        source: 'Economic Times, Sep 10 2025',
        credibility: 82,
      },
      {
        id: 'ev_002',
        text: 'Some states have recently announced smaller-scale cash relief programs for farmers.',
        source: 'India Today, Sep 8 2025',
        credibility: 85,
      },
    ],
    contradicting: [
      {
        id: 'ev_003',
        text: 'Ministry of Finance officially denied any such universal cash transfer scheme in a press conference held today.',
        source: 'Ministry of Finance Press Release, Sep 13 2025',
        credibility: 98,
      },
      {
        id: 'ev_004',
        text: 'PIB Fact Check officially flagged this claim as false.',
        source: 'PIB Fact Check, Sep 13 2025',
        credibility: 98,
      },
    ],
  },
  nr_002: {
    supporting: [
      {
        id: 'ev_005',
        text: 'ISRO confirmed the successful launch with telemetry data showing satellite in target orbit.',
        source: 'ISRO Official, Sep 12 2025',
        credibility: 98,
      },
      {
        id: 'ev_006',
        text: 'Multiple international space agencies acknowledged the successful launch.',
        source: 'NASA, ESA Social Media, Sep 12 2025',
        credibility: 95,
      },
    ],
    contradicting: [],
  },
};

// ── ML Predictions (Stage 1: Placeholder values) ─────────

export const mockMLPerformance = {
  models: [
    { name: 'Logistic Regression', accuracy: null, precision: null, recall: null, f1: null, status: 'pending' },
    { name: 'Support Vector Machine (SVM)', accuracy: null, precision: null, recall: null, f1: null, status: 'pending' },
    { name: 'Naive Bayes', accuracy: null, precision: null, recall: null, f1: null, status: 'pending' },
    { name: 'Random Forest', accuracy: null, precision: null, recall: null, f1: null, status: 'pending' },
    { name: 'BERT (Fine-tuned)', accuracy: null, precision: null, recall: null, f1: null, status: 'planned' },
  ],
  dataset: {
    name: 'To be integrated',
    totalSamples: null,
    fakeCount: null,
    realCount: null,
  },
  note: 'ML model training is scheduled for Stage 3. Accuracy values will be populated after training.',
};
