/**
 * Multi-Source Evidence Retrieval & Search Aggregation Engine
 * Queries live news feeds, encyclopedia archives, wire syndicates, and official records.
 */

import { generateSearchQueries } from './queryEngine.js';
import { identifyPublisher } from './sourceRegistry.js';

const WIRE_SERVICES = [
  { name: 'Press Trust of India (PTI)', patterns: [/\bpti\b/i, /press trust of india/i] },
  { name: 'Asian News International (ANI)', patterns: [/\bani\b/i, /asian news international/i] },
  { name: 'Reuters', patterns: [/\breuters\b/i, /thomson reuters/i] },
  { name: 'Associated Press (AP)', patterns: [/\bassociated press\b/i, /\(ap\)/i] },
  { name: 'Agence France-Presse (AFP)', patterns: [/\bafp\b/i, /agence france/i] }
];

/**
 * Provider 1: Live News Search (Google News RSS Feed)
 * Indexes national and regional Indian publications in real time
 */
export async function queryNewsProvider(queryText, language = 'en') {
  const gl = 'IN';
  const hl = language === 'gu' ? 'gu-IN' : 'en-IN';
  const ceid = language === 'gu' ? 'IN:gu' : 'IN:en';

  const cleanQuery = encodeURIComponent(queryText.trim().slice(0, 100));
  const url = `https://news.google.com/rss/search?q=${cleanQuery}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 VeriScope-ProofDesk/2.4',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) return { provider: 'GoogleNewsRSS', status: 'error', items: [] };

    const xml = await res.text();
    const items = [];

    // Simple robust regex parsing of RSS <item> tags
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const itemBlock = match[1];

      // Extract Title & Publisher
      const titleMatch = itemBlock.match(/<title>([\s\S]*?)<\/title>/i);
      let rawTitle = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : '';

      // Google News format usually puts "Article Title - Publisher Name"
      let articleTitle = rawTitle;
      let publisherName = '';
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ');
        publisherName = parts.pop().trim();
        articleTitle = parts.join(' - ').trim();
      }

      // Extract Link
      const linkMatch = itemBlock.match(/<link>([\s\S]*?)<\/link>/i);
      const articleUrl = linkMatch ? linkMatch[1].trim() : '';

      // Extract PubDate
      const dateMatch = itemBlock.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

      // Extract Source tag if available: <source url="...">Publisher</source>
      const sourceMatch = itemBlock.match(/<source[^>]*url=["']([^"']+)["'][^>]*>([\s\S]*?)<\/source>/i);
      if (sourceMatch) {
        if (!publisherName) publisherName = sourceMatch[2].trim();
      }

      // Extract Description snippet
      const descMatch = itemBlock.match(/<description>([\s\S]*?)<\/description>/i);
      let snippet = descMatch ? descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : articleTitle;

      if (articleTitle && articleUrl) {
        const publisherInfo = identifyPublisher(articleUrl, publisherName);
        items.push({
          sourceName: publisherInfo.name,
          publisherDomain: publisherInfo.domain,
          reliabilityTier: publisherInfo.reliabilityTier,
          articleTitle: decodeHtmlEntities(articleTitle),
          url: articleUrl,
          snippet: decodeHtmlEntities(snippet || articleTitle),
          publishedAt: pubDate,
          provider: 'News Index'
        });
      }
    }

    return {
      provider: 'News Aggregation Feed',
      status: 'ok',
      items
    };
  } catch (err) {
    return {
      provider: 'News Aggregation Feed',
      status: 'failed',
      error: err.message,
      items: []
    };
  }
}

/**
 * Provider 2: Full-Text Encyclopedia Search (Wikipedia API)
 */
export async function queryWikipediaProvider(queryText, language = 'en') {
  const domain = language === 'gu' ? 'gu.wikipedia.org' : 'en.wikipedia.org';
  const clean = encodeURIComponent(queryText.trim().slice(0, 90));
  const url = `https://${domain}/w/api.php?action=query&list=search&srsearch=${clean}&utf8=1&format=json&srlimit=3`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'VeriScope-ProofDesk/2.4 (BTech Academic Minor Project)' },
      signal: AbortSignal.timeout(4000)
    });

    if (!res.ok) return { provider: 'Wikipedia', status: 'error', items: [] };
    const data = await res.json();
    const searchResults = data?.query?.search || [];

    const items = searchResults.map(entry => {
      const cleanSnippet = entry.snippet.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return {
        sourceName: `Wikipedia (${entry.title})`,
        publisherDomain: domain,
        reliabilityTier: 'Public Encyclopedic Archive',
        articleTitle: entry.title,
        url: `https://${domain}/wiki/${encodeURIComponent(entry.title.replace(/\s+/g, '_'))}`,
        snippet: cleanSnippet,
        publishedAt: entry.timestamp || new Date().toISOString(),
        provider: 'Encyclopedic Knowledge Graph'
      };
    });

    return {
      provider: 'Wikipedia Knowledge API',
      status: 'ok',
      items
    };
  } catch (err) {
    return {
      provider: 'Wikipedia Knowledge API',
      status: 'failed',
      error: err.message,
      items: []
    };
  }
}

/**
 * Helper to decode common HTML entities in title/snippets
 */
function decodeHtmlEntities(str = '') {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * Detects whether multiple sources share the same primary wire service
 */
export function analyzeSourceIndependence(articles = []) {
  const detectedWires = new Set();
  const publisherDomains = new Set();

  for (const art of articles) {
    if (art.publisherDomain) publisherDomains.add(art.publisherDomain);

    const combinedText = `${art.sourceName} ${art.articleTitle} ${art.snippet}`.toLowerCase();
    for (const wire of WIRE_SERVICES) {
      if (wire.patterns.some(p => p.test(combinedText))) {
        detectedWires.add(wire.name);
      }
    }
  }

  const wireList = Array.from(detectedWires);
  const isSyndicated = wireList.length > 0;
  const distinctPublishers = publisherDomains.size || articles.length;
  // Deduplicate syndicated wire copies
  const independentCount = isSyndicated 
    ? Math.max(1, distinctPublishers - wireList.length + 1)
    : distinctPublishers;

  return {
    distinctPublishersCount: distinctPublishers,
    independentSourcesCount: independentCount,
    isSyndicated,
    syndicatedVia: wireList,
    independenceWarning: isSyndicated
      ? `Notice: ${wireList.join(', ')} syndication detected across reports. Multiple outlets share the identical wire wire-copy.`
      : null
  };
}

/**
 * Analyzes whether an evidence snippet SUPPORTS, CONTRADICTS, or DISCUSSES a claim
 */
export function evaluateEvidenceStance(claimText, evidenceSnippet, articleTitle = '') {
  const cleanClaim = claimText.toLowerCase();
  const cleanSnippet = `${articleTitle} ${evidenceSnippet}`.toLowerCase();

  // Contradiction / Debunking cues
  const contradictionWords = [
    'false', 'fake', 'hoax', 'debunked', 'untrue', 'misleading', 'fact check: false',
    'denied by', 'refuted', 'fabricated', 'no evidence', 'rumor', 'not true', 'clarifies false'
  ];
  for (const cw of contradictionWords) {
    if (cleanSnippet.includes(cw)) {
      return {
        stance: 'CONTRADICT',
        rationale: `Evidence snippet explicitly refutes claim with keyword "${cw}".`
      };
    }
  }

  // Extract core keywords from claim
  const claimWords = cleanClaim
    .replace(/[^\w\s\u0A80-\u0AFF]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);

  let matchCount = 0;
  for (const w of claimWords) {
    if (cleanSnippet.includes(w)) matchCount++;
  }

  const matchRatio = claimWords.length > 0 ? matchCount / claimWords.length : 0;

  // Confirmation cues
  const confirmationWords = ['confirmed', 'announced', 'approved', 'inaugurated', 'published', 'reported', 'agreed', 'launched'];
  const hasConfirmationCue = confirmationWords.some(cw => cleanSnippet.includes(cw));

  if (matchRatio >= 0.45 || (matchRatio >= 0.35 && hasConfirmationCue)) {
    return {
      stance: 'SUPPORT',
      rationale: `Corroborating entities and assertions matched across publication reporting.`
    };
  }

  if (matchRatio >= 0.2) {
    return {
      stance: 'DISCUSS',
      rationale: `Publisher covers related subject background without definitively corroborating all details.`
    };
  }

  return {
    stance: 'INCONCLUSIVE',
    rationale: `Peripheral reference; insufficient direct overlap with claim details.`
  };
}

/**
 * Master multi-source evidence retriever for a single claim
 */
export async function retrieveMultiSourceEvidence(claim) {
  const lang = claim.originalLanguage || 'en';
  // 1. Generate 3 distinct queries
  const queries = generateSearchQueries(claim.text, lang);

  const attemptedQueries = [];
  const providersUsed = new Set();
  const collectedArticles = [];
  let providerErrors = [];

  // 2. Execute parallel search queries across providers
  const searchTasks = [];

  for (const qObj of queries) {
    attemptedQueries.push(qObj.query);

    // Query News Aggregator
    searchTasks.push(
      queryNewsProvider(qObj.query, qObj.language)
        .then(res => {
          providersUsed.add(res.provider);
          if (res.status === 'ok') {
            collectedArticles.push(...res.items);
          } else if (res.error) {
            providerErrors.push(`${res.provider}: ${res.error}`);
          }
        })
        .catch(err => providerErrors.push(err.message))
    );

    // Query Wikipedia
    searchTasks.push(
      queryWikipediaProvider(qObj.query, qObj.language)
        .then(res => {
          providersUsed.add(res.provider);
          if (res.status === 'ok') {
            collectedArticles.push(...res.items);
          } else if (res.error) {
            providerErrors.push(`${res.provider}: ${res.error}`);
          }
        })
        .catch(err => providerErrors.push(err.message))
    );
  }

  await Promise.allSettled(searchTasks);

  // 3. Deduplicate articles by URL domain + clean title slug
  const uniqueArticles = [];
  const seenUrls = new Set();

  for (const art of collectedArticles) {
    const cleanUrl = art.url.split('?')[0].toLowerCase();
    if (!seenUrls.has(cleanUrl)) {
      seenUrls.add(cleanUrl);

      // Evaluate stance of this evidence
      const stanceAnalysis = evaluateEvidenceStance(claim.text, art.snippet, art.articleTitle);

      uniqueArticles.push({
        ...art,
        stance: stanceAnalysis.stance,
        relevanceExplanation: stanceAnalysis.rationale
      });
    }
  }

  // 4. Source Independence Analysis
  const independence = analyzeSourceIndependence(uniqueArticles);

  // 5. Partition by Stance for Task 4 "Coverage Across Sources"
  const supporting = uniqueArticles.filter(a => a.stance === 'SUPPORT');
  const contradicting = uniqueArticles.filter(a => a.stance === 'CONTRADICT');
  const discussing = uniqueArticles.filter(a => a.stance === 'DISCUSS');
  const inconclusive = uniqueArticles.filter(a => a.stance === 'INCONCLUSIVE');

  return {
    claimId: claim.id,
    attemptedQueries,
    providersUsed: Array.from(providersUsed),
    providerErrors,
    coverage: {
      totalSourcesFound: uniqueArticles.length,
      distinctPublishersCount: independence.distinctPublishersCount,
      independentSourcesCount: independence.independentSourcesCount,
      supportingCount: supporting.length,
      contradictingCount: contradicting.length,
      discussingCount: discussing.length,
      isSyndicated: independence.isSyndicated,
      syndicatedVia: independence.syndicatedVia,
      independenceWarning: independence.independenceWarning,
      sources: uniqueArticles
    },
    supportingSources: supporting,
    contradictingSources: contradicting,
    discussingSources: discussing,
    allArticles: uniqueArticles
  };
}
