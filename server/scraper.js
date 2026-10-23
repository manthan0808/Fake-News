import http from 'http';
import https from 'https';
import { URL } from 'url';

/**
 * SSRF Protection: Checks whether a given hostname or IP is a forbidden private address
 */
export function isForbiddenHost(hostname) {
  const lowered = hostname.toLowerCase();
  if (
    lowered === 'localhost' ||
    lowered === '127.0.0.1' ||
    lowered === '::1' ||
    lowered === '0.0.0.0' ||
    lowered.endsWith('.local') ||
    lowered.endsWith('.internal')
  ) {
    return true;
  }

  // Check IPv4 private subnets
  const ipMatch = lowered.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipMatch) {
    const [_, o1, o2] = ipMatch.map(Number);
    if (o1 === 10) return true; // 10.0.0.0/8
    if (o1 === 127) return true; // 127.0.0.0/8
    if (o1 === 192 && o2 === 168) return true; // 192.168.0.0/16
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return true; // 172.16.0.0/12
    if (o1 === 169 && o2 === 254) return true; // Link-local
    if (o1 === 0) return true;
  }

  return false;
}

/**
 * Fetches and parses an article URL securely with realistic User-Agent and timeout
 */
export async function scrapeArticle(inputUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(inputUrl);
  } catch (err) {
    throw new Error('Invalid URL format. Please provide a valid http or https URL.');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Unsupported protocol. Only HTTP and HTTPS URLs are allowed.');
  }

  if (isForbiddenHost(parsedUrl.hostname)) {
    throw new Error('Security policy violation: Access to private/internal network addresses is prohibited (SSRF protection).');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 VeriScope-ProofDesk/2.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,gu;q=0.8',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Target server returned HTTP ${res.status}: ${res.statusText}`);
    }

    const html = await res.text();
    return parseHtmlArticle(html, parsedUrl.toString());
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('The request timed out after 9 seconds while attempting to retrieve the page.');
    }
    throw err;
  }
}

/**
 * Parses raw HTML and extracts key metadata & readable article body
 */
export function parseHtmlArticle(html, sourceUrl = '') {
  const urlObj = sourceUrl ? new URL(sourceUrl) : null;
  const domain = urlObj ? urlObj.hostname.replace(/^www\./, '') : 'direct-input';
  const isHttps = urlObj ? urlObj.protocol === 'https:' : true;

  // Extract Title
  let title = '';
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (ogTitleMatch && ogTitleMatch[1]) {
    title = ogTitleMatch[1].trim();
  } else {
    const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleTagMatch && titleTagMatch[1]) {
      title = titleTagMatch[1].trim();
    }
  }

  // Extract Author
  let author = '';
  const metaAuthorMatch = html.match(/<meta[^>]*name=["']author["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]*property=["']article:author["'][^>]*content=["']([^"']+)["']/i) ||
                          html.match(/byline["']>([^<]+)<\//i);
  if (metaAuthorMatch && metaAuthorMatch[1]) {
    author = metaAuthorMatch[1].replace(/^by\s+/i, '').trim();
  }

  // Extract Publication Date
  let publishedDate = '';
  const dateMatch = html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*name=["']pubdate["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<time[^>]*datetime=["']([^"']+)["']/i);
  if (dateMatch && dateMatch[1]) {
    publishedDate = dateMatch[1];
  } else {
    publishedDate = new Date().toISOString();
  }

  // Extract Readable Text Body:
  // Remove scripts, styles, noscript, nav, header, footer, svg, comments
  let cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Extract text inside paragraph tags <p>...</p>
  const paragraphs = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = pRegex.exec(cleanHtml)) !== null) {
    const rawP = match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (rawP.length > 30) {
      paragraphs.push(rawP);
    }
  }

  let bodyText = paragraphs.join('\n\n');
  if (!bodyText || bodyText.length < 100) {
    // Fallback: strip tags from entire cleanHtml
    bodyText = cleanHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 15000);
  }

  return {
    url: sourceUrl,
    domain,
    isHttps,
    title: title || 'Untitled Article',
    author: author || 'Staff Reporter / Undisclosed',
    publishedDate,
    bodyText,
    paragraphCount: paragraphs.length,
    characterCount: bodyText.length
  };
}
