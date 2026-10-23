/**
 * Claim Extractor & Cross-Language Processor (English & Gujarati)
 */

// Gujarati script detection range: U+0A80 to U+0AFF
export function detectLanguage(text) {
  const gujaratiRegex = /[\u0A80-\u0AFF]/g;
  const gujaratiMatches = text.match(gujaratiRegex);
  if (gujaratiMatches && gujaratiMatches.length > 10) {
    return 'gu';
  }
  return 'en';
}

/**
 * Filter out boilerplate / conversational sentences
 */
function isCheckableFactualClaim(sentence) {
  const clean = sentence.trim();
  if (clean.length < 25 || clean.length > 300) return false;

  // Filter questions and imperatives
  if (clean.endsWith('?')) return false;
  if (/^(click here|subscribe|share this|follow us|read more|sign up|leave a comment)/i.test(clean)) return false;
  if (/^(i think|in my opinion|we believe|it seems to me|i feel)/i.test(clean)) return false;

  // Prefer sentences with concrete factual indicators:
  // Numbers, years, percentages, currencies, or named entities/actions
  const hasFactualSignal = 
    /\b(19\d\d|20\d\d|\d+(?:\.\d+)?%|\$\d+|\d+\s*(?:crore|lakh|million|billion|deaths|cases|percent|meters|km))\b/i.test(clean) ||
    /\b(confirmed|announced|discovered|approved|banned|signed|passed|reported|found|stated|declared|vaccine|government|court|police|isro|who|un|ministry)\b/i.test(clean) ||
    /[\u0A80-\u0AFF]/.test(clean); // Gujarati factual sentences

  return hasFactualSignal;
}

/**
 * Common Gujarati to English topical dictionary for search keyword expansion
 */
const GUJARATI_TRANSLATION_MAP = {
  'સરકાર': 'government',
  'ગુજરાત': 'Gujarat',
  'અમદાવાદ': 'Ahmedabad',
  'સુરત': 'Surat',
  'વડાપ્રધાન': 'Prime Minister',
  'મોદી': 'Modi',
  'પોલીસ': 'police',
  'કોર્ટ': 'court',
  'સુપ્રીમ કોર્ટ': 'Supreme Court',
  'ચૂંટણી': 'election',
  'બજેટ': 'budget',
  'કોરોના': 'coronavirus COVID-19',
  'રસી': 'vaccine',
  'સાયક્લોન': 'cyclone',
  'વાવાઝોડું': 'cyclone storm',
  'આરોગ્ય': 'health',
  'શિક્ષણ': 'education',
  'વિદ્યાર્થી': 'student',
  'ભારત': 'India',
  'ઇસરો': 'ISRO',
  'નિધન': 'death passed away',
  'લાખ': 'lakh',
  'કરોડ': 'crore'
};

/**
 * Generates an English search query from a Gujarati claim
 */
export function buildSearchQueryForGujarati(claimText) {
  let englishQuery = [];
  for (const [gu, en] of Object.entries(GUJARATI_TRANSLATION_MAP)) {
    if (claimText.includes(gu)) {
      englishQuery.push(en);
    }
  }

  // Also include any Latin/English terms or numbers already inside the Gujarati claim
  const alphanumeric = claimText.match(/[A-Za-z0-9]+/g);
  if (alphanumeric) {
    englishQuery.push(...alphanumeric);
  }

  return englishQuery.length > 0 ? englishQuery.join(' ') : claimText;
}

/**
 * Extracts distinct checkable claims from article text
 */
export function extractClaims(bodyText, headline = '', language = 'en') {
  const combined = headline ? `${headline}. ${bodyText}` : bodyText;
  
  // Sentence splitting supporting English and Gujarati punctuation
  const rawSentences = combined
    .replace(/([.!?।])\s+/g, '$1|SPLIT|')
    .split('|SPLIT|')
    .map(s => s.trim())
    .filter(s => s.length > 20);

  const candidates = [];
  const seen = new Set();

  // Always include headline if checkable
  if (headline && headline.length > 15) {
    candidates.push({
      id: `clm_0`,
      text: headline.trim(),
      isHeadline: true,
      originalLanguage: detectLanguage(headline),
      category: 'Headline Claim'
    });
    seen.add(headline.toLowerCase().trim());
  }

  for (let i = 0; i < rawSentences.length; i++) {
    const s = rawSentences[i];
    const normalized = s.toLowerCase();

    if (seen.has(normalized)) continue;
    if (!isCheckableFactualClaim(s)) continue;

    const lang = detectLanguage(s);
    let searchQuery = s;

    if (lang === 'gu') {
      searchQuery = buildSearchQueryForGujarati(s);
    } else {
      // Strip common introductory filler
      searchQuery = s
        .replace(/^(according to reports|sources say|officials stated that|as per reports),?\s*/i, '')
        .slice(0, 150);
    }

    candidates.push({
      id: `clm_${candidates.length + 1}`,
      text: s,
      isHeadline: false,
      originalLanguage: lang,
      searchQuery: searchQuery.trim(),
      englishTranslation: lang === 'gu' ? buildSearchQueryForGujarati(s) : null,
      offsetSentenceIndex: i
    });

    seen.add(normalized);

    // Minor project balance: 4 to 6 core checkable claims per article
    if (candidates.length >= 6) break;
  }

  // If no specific factual claims passed heuristic, take top 2 sentences
  if (candidates.length === 0 && rawSentences.length > 0) {
    candidates.push({
      id: `clm_1`,
      text: rawSentences[0],
      isHeadline: false,
      originalLanguage: detectLanguage(rawSentences[0]),
      searchQuery: rawSentences[0].slice(0, 120)
    });
  }

  return candidates;
}
