/**
 * VeriScope Source Registry
 * Curated registry of verified Indian television, digital news, national newspapers,
 * regional Gujarati outlets, and official government/primary knowledge repositories.
 */

export const SOURCE_REGISTRY = [
  // ── Indian Television & Digital News Sources ──────────────────
  { id: 'src_republic', name: 'Republic World', domain: 'republicworld.com', category: 'TV & Digital News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_indiatoday', name: 'India Today', domain: 'indiatoday.in', category: 'TV & Digital News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_aajtak', name: 'Aaj Tak', domain: 'aajtak.in', category: 'TV & Digital News (Hindi)', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_ndtv', name: 'NDTV', domain: 'ndtv.com', category: 'TV & Digital News', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },
  { id: 'src_timesnow', name: 'Times Now', domain: 'timesnownews.com', category: 'TV & Digital News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_cnbctv18', name: 'CNBC-TV18', domain: 'cnbctv18.com', category: 'Business Television', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },
  { id: 'src_news18', name: 'CNN-News18 / News18', domain: 'news18.com', category: 'TV & Digital News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_abp', name: 'ABP News', domain: 'abplive.com', category: 'TV & Digital News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_zeenews', name: 'Zee News', domain: 'zeenews.india.com', category: 'TV & Digital News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_tv9', name: 'TV9 Bharatvarsh', domain: 'tv9hindi.com', category: 'TV & Digital News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_indiatv', name: 'India TV', domain: 'indiatvnews.com', category: 'TV & Digital News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_wion', name: 'WION', domain: 'wionews.com', category: 'International News', reliabilityTier: 'Mainstream', searchMethod: 'News RSS / Live Index' },
  { id: 'src_ddnews', name: 'DD News', domain: 'ddnews.gov.in', category: 'Public Broadcaster', reliabilityTier: 'Official State', searchMethod: 'Official Portal' },
  { id: 'src_theprint', name: 'ThePrint', domain: 'theprint.in', category: 'Digital Investigative', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },
  { id: 'src_thequint', name: 'The Quint', domain: 'thequint.com', category: 'Digital News & Fact-Check', reliabilityTier: 'IFCN Signatory', searchMethod: 'News RSS / Live Index' },
  { id: 'src_scroll', name: 'Scroll.in', domain: 'scroll.in', category: 'Digital Journalism', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },
  { id: 'src_thewire', name: 'The Wire', domain: 'thewire.in', category: 'Digital Independent', reliabilityTier: 'Independent', searchMethod: 'News RSS / Live Index' },
  { id: 'src_tnm', name: 'The News Minute', domain: 'thenewsminute.com', category: 'Regional Digital', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },

  // ── Primary News Wire Services ──────────────────────────────
  { id: 'src_ani', name: 'ANI News', domain: 'aninews.in', category: 'Primary Wire Syndicate', reliabilityTier: 'Wire Agency', searchMethod: 'News Wire Feed' },
  { id: 'src_pti', name: 'Press Trust of India (PTI)', domain: 'ptinews.com', category: 'Primary Wire Syndicate', reliabilityTier: 'National Wire Agency', searchMethod: 'News Wire Feed' },
  { id: 'src_reuters', name: 'Reuters', domain: 'reuters.com', category: 'Global Wire Agency', reliabilityTier: 'Gold Standard Wire', searchMethod: 'Wire Feed' },
  { id: 'src_ap', name: 'Associated Press', domain: 'apnews.com', category: 'Global Wire Agency', reliabilityTier: 'Gold Standard Wire', searchMethod: 'Wire Feed' },

  // ── National Newspapers & Business Publications ───────────────
  { id: 'src_toi', name: 'The Times of India', domain: 'timesofindia.indiatimes.com', category: 'National Daily', reliabilityTier: 'Leading National Daily', searchMethod: 'News RSS / Live Index' },
  { id: 'src_thehindu', name: 'The Hindu', domain: 'thehindu.com', category: 'National Daily', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },
  { id: 'src_indianexpress', name: 'The Indian Express', domain: 'indianexpress.com', category: 'National Daily', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },
  { id: 'src_ht', name: 'Hindustan Times', domain: 'hindustantimes.com', category: 'National Daily', reliabilityTier: 'Leading National Daily', searchMethod: 'News RSS / Live Index' },
  { id: 'src_telegraph', name: 'The Telegraph India', domain: 'telegraphindia.com', category: 'National Daily', reliabilityTier: 'Mainstream Daily', searchMethod: 'News RSS / Live Index' },
  { id: 'src_deccan', name: 'Deccan Herald', domain: 'deccanherald.com', category: 'Regional / National Daily', reliabilityTier: 'Mainstream Daily', searchMethod: 'News RSS / Live Index' },
  { id: 'src_tribune', name: 'The Tribune', domain: 'tribuneindia.com', category: 'Regional Daily', reliabilityTier: 'Mainstream Daily', searchMethod: 'News RSS / Live Index' },
  { id: 'src_mint', name: 'Livemint / Mint', domain: 'livemint.com', category: 'Financial Daily', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },
  { id: 'src_bs', name: 'Business Standard', domain: 'business-standard.com', category: 'Financial Daily', reliabilityTier: 'High Accountability', searchMethod: 'News RSS / Live Index' },
  { id: 'src_et', name: 'The Economic Times', domain: 'economictimes.indiatimes.com', category: 'Financial Daily', reliabilityTier: 'Leading Financial Daily', searchMethod: 'News RSS / Live Index' },
  { id: 'src_fe', name: 'Financial Express', domain: 'financialexpress.com', category: 'Financial Daily', reliabilityTier: 'Mainstream Financial', searchMethod: 'News RSS / Live Index' },
  { id: 'src_bhaskar', name: 'Dainik Bhaskar', domain: 'bhaskar.com', category: 'National Hindi Daily', reliabilityTier: 'Major Vernacular Daily', searchMethod: 'News RSS / Live Index' },
  { id: 'src_jagran', name: 'Dainik Jagran', domain: 'jagran.com', category: 'National Hindi Daily', reliabilityTier: 'Major Vernacular Daily', searchMethod: 'News RSS / Live Index' },
  { id: 'src_amarujala', name: 'Amar Ujala', domain: 'amarujala.com', category: 'National Hindi Daily', reliabilityTier: 'Major Vernacular Daily', searchMethod: 'News RSS / Live Index' },

  // ── Regional Gujarati Outlets ─────────────────────────────────
  { id: 'src_divyabhaskar', name: 'Divya Bhaskar', domain: 'divyabhaskar.co.in', category: 'Regional Gujarati Daily', reliabilityTier: 'Leading Gujarati Media', searchMethod: 'Vernacular RSS / Web' },
  { id: 'src_gujaratsamachar', name: 'Gujarat Samachar', domain: 'gujaratsamachar.com', category: 'Regional Gujarati Daily', reliabilityTier: 'Leading Gujarati Media', searchMethod: 'Vernacular RSS / Web' },
  { id: 'src_sandesh', name: 'Sandesh', domain: 'sandesh.com', category: 'Regional Gujarati Daily', reliabilityTier: 'Leading Gujarati Media', searchMethod: 'Vernacular RSS / Web' },

  // ── Official & Primary Government Portals ─────────────────────
  { id: 'src_pib', name: 'Press Information Bureau (PIB)', domain: 'pib.gov.in', category: 'Government Information Official', reliabilityTier: 'Primary Government Record', searchMethod: 'PIB Releases / FactCheck' },
  { id: 'src_isro', name: 'Indian Space Research Organisation (ISRO)', domain: 'isro.gov.in', category: 'Government Scientific Agency', reliabilityTier: 'Primary Official Record', searchMethod: 'Scientific Announcements' },
  { id: 'src_sci', name: 'Supreme Court of India', domain: 'sci.gov.in', category: 'Judicial Authority', reliabilityTier: 'Primary Legal Record', searchMethod: 'Judgments / Orders' },
  { id: 'src_who', name: 'World Health Organization (WHO)', domain: 'who.int', category: 'International Public Health', reliabilityTier: 'Intergovernmental Official', searchMethod: 'Health Bulletins' },
  { id: 'src_nature', name: 'Nature Publishing Group', domain: 'nature.com', category: 'Scientific Peer-Reviewed Journal', reliabilityTier: 'Gold Standard Academic', searchMethod: 'Scholarly Archive' },
  { id: 'src_plos', name: 'Public Library of Science (PLOS)', domain: 'plos.org', category: 'Open-Access Scientific Journal', reliabilityTier: 'Gold Standard Academic', searchMethod: 'Scholarly Archive' }
];

/**
 * Matches a detected article URL or publisher title against our source registry
 */
export function identifyPublisher(sourceUrl = '', rawPublisherName = '') {
  let domain = '';
  try {
    if (sourceUrl) {
      domain = new URL(sourceUrl).hostname.replace(/^www\./, '').toLowerCase();
    }
  } catch (e) {
    domain = '';
  }

  // First try domain matching
  if (domain) {
    const matchedByDomain = SOURCE_REGISTRY.find(s => domain.includes(s.domain) || s.domain.includes(domain));
    if (matchedByDomain) return matchedByDomain;
  }

  // Next try name matching
  if (rawPublisherName) {
    const cleanName = rawPublisherName.toLowerCase();
    const matchedByName = SOURCE_REGISTRY.find(s => cleanName.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(cleanName));
    if (matchedByName) return matchedByName;
  }

  // Fallback for general independent publisher
  return {
    id: `src_ext_${domain.replace(/[^a-z0-9]/g, '_') || 'unknown'}`,
    name: rawPublisherName || (domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'Independent Digital Publisher'),
    domain: domain || 'external-source.org',
    category: 'Independent Web Media',
    reliabilityTier: 'General Public Reporting',
    searchMethod: 'Web Retrieval'
  };
}
