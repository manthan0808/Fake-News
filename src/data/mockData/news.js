// ============================================================
// MOCK DATA — News Analyses
// Stage 2: Replace with API.getNewsChecks(), API.getNewsById()
// ============================================================

export const ASSESSMENTS = {
  LIKELY_FAKE: 'LIKELY_FAKE',
  LIKELY_REAL: 'LIKELY_REAL',
  MISLEADING: 'MISLEADING',
  UNVERIFIED: 'UNVERIFIED',
};

export const ASSESSMENT_LABELS = {
  LIKELY_FAKE: 'Likely Fake',
  LIKELY_REAL: 'Likely Real',
  MISLEADING: 'Potentially Misleading',
  UNVERIFIED: 'Unverified',
};

export const ASSESSMENT_BADGE_CLASS = {
  LIKELY_FAKE: 'badge-fake',
  LIKELY_REAL: 'badge-real',
  MISLEADING: 'badge-misleading',
  UNVERIFIED: 'badge-unverified',
};

// Full detailed mock result — used on Result Page
export const MOCK_RESULT_1 = {
  id: 'nr_001',
  headline: 'Government Announces ₹50,000 Cash Transfer to Every Indian Citizen Starting Tomorrow',
  content: `The central government has reportedly announced a massive cash transfer scheme that will provide ₹50,000 to every Indian citizen beginning tomorrow. Sources close to the government claim that this announcement was made in an emergency session.

EVERY CITIZEN WILL RECEIVE ₹50,000 TOMORROW!!! The scheme, which has not been confirmed by any official government portal, is said to cover all citizens above 18 years of age. Officials have not yet published any official notification regarding this scheme.

Multiple news portals have reported this story, though no official press release or government circular has been issued. Financial experts have raised serious doubts about the feasibility of such a scheme given the current fiscal situation.`,
  inputType: 'text',
  url: null,
  analysisDate: '2025-09-13T10:30:00Z',
  assessment: 'MISLEADING',
  credibilityScore: 46,
  confidence: 82,
  scores: {
    sourceCredibility: 61,
    clickbait: 78,
    evidenceStrength: 42,
    contentReliability: 49,
  },
  sentiment: { positive: 15, neutral: 23, negative: 62 },
  emotionalIndicators: { fear: 45, anger: 30, surprise: 65, urgency: 80 },
  category: 'Politics',
  topic: 'Government Policy',
  source: {
    name: 'ExampleNews.in',
    url: 'https://examplenews.in',
    score: 61,
    httpsSecure: true,
    authorAvailable: false,
    dateAvailable: true,
    historyNote: 'Moderate reliability — some verified content, some unverified claims in the past.',
  },
  highlightedText: [
    { text: 'The central government has reportedly announced a massive cash transfer scheme that will provide ₹50,000 to every Indian citizen beginning tomorrow.', riskLevel: 'HIGH' },
    { text: 'Sources close to the government claim that this announcement was made in an emergency session.', riskLevel: 'MEDIUM' },
    { text: 'EVERY CITIZEN WILL RECEIVE ₹50,000 TOMORROW!!!', riskLevel: 'HIGH' },
    { text: 'Officials have not yet published any official notification regarding this scheme.', riskLevel: 'LOW' },
    { text: 'Multiple news portals have reported this story, though no official press release or government circular has been issued.', riskLevel: 'MEDIUM' },
    { text: 'Financial experts have raised serious doubts about the feasibility of such a scheme given the current fiscal situation.', riskLevel: 'LOW' },
  ],
  explanation: 'The article contains a highly sensational headline and one major claim (₹50,000 to every citizen) could not be supported by any verifiable evidence from official government sources. The source has moderate credibility, and while some parts of the article match information reported by other publications, the core claim remains unsubstantiated. Emotional language, capitalized text, and excessive punctuation are detected, consistent with clickbait patterns.',
  isSaved: false,
};

export const MOCK_RESULT_2 = {
  id: 'nr_002',
  headline: 'ISRO Successfully Launches New Earth Observation Satellite RISAT-2BR2',
  content: 'The Indian Space Research Organisation (ISRO) successfully launched the RISAT-2BR2 Earth observation satellite from the Satish Dhawan Space Centre in Sriharikota. The satellite, equipped with advanced synthetic aperture radar, will be used for agricultural monitoring and disaster management.',
  inputType: 'url',
  url: 'https://isro.gov.in/launches/risat',
  analysisDate: '2025-09-12T14:20:00Z',
  assessment: 'LIKELY_REAL',
  credibilityScore: 91,
  confidence: 94,
  scores: {
    sourceCredibility: 95,
    clickbait: 12,
    evidenceStrength: 88,
    contentReliability: 92,
  },
  sentiment: { positive: 68, neutral: 28, negative: 4 },
  emotionalIndicators: { fear: 2, anger: 1, surprise: 15, urgency: 5 },
  category: 'Science',
  topic: 'Space Exploration',
  source: {
    name: 'ISRO Official',
    url: 'https://isro.gov.in',
    score: 95,
    httpsSecure: true,
    authorAvailable: true,
    dateAvailable: true,
    historyNote: 'Official government source — highly reliable.',
  },
  highlightedText: [
    { text: 'The Indian Space Research Organisation (ISRO) successfully launched the RISAT-2BR2 Earth observation satellite', riskLevel: 'LOW' },
    { text: 'from the Satish Dhawan Space Centre in Sriharikota.', riskLevel: 'LOW' },
  ],
  explanation: 'The article is sourced directly from ISRO\'s official website. All claims are verifiable through public launch records and official press releases. No emotional manipulation or clickbait patterns detected. The information is consistent across multiple reliable sources.',
  isSaved: true,
};

export const MOCK_RESULT_3 = {
  id: 'nr_003',
  headline: 'Scientists Discover Simple Herb That Completely Cures Diabetes in 7 Days!',
  content: 'A groundbreaking discovery by anonymous researchers claims that a common household herb can cure type-2 diabetes in just one week. The miracle cure has allegedly been suppressed by pharmaceutical companies for decades.',
  inputType: 'text',
  url: null,
  analysisDate: '2025-09-11T09:15:00Z',
  assessment: 'LIKELY_FAKE',
  credibilityScore: 8,
  confidence: 96,
  scores: {
    sourceCredibility: 12,
    clickbait: 97,
    evidenceStrength: 3,
    contentReliability: 6,
  },
  sentiment: { positive: 35, neutral: 15, negative: 50 },
  emotionalIndicators: { fear: 25, anger: 10, surprise: 70, urgency: 85 },
  category: 'Health',
  topic: 'Medical Claims',
  source: { name: 'Unknown Blog', url: null, score: 12, httpsSecure: false, authorAvailable: false, dateAvailable: false, historyNote: 'Source not found or unverifiable.' },
  highlightedText: [
    { text: 'Scientists Discover Simple Herb That Completely Cures Diabetes in 7 Days!', riskLevel: 'HIGH' },
    { text: 'anonymous researchers', riskLevel: 'HIGH' },
    { text: 'miracle cure has allegedly been suppressed by pharmaceutical companies', riskLevel: 'HIGH' },
  ],
  explanation: 'This article exhibits virtually every indicator of health misinformation: anonymous sources, extraordinary unsubstantiated claims, conspiracy framing, and extremely high clickbait scores. No peer-reviewed research supports a cure for type-2 diabetes through any single herbal intervention. Multiple fact-checking organizations have flagged similar claims.',
  isSaved: false,
};

// History — list view
export const mockNewsHistory = [
  {
    id: 'nr_001',
    headline: 'Government Announces ₹50,000 Cash Transfer to Every Indian Citizen Starting Tomorrow',
    assessment: 'MISLEADING',
    credibilityScore: 46,
    analysisDate: '2025-09-13T10:30:00Z',
    category: 'Politics',
    inputType: 'text',
    isSaved: false,
  },
  {
    id: 'nr_002',
    headline: 'ISRO Successfully Launches New Earth Observation Satellite RISAT-2BR2',
    assessment: 'LIKELY_REAL',
    credibilityScore: 91,
    analysisDate: '2025-09-12T14:20:00Z',
    category: 'Science',
    inputType: 'url',
    isSaved: true,
  },
  {
    id: 'nr_003',
    headline: 'Scientists Discover Simple Herb That Completely Cures Diabetes in 7 Days!',
    assessment: 'LIKELY_FAKE',
    credibilityScore: 8,
    analysisDate: '2025-09-11T09:15:00Z',
    category: 'Health',
    inputType: 'text',
    isSaved: false,
  },
  {
    id: 'nr_004',
    headline: 'New AI Technology Can Read Your Mind Through Smartphone Camera',
    assessment: 'LIKELY_FAKE',
    credibilityScore: 14,
    analysisDate: '2025-09-10T16:45:00Z',
    category: 'Technology',
    inputType: 'text',
    isSaved: false,
  },
  {
    id: 'nr_005',
    headline: 'Reserve Bank of India Announces 0.25% Repo Rate Cut',
    assessment: 'LIKELY_REAL',
    credibilityScore: 88,
    analysisDate: '2025-09-09T11:00:00Z',
    category: 'Business',
    inputType: 'url',
    isSaved: true,
  },
  {
    id: 'nr_006',
    headline: 'Drinking Hot Water With Turmeric Every Morning Prevents All Types of Cancer',
    assessment: 'MISLEADING',
    credibilityScore: 32,
    analysisDate: '2025-09-08T08:30:00Z',
    category: 'Health',
    inputType: 'text',
    isSaved: false,
  },
  {
    id: 'nr_007',
    headline: 'India GDP Growth Rate Reaches 7.8% in Q2 2025, Beats Estimates',
    assessment: 'LIKELY_REAL',
    credibilityScore: 84,
    analysisDate: '2025-09-07T13:15:00Z',
    category: 'Business',
    inputType: 'url',
    isSaved: true,
  },
  {
    id: 'nr_008',
    headline: 'Viral Video Shows Elephant Speaking Hindi in Kerala Village',
    assessment: 'LIKELY_FAKE',
    credibilityScore: 5,
    analysisDate: '2025-09-06T19:00:00Z',
    category: 'General',
    inputType: 'image',
    isSaved: false,
  },
  {
    id: 'nr_009',
    headline: 'New Education Policy Mandates Coding from Class 1 Across All Schools',
    assessment: 'UNVERIFIED',
    credibilityScore: 55,
    analysisDate: '2025-09-05T10:20:00Z',
    category: 'Education',
    inputType: 'text',
    isSaved: false,
  },
  {
    id: 'nr_010',
    headline: 'India Wins 12 Gold Medals at 2025 World Athletics Championships',
    assessment: 'LIKELY_REAL',
    credibilityScore: 93,
    analysisDate: '2025-09-04T21:00:00Z',
    category: 'Sports',
    inputType: 'url',
    isSaved: false,
  },
];

// Saved news (subset)
export const mockSavedNews = mockNewsHistory.filter(n => n.isSaved);

// Get full result by id
export const getMockResultById = (id) => {
  const results = [MOCK_RESULT_1, MOCK_RESULT_2, MOCK_RESULT_3];
  return results.find(r => r.id === id) || MOCK_RESULT_1;
};
