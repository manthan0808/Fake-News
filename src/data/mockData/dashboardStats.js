// ============================================================
// MOCK DATA — Dashboard Stats, Notifications, Reports
// Stage 2: Replace with API.getDashboardStats() etc.
// ============================================================

// ── Dashboard Stats ──────────────────────────────────────

export const mockDashboardStats = {
  user: {
    totalChecks: 128,
    likelyFake: 32,
    likelyReal: 71,
    misleading: 25,
    recentStreak: 7, // days
    accuracyRate: 89,
  },
  checksOverTime: [
    { date: 'Aug 13', checks: 4 },
    { date: 'Aug 20', checks: 9 },
    { date: 'Aug 27', checks: 14 },
    { date: 'Sep 3', checks: 8 },
    { date: 'Sep 6', checks: 12 },
    { date: 'Sep 8', checks: 7 },
    { date: 'Sep 10', checks: 18 },
    { date: 'Sep 12', checks: 11 },
    { date: 'Sep 13', checks: 6 },
  ],
  categoryBreakdown: [
    { category: 'Politics', count: 38 },
    { category: 'Health', count: 24 },
    { category: 'Technology', count: 19 },
    { category: 'Business', count: 21 },
    { category: 'Science', count: 14 },
    { category: 'Sports', count: 8 },
    { category: 'General', count: 4 },
  ],
  credibilityDistribution: [
    { range: '0–20', count: 28 },
    { range: '21–40', count: 19 },
    { range: '41–60', count: 32 },
    { range: '61–80', count: 31 },
    { range: '81–100', count: 18 },
  ],
};

export const mockAdminStats = {
  totalUsers: 1245,
  newsChecked: 8421,
  fakeDetected: 2130,
  realDetected: 4872,
  misleadingDetected: 1100,
  reportsSubmitted: 319,
  sourcesTracked: 127,
  dailyAnalyses: [
    { date: 'Sep 7', count: 890 },
    { date: 'Sep 8', count: 1020 },
    { date: 'Sep 9', count: 940 },
    { date: 'Sep 10', count: 1150 },
    { date: 'Sep 11', count: 870 },
    { date: 'Sep 12', count: 1380 },
    { date: 'Sep 13', count: 1171 },
  ],
  userGrowth: [
    { month: 'Apr', users: 450 },
    { month: 'May', users: 620 },
    { month: 'Jun', users: 780 },
    { month: 'Jul', users: 920 },
    { month: 'Aug', users: 1080 },
    { month: 'Sep', users: 1245 },
  ],
  categoryStats: [
    { category: 'Politics', count: 2840 },
    { category: 'Health', count: 1920 },
    { category: 'Technology', count: 1340 },
    { category: 'Business', count: 1180 },
    { category: 'Science', count: 680 },
    { category: 'Sports', count: 290 },
    { category: 'General', count: 171 },
  ],
};

// ── Notifications ────────────────────────────────────────

export const mockNotifications = [
  {
    id: 'notif_001',
    type: 'analysis_complete',
    title: 'Analysis Complete',
    message: 'Your news analysis for "Government Announces ₹50,000..." is ready.',
    isRead: false,
    timestamp: '2025-09-13T10:31:00Z',
    link: '/result/nr_001',
  },
  {
    id: 'notif_002',
    type: 'new_evidence',
    title: 'New Evidence Available',
    message: 'New contradicting evidence found for a saved article on health claims.',
    isRead: false,
    timestamp: '2025-09-12T16:00:00Z',
    link: '/result/nr_006',
  },
  {
    id: 'notif_003',
    type: 'system',
    title: 'System Update',
    message: 'Our source credibility database has been updated with 24 new sources.',
    isRead: true,
    timestamp: '2025-09-11T09:00:00Z',
    link: null,
  },
  {
    id: 'notif_004',
    type: 'saved_update',
    title: 'Saved Article Updated',
    message: 'A fact-check for your saved ISRO article has been published.',
    isRead: true,
    timestamp: '2025-09-10T14:30:00Z',
    link: '/result/nr_002',
  },
];

// ── Reports ──────────────────────────────────────────────

export const mockReports = [
  {
    id: 'rep_001',
    headline: 'Fake Election Result Leaked Before Counting',
    reporter: 'Priya Shah',
    reason: 'Spreading election misinformation',
    date: '2025-09-12',
    status: 'REVIEWING',
  },
  {
    id: 'rep_002',
    headline: 'Scientists Discover Herb That Cures Diabetes in 7 Days',
    reporter: 'Manthan Patel',
    reason: 'Dangerous health misinformation',
    date: '2025-09-11',
    status: 'VERIFIED',
  },
  {
    id: 'rep_003',
    headline: 'BREAKING: Nuclear Plant Explosion Near Mumbai',
    reporter: 'Raj Kumar',
    reason: 'Creating public panic with false claims',
    date: '2025-09-10',
    status: 'PENDING',
  },
  {
    id: 'rep_004',
    headline: 'PM Announces Free Electricity for All Households',
    reporter: 'Vikram Desai',
    reason: 'Political misinformation',
    date: '2025-09-09',
    status: 'REJECTED',
  },
  {
    id: 'rep_005',
    headline: 'New vaccine causes autism, study reveals',
    reporter: 'Shreya Joshi',
    reason: 'Anti-vaccine misinformation',
    date: '2025-09-08',
    status: 'VERIFIED',
  },
];

// ── Mock AI Chatbot Responses ────────────────────────────

export const mockChatResponses = [
  {
    triggers: ['misleading', 'why misleading', 'flagged'],
    response: 'The article was marked as **Potentially Misleading** because:\n\n• One major claim (₹50,000 to every citizen) was directly contradicted by an official government press release\n• The headline uses highly sensational language and excessive punctuation\n• The source has only moderate credibility (61/100)\n• No author byline is available\n\nSome parts of the article did match verified information, which is why it was not marked as Likely Fake.',
  },
  {
    triggers: ['credibility score', 'score', '46'],
    response: 'The **Credibility Score of 46/100** is calculated based on:\n\n• Source Credibility (61/100) — 30% weight\n• Evidence Strength (42/100) — 30% weight\n• Content Reliability (49/100) — 25% weight\n• Clickbait Score impact — 15% weight\n\nA score below 50 indicates the content is likely unreliable.',
  },
  {
    triggers: ['claim', 'claims', 'verified'],
    response: 'This article contained **5 claims**:\n\n✅ 2 claims were **Supported** by verified sources\n❌ 1 claim was **Contradicted** by official government statements\n❓ 2 claims remain **Unverified** due to lack of credible evidence',
  },
  {
    triggers: ['source', 'website', 'examplenews'],
    response: 'The source **ExampleNews.in** has a credibility score of **61/100 (Moderate)**.\n\nThis means it has published some verified content in the past, but also has a history of sharing unverified claims. It is advisable to cross-check any major news from this source with official or highly-rated sources.',
  },
  {
    triggers: ['fake', 'real', 'how', 'detect'],
    response: 'VerifyAI uses a multi-layer analysis approach:\n\n1. **ML Model** — Analyzes text patterns using trained AI models\n2. **Source Analysis** — Evaluates the credibility of the publishing source\n3. **Claim Extraction** — Identifies key factual claims in the article\n4. **Evidence Retrieval** — Searches trusted databases for supporting or contradicting evidence\n5. **Clickbait Detection** — Identifies sensational language patterns\n\n*Note: The system provides evidence-based assessments, not absolute verdicts.*',
  },
];

export const getAIResponse = (userMessage) => {
  const lower = userMessage.toLowerCase();
  const match = mockChatResponses.find(r => r.triggers.some(t => lower.includes(t)));
  return match?.response || 'I can help you understand this article\'s analysis. You can ask me about the credibility score, specific claims, the source, why it was flagged, or how the detection works. What would you like to know?';
};
