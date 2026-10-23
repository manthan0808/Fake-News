/**
 * Verdict Engine & Domain Transparency Analyzer
 */

const SENSATIONAL_PATTERNS = [
  { pattern: /\b(shocking|bombshell|unbelievable|mind-blowing)\b/i, category: 'Sensationalism', weight: 15, tip: 'Emotionally charged superlative intended to trigger click-through.' },
  { pattern: /\b(you won't believe|what happens next will|will blow your mind)\b/i, category: 'Curiosity Gap', weight: 20, tip: 'Formulaic clickbait headline withholding critical context.' },
  { pattern: /\b(miracle cure|doctors hate (?:him|her|this)|secret government)\b/i, category: 'Conspiracy / Unsubstantiated', weight: 25, tip: 'Common pseudoscience or conspiratorial trope.' },
  { pattern: /\b(destroys?|slams?|blasts?|eviscerates?)\b/i, category: 'Hostile Hyperbole', weight: 10, tip: 'Exaggerated conflict terminology substituted for objective reporting.' },
  { pattern: /(!{2,}|\?{2,})/g, category: 'Excessive Punctuation', weight: 10, tip: 'Multiple exclamation/question marks non-standard in verified journalism.' },
  { pattern: /\b[A-Z]{4,}\b/g, category: 'All-Caps Emphasis', weight: 8, tip: 'Gratuitous capitalized words creating false urgency.' }
];

/**
 * Clickbait and Sensationalism Analysis with Exact Match Highlighting
 */
export function analyzeSensationalism(headline, bodyText) {
  const combined = `${headline} ${bodyText.slice(0, 2000)}`;
  const matches = [];
  let scorePenalty = 0;

  for (const rule of SENSATIONAL_PATTERNS) {
    const reg = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match;
    while ((match = reg.exec(combined)) !== null) {
      matches.push({
        phrase: match[0],
        category: rule.category,
        explanation: rule.tip,
        index: match.index
      });
      scorePenalty += rule.weight;
      if (matches.length >= 8) break;
    }
  }

  const clickbaitScore = Math.min(95, Math.max(5, scorePenalty));
  return {
    clickbaitScore,
    isSensational: clickbaitScore > 35,
    flaggedPhrases: matches,
    headlineBodyAlignment: headline.length > 0 && bodyText.toLowerCase().includes(headline.split(' ')[0].toLowerCase())
  };
}

/**
 * Evaluates Domain Transparency Indicators
 */
export function evaluateDomainTransparency(meta) {
  const domain = (meta.domain || '').toLowerCase();
  const isHttps = meta.isHttps ?? true;
  const hasAuthor = Boolean(meta.author && meta.author !== 'Staff Reporter / Undisclosed' && meta.author.length > 2);
  const hasDate = Boolean(meta.publishedDate);

  // Known high-reputation public/institutional TLDs
  const isEduOrGov = domain.endsWith('.gov') || domain.endsWith('.gov.in') || domain.endsWith('.edu') || domain.endsWith('.ac.in');
  const isSuspiciousTLD = /\.(xyz|top|buzz|click|fun|gq|cf|ml)$/i.test(domain);

  let transparencyScore = 50;
  if (isHttps) transparencyScore += 15;
  if (hasAuthor) transparencyScore += 20;
  if (hasDate) transparencyScore += 15;
  if (isEduOrGov) transparencyScore += 20;
  if (isSuspiciousTLD) transparencyScore -= 30;

  transparencyScore = Math.min(100, Math.max(10, transparencyScore));

  return {
    score: transparencyScore,
    indicators: [
      { label: 'HTTPS Protocol Enforced', verified: isHttps, impact: isHttps ? 'positive' : 'negative' },
      { label: 'Identified Author Byline', verified: hasAuthor, details: meta.author || 'Undisclosed' },
      { label: 'Verifiable Publication Date', verified: hasDate, details: meta.publishedDate || 'Missing' },
      { label: 'Domain Registry Classification', verified: !isSuspiciousTLD, details: isEduOrGov ? 'Official / Educational (.gov/.edu)' : domain },
      { label: 'Editorial Disclosures', verified: hasAuthor && hasDate, details: hasAuthor ? 'Public editorial attribution' : 'Anonymous / Aggregated' }
    ]
  };
}

/**
 * Determines claim-level verdict and confidence based on evidence
 */
export function computeClaimVerdict(claim, evidenceData) {
  const evidenceItems = evidenceData.evidenceItems || [];

  if (evidenceItems.length === 0) {
    return {
      status: 'UNVERIFIED',
      label: 'Unverified',
      confidence: 0,
      verdictReason: 'No corresponding verified statements or fact-check records could be confidently retrieved in public knowledge archives.',
      advisory: 'An "Unverified" result does not mean this statement is false; it indicates an absence of public reference records.',
      supportingSource: null,
      contradictingSource: null,
      citations: []
    };
  }

  // Cross-match claim tokens against evidence snippets
  const claimWords = claim.text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  let matchCount = 0;
  let totalWords = claimWords.length || 1;

  for (const item of evidenceItems) {
    const snip = item.snippet.toLowerCase();
    for (const w of claimWords) {
      if (snip.includes(w)) matchCount++;
    }
  }

  const lexicalOverlap = Math.min(1, matchCount / (totalWords * 1.5));
  const primaryEvidence = evidenceItems[0];

  // Contradiction signals in evidence (debunking, false, hoax, denied, refutes)
  const isDebunked = evidenceItems.some(item => 
    /\b(hoax|false claim|misleading|debunked|refuted|unfounded|denied by|fact check: false)\b/i.test(item.snippet)
  );

  if (isDebunked) {
    return {
      status: 'CONTRADICTED',
      label: 'Contradicted',
      confidence: 94,
      verdictReason: `Public fact-check and encyclopedia archives directly refute or clarify this assertion.`,
      supportingSource: null,
      contradictingSource: primaryEvidence.sourceName,
      citations: evidenceItems.map(e => ({ name: e.sourceName, url: e.url, snippet: e.snippet }))
    };
  }

  if (lexicalOverlap > 0.45) {
    return {
      status: 'SUPPORTED',
      label: 'Supported',
      confidence: Math.round(75 + lexicalOverlap * 23), // 75-98%
      verdictReason: `Corroborated by ${primaryEvidence.sourceName} with factual alignment in public records.`,
      supportingSource: primaryEvidence.sourceName,
      contradictingSource: null,
      citations: evidenceItems.map(e => ({ name: e.sourceName, url: e.url, snippet: e.snippet }))
    };
  }

  return {
    status: 'MIXED',
    label: 'Mixed Evidence',
    confidence: 62,
    verdictReason: `Partial alignment detected with ${primaryEvidence.sourceName}, but specific figures or claims require primary document inspection.`,
    supportingSource: primaryEvidence.sourceName,
    contradictingSource: null,
    citations: evidenceItems.map(e => ({ name: e.sourceName, url: e.url, snippet: e.snippet }))
  };
}

/**
 * Synthesizes overall article score and assessment
 */
export function compileProofDeskReport(articleMeta, claimsWithVerdicts, sensationalism, domainTransparency) {
  const verifiedCount = claimsWithVerdicts.filter(c => c.verdict.status === 'SUPPORTED').length;
  const contradictedCount = claimsWithVerdicts.filter(c => c.verdict.status === 'CONTRADICTED').length;
  const mixedCount = claimsWithVerdicts.filter(c => c.verdict.status === 'MIXED').length;
  const unverifiedCount = claimsWithVerdicts.filter(c => c.verdict.status === 'UNVERIFIED').length;
  const totalClaims = claimsWithVerdicts.length || 1;

  // Composite Credibility Index (0-100)
  let baseScore = 60;
  baseScore += (verifiedCount / totalClaims) * 35;
  baseScore -= (contradictedCount / totalClaims) * 45;
  baseScore -= (sensationalism.clickbaitScore / 100) * 15;
  baseScore += (domainTransparency.score / 100) * 15;

  const credibilityScore = Math.max(8, Math.min(98, Math.round(baseScore)));

  let assessment = 'UNVERIFIED';
  if (contradictedCount > 0 || credibilityScore < 40) {
    assessment = 'CONTRADICTED';
  } else if (verifiedCount >= 2 && contradictedCount === 0 && credibilityScore >= 70) {
    assessment = 'SUPPORTED';
  } else if (mixedCount > 0 || (credibilityScore >= 40 && credibilityScore < 70)) {
    assessment = 'MIXED';
  }

  const reportId = `prf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  return {
    id: reportId,
    url: articleMeta.url,
    domain: articleMeta.domain,
    headline: articleMeta.title,
    author: articleMeta.author,
    publishedDate: articleMeta.publishedDate,
    scannedAt: new Date().toISOString(),
    credibilityScore,
    assessment,
    confidenceAvg: Math.round(claimsWithVerdicts.reduce((acc, c) => acc + c.verdict.confidence, 0) / totalClaims),
    counts: {
      total: totalClaims,
      verified: verifiedCount,
      contradicted: contradictedCount,
      mixed: mixedCount,
      unverified: unverifiedCount
    },
    scores: {
      credibility: credibilityScore,
      domainTransparency: domainTransparency.score,
      clickbait: sensationalism.clickbaitScore,
      evidenceStrength: Math.round((verifiedCount / totalClaims) * 100),
      contentReliability: Math.max(10, Math.round(100 - sensationalism.clickbaitScore * 0.6 - contradictedCount * 25))
    },
    claims: claimsWithVerdicts,
    sensationalism,
    domainTransparency,
    bodyText: articleMeta.bodyText,
    isSaved: false
  };
}
