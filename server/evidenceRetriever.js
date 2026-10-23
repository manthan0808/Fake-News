/**
 * Evidence Retriever: Live Multi-Source Retrieval & Source Independence Analyzer
 */

const WIRE_SERVICES = [
  { name: 'Reuters', patterns: [/\breuters\b/i, /thomson reuters/i] },
  { name: 'Associated Press', patterns: [/\bassociated press\b/i, /\bap news\b/i, /\(ap\)/i] },
  { name: 'Agence France-Presse (AFP)', patterns: [/\bafp\b/i, /agence france/i] },
  { name: 'Press Trust of India (PTI)', patterns: [/\bpti\b/i, /press trust of india/i] },
  { name: 'Asian News International (ANI)', patterns: [/\bani\b/i, /asian news international/i] },
  { name: 'BBC News', patterns: [/\bbbc\b/i, /bbc news/i] }
];

/**
 * Live Wikipedia Search and Summary API
 */
export async function queryWikipedia(query, lang = 'en') {
  const wikiDomain = lang === 'gu' ? 'gu.wikipedia.org' : 'en.wikipedia.org';
  const cleanQuery = query.replace(/[^\w\s\u0A80-\u0AFF]/g, ' ').trim().slice(0, 100);

  if (!cleanQuery) return null;

  try {
    const searchUrl = `https://${wikiDomain}/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQuery)}&limit=3&namespace=0&format=json`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'VeriScope-ProofDesk/2.0 (research minor project; contact: student@edu)' },
      signal: AbortSignal.timeout(4000)
    });

    if (!res.ok) return null;
    const data = await res.json();
    
    // OpenSearch format: [query, [titles], [descriptions], [urls]]
    const titles = data[1] || [];
    const snippets = data[2] || [];
    const urls = data[3] || [];

    if (titles.length === 0) return null;

    // Pick top matching article snippet
    const evidenceItems = [];
    for (let i = 0; i < titles.length; i++) {
      if (snippets[i] && snippets[i].length > 20) {
        evidenceItems.push({
          sourceName: `Wikipedia (${titles[i]})`,
          url: urls[i],
          snippet: snippets[i],
          type: 'encyclopedic_archive',
          sourceDomain: wikiDomain,
          retrievedAt: new Date().toISOString()
        });
      }
    }

    return evidenceItems.length > 0 ? evidenceItems : null;
  } catch (err) {
    // Wikipedia API call failed or timed out
    return null;
  }
}

/**
 * Live DuckDuckGo Instant Answer API for quick factual entities
 */
export async function queryDuckDuckGo(query) {
  const clean = query.replace(/[^\w\s]/g, ' ').trim().slice(0, 90);
  if (!clean) return null;

  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(clean)}&format=json&no_html=1&skip_disambig=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VeriScope-ProofDesk/2.0' },
      signal: AbortSignal.timeout(4000)
    });

    if (!res.ok) return null;
    const data = await res.json();

    const results = [];
    if (data.AbstractText && data.AbstractURL) {
      results.push({
        sourceName: data.AbstractSource || 'DuckDuckGo Knowledge Base',
        url: data.AbstractURL,
        snippet: data.AbstractText,
        type: 'knowledge_graph',
        sourceDomain: 'duckduckgo.com',
        retrievedAt: new Date().toISOString()
      });
    }

    if (Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 2)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            sourceName: 'Corroborating Web Entity',
            url: topic.FirstURL,
            snippet: topic.Text,
            type: 'web_corroboration',
            sourceDomain: 'duckduckgo.com',
            retrievedAt: new Date().toISOString()
          });
        }
      }
    }

    return results.length > 0 ? results : null;
  } catch (err) {
    return null;
  }
}

/**
 * Detects if multiple articles or claims share a single primary wire agency
 */
export function analyzeSourceIndependence(textSnippets = []) {
  const detectedWires = new Set();

  for (const snippet of textSnippets) {
    for (const wire of WIRE_SERVICES) {
      if (wire.patterns.some(p => p.test(snippet))) {
        detectedWires.add(wire.name);
      }
    }
  }

  const wireList = Array.from(detectedWires);
  const isSyndicated = wireList.length > 0;

  return {
    isIndependent: !isSyndicated || wireList.length > 1,
    syndicatedVia: wireList,
    note: isSyndicated 
      ? `Identified common primary wire syndicate (${wireList.join(', ')}). Multiple republishers may share the identical origin source.`
      : 'Sources demonstrate independent reporting or direct primary attribution.'
  };
}

/**
 * Orchestrates multi-source evidence collection for a claim
 */
export async function retrieveEvidenceForClaim(claim) {
  const query = claim.searchQuery || claim.text;
  const lang = claim.originalLanguage || 'en';

  const [wikiEvidence, ddgEvidence] = await Promise.all([
    queryWikipedia(query, lang),
    lang === 'en' ? queryDuckDuckGo(query) : Promise.resolve(null)
  ]);

  const allEvidence = [];
  if (wikiEvidence) allEvidence.push(...wikiEvidence);
  if (ddgEvidence) allEvidence.push(...ddgEvidence);

  // Analyze source independence across retrieved snippets
  const snippets = allEvidence.map(e => `${e.sourceName} ${e.snippet}`);
  const independence = analyzeSourceIndependence(snippets);

  return {
    claimId: claim.id,
    evidenceFound: allEvidence.length > 0,
    evidenceItems: allEvidence,
    sourceIndependence: independence,
    searchQueryUsed: query
  };
}
