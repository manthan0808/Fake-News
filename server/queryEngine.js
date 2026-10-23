/**
 * Intelligent Query Formulation Engine
 * Generates multiple distinct search queries for each factual claim:
 * 1. Entity & Topic Query (Named entities, places, institutions, dates, quantities)
 * 2. Core Assertion Query (Shortened key phrase)
 * 3. News & Official Corroboration Query (Disambiguated terms + official context)
 */

import { detectLanguage, buildSearchQueryForGujarati } from './claimExtractor.js';

// Common stop words to strip when creating entity queries
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'to', 'of', 'in', 'that', 'have', 'had', 'has', 'for', 'on', 'with', 'at', 'by',
  'from', 'this', 'these', 'those', 'it', 'its', 'as', 'into', 'which', 'about',
  'after', 'before', 'according', 'reported', 'said', 'states', 'stating', 'claim', 'claims'
]);

/**
 * Extracts salient tokens: named entities, capitalized sequences, numbers, dates, locations
 */
export function extractSalientTokens(text) {
  // Capture years (e.g. 2023, 2024), percentages (95%), large quantities (lakh, crore, million, billion)
  const numbersAndQuantities = text.match(/\b(?:\d{4}|\d+(?:\.\d+)?%?|\d+\s*(?:crore|lakh|million|billion|deaths|cases))\b/gi) || [];

  // Capture Capitalized entity phrases (e.g. "Ahmedabad Metro", "Chandrayaan-3", "Supreme Court", "Gurgaon")
  const capitalizedEntities = [];
  const words = text.split(/\s+/);
  let currentEntity = [];

  for (let i = 0; i < words.length; i++) {
    const rawWord = words[i].replace(/[^\w-]/g, '');
    if (rawWord && /^[A-Z][a-z0-9-]+$/.test(rawWord) && !STOP_WORDS.has(rawWord.toLowerCase())) {
      currentEntity.push(rawWord);
    } else {
      if (currentEntity.length > 0) {
        capitalizedEntities.push(currentEntity.join(' '));
        currentEntity = [];
      }
    }
  }
  if (currentEntity.length > 0) {
    capitalizedEntities.push(currentEntity.join(' '));
  }

  // Filter significant nouns/verbs (length > 3)
  const contentWords = words
    .map(w => w.replace(/[^\w\u0A80-\u0AFF]/g, ''))
    .filter(w => w.length > 3 && !STOP_WORDS.has(w.toLowerCase()));

  return {
    numbersAndQuantities,
    capitalizedEntities,
    contentWords
  };
}

/**
 * Generates at least three meaningfully distinct search queries for a claim
 */
export function generateSearchQueries(claimText, language = 'en') {
  const isGujarati = language === 'gu' || detectLanguage(claimText) === 'gu';
  const queries = [];

  if (isGujarati) {
    // 1. Native Gujarati keyword search
    const cleanGu = claimText
      .replace(/[^\u0A80-\u0AFF\s0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const guWords = cleanGu.split(' ').filter(w => w.length > 2).slice(0, 7);
    queries.push({
      type: 'vernacular_core',
      query: guWords.join(' '),
      language: 'gu',
      purpose: 'Vernacular regional news search across Gujarati media (Divya Bhaskar, Gujarat Samachar, Sandesh)'
    });

    // 2. Cross-lingual translated search (English expansion)
    const englishTranslated = buildSearchQueryForGujarati(claimText);
    queries.push({
      type: 'cross_lingual_entity',
      query: englishTranslated,
      language: 'en',
      purpose: 'Cross-language query matching national English news & central government portals'
    });

    // 3. Official & Fact-check verification query
    queries.push({
      type: 'official_verification',
      query: `${englishTranslated} PIB fact check India`,
      language: 'en',
      purpose: 'Government archive and official agency verification'
    });

    return queries;
  }

  // English processing:
  const { numbersAndQuantities, capitalizedEntities, contentWords } = extractSalientTokens(claimText);

  // Query 1: Entity & Quantities Query
  // Combines named organizations/places with any exact numerical values or dates
  const entityTerms = [...capitalizedEntities, ...numbersAndQuantities];
  let q1 = '';
  if (entityTerms.length > 0) {
    q1 = Array.from(new Set(entityTerms)).join(' ');
  } else {
    q1 = contentWords.slice(0, 5).join(' ');
  }
  queries.push({
    type: 'entity_and_metrics',
    query: q1.slice(0, 90).trim(),
    language: 'en',
    purpose: 'Entity & metric cross-match targeting specific events, locations, and numbers'
  });

  // Query 2: Core Assertion / Shortened Claim
  // Removes boilerplate and focuses on the central event statement
  const cleanSentence = claimText
    .replace(/^(according to reports|sources say|officials stated that|as per reports|it is reported that),?\s*/i, '')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const coreWords = cleanSentence.split(' ').filter(w => !STOP_WORDS.has(w.toLowerCase())).slice(0, 6);
  queries.push({
    type: 'core_proposition',
    query: coreWords.join(' ').slice(0, 80).trim(),
    language: 'en',
    purpose: 'Core factual proposition query against mainstream news headlines and articles'
  });

  // Query 3: Corroboration & Disambiguation Query
  // Appends high-authority contextual keywords (e.g. statement, confirmed, official, study)
  let q3Terms = [];
  if (capitalizedEntities.length > 0) {
    q3Terms.push(capitalizedEntities[0]);
  }
  if (contentWords.length > 0) {
    q3Terms.push(...contentWords.slice(0, 4));
  }
  const q3 = Array.from(new Set(q3Terms)).join(' ');
  queries.push({
    type: 'corroboration_archive',
    query: `${q3}`.slice(0, 85).trim(),
    language: 'en',
    purpose: 'Broader contextual retrieval targeting authoritative documentation and encyclopedic records'
  });

  return queries;
}
