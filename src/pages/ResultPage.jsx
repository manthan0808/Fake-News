import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserLayout } from '../components/layout/UserLayout';
import { proofDeskService } from '../services/api';
import './ResultPage.css';

export default function ResultPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('references');
  const [diffData, setDiffData] = useState(null);
  const [diffLoading, setDiffLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        const data = await proofDeskService.getById(id);
        setReport(data);
        if (data) setSaved(data.isSaved);
      } catch (err) {
        console.error('Failed to load proof report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [id]);

  const handleToggleSave = async () => {
    try {
      const res = await proofDeskService.toggleBookmark(id);
      setSaved(res.isSaved);
    } catch (e) {
      setSaved(!saved);
    }
  };

  const handleCheckDiff = async () => {
    setDiffLoading(true);
    try {
      const diff = await proofDeskService.checkArticleDiff(id);
      setDiffData(diff);
      setActiveTab('diff');
    } catch (err) {
      alert('Change detection error: ' + err.message);
    } finally {
      setDiffLoading(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="proof-loading-view">
          <div className="proof-spinner" />
          <p className="proof-loading-text">Retrieving proof record from database...</p>
        </div>
      </UserLayout>
    );
  }

  if (!report) {
    return (
      <UserLayout>
        <div className="proof-empty-state">
          <h2>Proof Report Not Found</h2>
          <p>The requested verification job could not be located.</p>
          <Link to="/check" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Run New Verification
          </Link>
        </div>
      </UserLayout>
    );
  }

  const shortJobId = report.id.length > 8 ? report.id.slice(0, 8) : report.id;
  const verifiedCount = report.counts?.verified || 0;
  const totalCount = report.counts?.total || report.claims?.length || 1;
  const completedDate = new Date(report.scannedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <UserLayout>
      <div className="reference-check-page">
        {/* Top Header matching Screenshot 2 */}
        <div className="ref-header">
          <div className="ref-header-left">
            <h1 className="ref-title">Reference Check Results</h1>
            <div className="ref-meta-line">
              <span className="ref-job-id">
                Job ID: <span className="ref-job-id-code">{report.id} ({shortJobId})</span>
              </span>
              <span className="ref-date">Completed on: {completedDate}</span>
            </div>
          </div>

          {/* Top Right Badges matching Screenshot 2 */}
          <div className="ref-header-right">
            <div className="ref-stat-pill pill-verified">
              <span className="pill-label">VERIFIED</span>
              <span className="pill-number">{verifiedCount}</span>
            </div>
            <div className="ref-stat-pill pill-total">
              <span className="pill-label">TOTAL</span>
              <span className="pill-number">{totalCount}</span>
            </div>
          </div>
        </div>

        {/* Notice Box matching Screenshot 2 */}
        <div className="notice-box">
          <div className="notice-title">⚠ About "Unverified" references</div>
          <p>
            When a reference is marked as <strong>Unverified</strong>, our automated system could not confidently locate it in scientific databases or primary wire archives. This does not necessarily mean the citation is fake—it may be caused by formatting variations, obscure publishers, or missing digital metadata. <strong>We suggest manually checking these citations.</strong>
          </p>
        </div>

        {/* Article Headline Card */}
        <div className="card article-headline-card">
          <div className="headline-meta">
            <span className="meta-tag">{report.domain || 'Direct Text Submission'}</span>
            {report.author && <span className="meta-tag">By {report.author}</span>}
          </div>
          <h2 className="headline-text">{report.headline}</h2>
          <div className="headline-actions">
            {report.url && (
              <a href={report.url} target="_blank" rel="noopener noreferrer" className="source-link">
                Original Webpage ↗
              </a>
            )}
            <button className="btn btn-secondary btn-sm" onClick={handleToggleSave}>
              {saved ? '✓ Saved Case' : 'Bookmark Case'}
            </button>
            {report.url && (
              <button className="btn btn-secondary btn-sm" onClick={handleCheckDiff} disabled={diffLoading}>
                {diffLoading ? 'Detecting...' : 'Detect Article Changes (Diff)'}
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="proof-tabs-bar">
          <button
            className={`proof-tab-btn ${activeTab === 'references' ? 'active' : ''}`}
            onClick={() => setActiveTab('references')}
          >
            Claim Verifications ({report.claims?.length || 0})
          </button>
          <button
            className={`proof-tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
            onClick={() => setActiveTab('evidence')}
          >
            Evidence & Direct Citations
          </button>
          <button
            className={`proof-tab-btn ${activeTab === 'transparency' ? 'active' : ''}`}
            onClick={() => setActiveTab('transparency')}
          >
            Domain Transparency ({report.domainTransparency?.score || 85}/100)
          </button>
          <button
            className={`proof-tab-btn ${activeTab === 'sensationalism' ? 'active' : ''}`}
            onClick={() => setActiveTab('sensationalism')}
          >
            Sensationalism & Phrase Highlights
          </button>
          {diffData && (
            <button
              className={`proof-tab-btn ${activeTab === 'diff' ? 'active' : ''}`}
              onClick={() => setActiveTab('diff')}
            >
              Article Change Diff
            </button>
          )}
        </div>

        {/* TAB 1: Main Reference Check Table (Exact Screenshot 2 Match) */}
        {activeTab === 'references' && (
          <div className="card ref-table-card">
            <table className="proof-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>RESULT ↓</th>
                  <th>PAPER TITLE / CLAIM</th>
                  <th style={{ width: '220px' }}>AUTHORS / SOURCE</th>
                  <th style={{ width: '130px' }}>CONFIDENCE</th>
                  <th style={{ width: '60px', textAlign: 'center' }}>LINK</th>
                </tr>
              </thead>
              <tbody>
                {(report.claims || []).map((claim) => {
                  const status = claim.verdict?.status || 'UNVERIFIED';
                  const conf = claim.verdict?.confidence || 0;
                  const citations = claim.verdict?.citations || [];
                  const primaryCit = citations[0] || null;
                  const authorOrSource = claim.verdict?.authorOrSource || claim.verdict?.supportingSource || claim.verdict?.contradictingSource || report.author || 'Primary wire report';

                  return (
                    <tr key={claim.id}>
                      {/* Result Badge */}
                      <td>
                        <span className={`badge badge-${status.toLowerCase()}`}>
                          {status === 'SUPPORTED' ? 'VERIFIED' : status}
                        </span>
                      </td>

                      {/* Claim Text */}
                      <td>
                        <div className="claim-statement">
                          {claim.text}
                        </div>
                        {claim.originalLanguage === 'gu' && (
                          <div className="claim-regional-note">
                            <span className="lang-tag">ગુજરાતી</span>
                            {claim.englishTranslation && (
                              <span className="lang-translation">
                                Translation: "{claim.englishTranslation}"
                              </span>
                            )}
                          </div>
                        )}
                        <div className="claim-reason-sub">
                          {claim.verdict?.verdictReason}
                        </div>
                      </td>

                      {/* Authors / Source */}
                      <td>
                        <span className="source-author-text">
                          {authorOrSource}
                        </span>
                      </td>

                      {/* Confidence Meter Bar */}
                      <td>
                        <div className="confidence-meter-group">
                          <div className="meter-track">
                            <div
                              className={`meter-bar-fill fill-${status.toLowerCase()}`}
                              style={{ width: `${conf}%` }}
                            />
                          </div>
                          <span className="meter-number">{conf}</span>
                        </div>
                      </td>

                      {/* Link ↗ */}
                      <td style={{ textAlign: 'center' }}>
                        {primaryCit?.url ? (
                          <a
                            href={primaryCit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ref-link-icon"
                            title={`Inspect source: ${primaryCit.name}`}
                          >
                            ↗
                          </a>
                        ) : (
                          <span className="ref-link-dash">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: Evidence & Direct Citations */}
        {activeTab === 'evidence' && (
          <div className="evidence-panel">
            <div className="card">
              <h3 className="panel-title">Corroborating Evidence & Source Independence</h3>
              <p className="panel-sub">
                Live primary document excerpts retrieved from encyclopedia databases, official agencies, and news syndicates.
              </p>

              <div className="evidence-claims-list">
                {(report.claims || []).map((claim, idx) => (
                  <div key={idx} className="evidence-claim-block">
                    <div className="evidence-claim-header">
                      <span className={`badge badge-${(claim.verdict?.status || 'UNVERIFIED').toLowerCase()}`}>
                        {claim.verdict?.status || 'UNVERIFIED'}
                      </span>
                      <strong className="evidence-claim-title">"{claim.text}"</strong>
                    </div>

                    <div className="evidence-citations-wrap">
                      {claim.verdict?.citations && claim.verdict.citations.length > 0 ? (
                        claim.verdict.citations.map((cit, cIdx) => (
                          <div key={cIdx} className="citation-quote-box">
                            <div className="citation-header">
                              <span className="citation-source-name">{cit.name}</span>
                              <a href={cit.url} target="_blank" rel="noopener noreferrer" className="citation-url">
                                View Original ↗
                              </a>
                            </div>
                            <blockquote className="citation-snippet">
                              "{cit.snippet}"
                            </blockquote>
                          </div>
                        ))
                      ) : (
                        <div className="empty-citation-note">
                          No direct public citation returned for this claim. Marked as Unverified.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Domain Transparency */}
        {activeTab === 'transparency' && (
          <div className="card transparency-card">
            <h3 className="panel-title">Domain Transparency & Credibility Audit</h3>
            <p className="panel-sub">
              Systematic inspection of editorial accountability, encryption protocols, and publisher disclosure signals.
            </p>

            <div className="transparency-score-banner">
              <div className="transparency-score-val">{report.domainTransparency?.score || 85}</div>
              <div className="transparency-score-meta">
                <span className="transparency-score-label">Domain Transparency Index</span>
                <span className="transparency-score-desc">
                  Based on HTTPS certification, identified author bylines, verifiable publication dates, and registry classification.
                </span>
              </div>
            </div>

            <div className="transparency-indicators-list">
              {(report.domainTransparency?.indicators || []).map((ind, i) => (
                <div key={i} className="indicator-row">
                  <div className="indicator-check">
                    {ind.verified ? (
                      <span className="check-icon-ok">✓</span>
                    ) : (
                      <span className="check-icon-fail">✕</span>
                    )}
                  </div>
                  <div className="indicator-details">
                    <div className="indicator-label">{ind.label}</div>
                    {ind.details && <div className="indicator-sub">{ind.details}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Sensationalism & Phrase Highlights */}
        {activeTab === 'sensationalism' && (
          <div className="card sensationalism-card">
            <h3 className="panel-title">Headline & Text Sensationalism Audit</h3>
            <p className="panel-sub">
              Heuristic identification of hyperbolic superlatives, emotional manipulation cues, and clickbait syntax.
            </p>

            <div className="sensationalism-meter-row">
              <span className="sensational-score-label">Clickbait / Sensationalism Score:</span>
              <strong className="sensational-score-num">{report.sensationalism?.clickbaitScore || 8} / 100</strong>
            </div>

            {report.sensationalism?.flaggedPhrases && report.sensationalism.flaggedPhrases.length > 0 ? (
              <div className="flagged-phrases-list">
                <div className="flagged-title">Flagged Linguistic Patterns:</div>
                {report.sensationalism.flaggedPhrases.map((phrase, pIdx) => (
                  <div key={pIdx} className="flagged-phrase-item">
                    <span className="phrase-badge">{phrase.category}</span>
                    <span className="phrase-quote">"{phrase.phrase}"</span>
                    <span className="phrase-tip">{phrase.explanation}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="clean-prose-notice">
                ✓ No sensational clickbait triggers or hyperbolic superlatives were detected in the analyzed headline or body copy.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Article Change Detection Diff */}
        {activeTab === 'diff' && diffData && (
          <div className="card diff-card">
            <h3 className="panel-title">Article Change Detection (Stealth Edits)</h3>
            <p className="panel-sub">{diffData.summary}</p>

            <div className="diff-meta-strip">
              <div>Initial Scan: {new Date(diffData.originalScanDate).toLocaleTimeString()}</div>
              <div>Rechecked: {new Date(diffData.recheckedAt).toLocaleTimeString()}</div>
              <div>Headline Changed: {diffData.headlineChanged ? 'YES' : 'NO'}</div>
            </div>

            {diffData.headlineChanged && (
              <div className="diff-headline-box">
                <div className="diff-old">Previous: "{diffData.originalHeadline}"</div>
                <div className="diff-new">Current: "{diffData.currentHeadline}"</div>
              </div>
            )}

            {diffData.addedSegments?.length > 0 && (
              <div className="diff-block">
                <h4>Added or Modified Content:</h4>
                {diffData.addedSegments.map((s, idx) => (
                  <div key={idx} className="diff-line-added">+ {s}</div>
                ))}
              </div>
            )}

            {diffData.removedSegments?.length > 0 && (
              <div className="diff-block">
                <h4>Removed Content:</h4>
                {diffData.removedSegments.map((s, idx) => (
                  <div key={idx} className="diff-line-removed">- {s}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
