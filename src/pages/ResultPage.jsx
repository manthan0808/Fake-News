import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, HelpCircle, XCircle,
  ChevronDown, ChevronUp, Bookmark, BookmarkCheck, Share2,
  Download, ExternalLink, Shield, Brain, BarChart2,
  FileText, Globe, Zap, TrendingUp, Eye
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { UserLayout } from '../components/layout/UserLayout';
import { newsService } from '../services/api';
import { mockClaims, mockEvidence } from '../data/mockData/claims';
import {
  ASSESSMENT_LABELS, getAssessmentColor, getAssessmentBg,
  getScoreColor, getScoreLabel, formatDate, formatTime
} from '../utils/formatters';
import './ResultPage.css';

const AssessmentIcon = ({ assessment }) => {
  const props = { size: 28 };
  switch (assessment) {
    case 'LIKELY_FAKE': return <XCircle {...props} style={{ color: 'var(--color-fake)' }} />;
    case 'LIKELY_REAL': return <CheckCircle {...props} style={{ color: 'var(--color-real)' }} />;
    case 'MISLEADING': return <AlertTriangle {...props} style={{ color: 'var(--color-misleading)' }} />;
    default: return <HelpCircle {...props} style={{ color: 'var(--color-unverified)' }} />;
  }
};

const ScoreCircle = ({ score, label }) => {
  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 52;
  const dash = (score / 100) * circumference;

  return (
    <div className="score-circle">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="52" fill="none" stroke="var(--bg-surface)" strokeWidth="10" />
        <circle
          cx="65" cy="65" r="52" fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dasharray 1.5s ease' }}
        />
        <text x="65" y="62" textAnchor="middle" fill={color} fontSize="26" fontWeight="800" fontFamily="Space Grotesk">
          {score}
        </text>
        <text x="65" y="78" textAnchor="middle" fill="#64748b" fontSize="11">/ 100</text>
      </svg>
      <span className="score-circle-label">{label}</span>
    </div>
  );
};

const ScoreBar = ({ label, score }) => {
  const color = getScoreColor(score);
  return (
    <div className="score-bar-item">
      <div className="score-bar-header">
        <span className="score-bar-label">{label}</span>
        <span className="score-bar-val" style={{ color }}>{score}/100 · {getScoreLabel(score)}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
};

const ClaimCard = ({ claim }) => {
  const [expanded, setExpanded] = useState(false);
  const statusMap = {
    SUPPORTED: { icon: CheckCircle, color: 'var(--color-real)', label: 'Supported', bg: 'var(--color-real-bg)', border: 'rgba(34,197,94,0.2)' },
    CONTRADICTED: { icon: XCircle, color: 'var(--color-fake)', label: 'Contradicted', bg: 'var(--color-fake-bg)', border: 'rgba(239,68,68,0.2)' },
    UNVERIFIED: { icon: HelpCircle, color: 'var(--color-unverified)', label: 'Unverified', bg: 'var(--color-unverified-bg)', border: 'rgba(148,163,184,0.2)' },
  };
  const s = statusMap[claim.status] || statusMap.UNVERIFIED;

  return (
    <div className="claim-card" style={{ borderColor: expanded ? s.border : 'var(--border-subtle)' }}>
      <div className="claim-header" onClick={() => setExpanded(!expanded)}>
        <div className="claim-status-icon" style={{ background: s.bg }}>
          <s.icon size={14} style={{ color: s.color }} />
        </div>
        <p className="claim-text">"{claim.text}"</p>
        <span className="claim-status-label" style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
          {s.label}
        </span>
        <button className="claim-expand">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>
      {expanded && (
        <div className="claim-detail animate-fade-in">
          <p className="claim-explanation">{claim.explanation}</p>
          {claim.supportingSource && (
            <div className="claim-source supporting">
              <CheckCircle size={12} /> Source: {claim.supportingSource}
            </div>
          )}
          {claim.contradictingSource && (
            <div className="claim-source contradicting">
              <XCircle size={12} /> Contradicted by: {claim.contradictingSource}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [claims, setClaims] = useState([]);
  const [evidence, setEvidence] = useState({ supporting: [], contradicting: [] });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      const [r, c, e] = await Promise.all([
        newsService.getById(id),
        newsService.getClaims(id),
        newsService.getEvidence(id),
      ]);
      setResult(r);
      setClaims(c);
      setEvidence(e);
      setSaved(r.isSaved);
    };
    load();
  }, [id]);

  if (!result) {
    return (
      <UserLayout>
        <div className="result-loading">
          <div className="result-loading-spinner animate-spin" />
          <p>Loading analysis...</p>
        </div>
      </UserLayout>
    );
  }

  const assessColor = getAssessmentColor(result.assessment);
  const assessBg = getAssessmentBg(result.assessment);
  const sentimentData = [
    { name: 'Negative', value: result.sentiment.negative, fill: '#ef4444' },
    { name: 'Neutral', value: result.sentiment.neutral, fill: '#94a3b8' },
    { name: 'Positive', value: result.sentiment.positive, fill: '#22c55e' },
  ];

  const TABS = [
    { key: 'overview', label: 'Overview', icon: BarChart2 },
    { key: 'claims', label: `Claims (${claims.length})`, icon: FileText },
    { key: 'source', label: 'Source', icon: Globe },
    { key: 'evidence', label: 'Evidence', icon: Shield },
    { key: 'sentiment', label: 'Sentiment', icon: TrendingUp },
    { key: 'explain', label: 'Explainable AI', icon: Brain },
    { key: 'text', label: 'Highlighted Text', icon: Eye },
  ];

  return (
    <UserLayout>
      <div className="result-page animate-fade-in">
        {/* Demo Notice */}
        <div className="demo-notice">
          🧪 Stage 1 Demo — Results below are simulated mock data for frontend demonstration purposes
        </div>

        {/* Assessment Banner */}
        <div className="result-banner animate-fade-in-up" style={{ background: assessBg, borderColor: `${assessColor}30` }}>
          <div className="result-banner-left">
            <AssessmentIcon assessment={result.assessment} />
            <div>
              <div className="result-banner-label">AI Assessment</div>
              <div className="result-banner-value" style={{ color: assessColor }}>
                {ASSESSMENT_LABELS[result.assessment]}
              </div>
            </div>
          </div>
          <div className="result-banner-right">
            <div className="result-banner-meta">
              <span>Confidence: <strong style={{ color: assessColor }}>{result.confidence}%</strong></span>
              <span className="result-banner-sep">·</span>
              <span>Category: <strong>{result.category}</strong></span>
              <span className="result-banner-sep">·</span>
              <span>{formatDate(result.analysisDate)}</span>
            </div>
            <div className="result-banner-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSaved(!saved)}
                title="Save article"
              >
                {saved ? <BookmarkCheck size={15} style={{ color: 'var(--brand-primary)' }} /> : <Bookmark size={15} />}
                {saved ? 'Saved' : 'Save'}
              </button>
              <button className="btn btn-secondary btn-sm" title="Share (coming soon)">
                <Share2 size={15} /> Share
              </button>
              <button className="btn btn-secondary btn-sm" title="Download report (coming soon)">
                <Download size={15} /> Report
              </button>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="card result-headline-card animate-fade-in-up delay-1">
          <div className="result-headline-label">Analyzed Headline</div>
          <h2 className="result-headline-text">{result.headline}</h2>
          {result.url && (
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="result-url">
              <ExternalLink size={13} /> {result.url}
            </a>
          )}
        </div>

        {/* Score Cards */}
        <div className="result-scores-grid animate-fade-in-up delay-2">
          <div className="card result-main-score">
            <div className="result-main-score-title">Credibility Score</div>
            <ScoreCircle score={result.credibilityScore} label="Credibility" />
            <p className="result-main-score-note">
              {result.credibilityScore >= 70 ? '✅ Generally credible content' :
               result.credibilityScore >= 40 ? '⚠ Contains questionable elements' :
               '🚨 Low credibility — verify before sharing'}
            </p>
          </div>
          <div className="card result-sub-scores">
            <h4 className="sub-scores-title">Detailed Scores</h4>
            <div className="sub-scores-list">
              <ScoreBar label="Source Credibility" score={result.scores.sourceCredibility} />
              <ScoreBar label="Clickbait Score" score={result.scores.clickbait} />
              <ScoreBar label="Evidence Strength" score={result.scores.evidenceStrength} />
              <ScoreBar label="Content Reliability" score={result.scores.contentReliability} />
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="result-tabs-nav animate-fade-in-up delay-3">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`result-tab-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
              id={`result-tab-${t.key}`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="result-tab-content animate-fade-in">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              {/* Why Flagged */}
              <div className="card result-flags-card">
                <h3 className="result-section-title">Why Was This Flagged?</h3>
                <div className="flags-list">
                  <div className="flag-item warning"><AlertTriangle size={15} /> Sensational headline with emotional language</div>
                  <div className="flag-item warning"><AlertTriangle size={15} /> Core claim lacks sufficient verifiable evidence</div>
                  <div className="flag-item warning"><AlertTriangle size={15} /> Source credibility is moderate (61/100)</div>
                  <div className="flag-item ok"><CheckCircle size={15} /> Some information matches reports from trusted sources</div>
                  <div className="flag-item ok"><CheckCircle size={15} /> Article acknowledges official response</div>
                </div>
              </div>

              {/* Clickbait */}
              <div className="card result-clickbait-card">
                <h3 className="result-section-title">Clickbait Analysis</h3>
                <div className="clickbait-layout">
                  <div className="clickbait-score-block">
                    <div className="clickbait-score-val" style={{ color: result.scores.clickbait >= 70 ? 'var(--color-fake)' : 'var(--color-misleading)' }}>
                      {result.scores.clickbait}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
                    </div>
                    <div className="clickbait-level" style={{ color: result.scores.clickbait >= 70 ? 'var(--color-fake)' : 'var(--color-misleading)', background: result.scores.clickbait >= 70 ? 'var(--color-fake-bg)' : 'var(--color-misleading-bg)' }}>
                      {result.scores.clickbait >= 70 ? 'HIGH' : 'MODERATE'}
                    </div>
                  </div>
                  <div className="clickbait-patterns">
                    <p className="clickbait-patterns-title">Detected Patterns:</p>
                    {['Excessive punctuation (!!!)', 'Emotional wording', 'Curiosity-gap headline', 'Capitalized words'].map((p, i) => (
                      <div key={i} className="clickbait-pattern">
                        <AlertTriangle size={12} style={{ color: 'var(--color-fake)', flexShrink: 0 }} /> {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="card">
                <h3 className="result-section-title">Classification</h3>
                <div className="classification-row">
                  <div className="classification-item">
                    <span className="classification-label">Category</span>
                    <span className="classification-val">{result.category}</span>
                  </div>
                  <div className="classification-item">
                    <span className="classification-label">Topic</span>
                    <span className="classification-val">{result.topic}</span>
                  </div>
                  <div className="classification-item">
                    <span className="classification-label">Input Type</span>
                    <span className="classification-val" style={{ textTransform: 'capitalize' }}>{result.inputType}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Claims */}
          {activeTab === 'claims' && (
            <div className="tab-pane">
              <div className="card">
                <h3 className="result-section-title">Claim Analysis</h3>
                <p className="result-section-sub">AI-extracted factual claims from the article, each verified against evidence databases.</p>
                <div className="claims-list">
                  {claims.map((claim, i) => (
                    <ClaimCard key={claim.id} claim={claim} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Source */}
          {activeTab === 'source' && (
            <div className="tab-pane">
              <div className="card">
                <h3 className="result-section-title">Source Analysis</h3>
                <div className="source-grid">
                  <div className="source-main">
                    <div className="source-name-row">
                      <div className="source-icon"><Globe size={20} /></div>
                      <div>
                        <div className="source-name">{result.source.name}</div>
                        {result.source.url && <a href={result.source.url} className="source-url" target="_blank" rel="noopener noreferrer">{result.source.url}</a>}
                      </div>
                    </div>
                    <div className="source-score-bar-wrap">
                      <div className="source-score-header">
                        <span>Source Credibility</span>
                        <span style={{ color: getScoreColor(result.source.score) }}>{result.source.score}/100 · {getScoreLabel(result.source.score)}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${result.source.score}%`, background: getScoreColor(result.source.score) }} />
                      </div>
                    </div>
                    <div className="source-note">{result.source.historyNote}</div>
                  </div>
                  <div className="source-indicators">
                    {[
                      { label: 'HTTPS Secure', ok: result.source.httpsSecure },
                      { label: 'Author Available', ok: result.source.authorAvailable },
                      { label: 'Publication Date', ok: result.source.dateAvailable },
                      { label: 'Known Domain', ok: result.source.score > 30 },
                    ].map((ind, i) => (
                      <div key={i} className="source-indicator">
                        {ind.ok ? <CheckCircle size={14} style={{ color: 'var(--color-real)' }} /> : <XCircle size={14} style={{ color: 'var(--color-fake)' }} />}
                        <span style={{ color: ind.ok ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{ind.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evidence */}
          {activeTab === 'evidence' && (
            <div className="tab-pane">
              <div className="card">
                <h3 className="result-section-title">Evidence Analysis</h3>
                {evidence.supporting.length > 0 && (
                  <div className="evidence-section">
                    <h4 className="evidence-section-title supporting">✅ Supporting Evidence ({evidence.supporting.length})</h4>
                    {evidence.supporting.map(ev => (
                      <div key={ev.id} className="evidence-card supporting">
                        <p className="evidence-text">{ev.text}</p>
                        <div className="evidence-meta">
                          <span className="evidence-source">Source: {ev.source}</span>
                          <span className="evidence-credibility">Credibility: {ev.credibility}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {evidence.contradicting.length > 0 && (
                  <div className="evidence-section" style={{ marginTop: '1.25rem' }}>
                    <h4 className="evidence-section-title contradicting">❌ Contradicting Evidence ({evidence.contradicting.length})</h4>
                    {evidence.contradicting.map(ev => (
                      <div key={ev.id} className="evidence-card contradicting">
                        <p className="evidence-text">{ev.text}</p>
                        <div className="evidence-meta">
                          <span className="evidence-source">Source: {ev.source}</span>
                          <span className="evidence-credibility">Credibility: {ev.credibility}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sentiment */}
          {activeTab === 'sentiment' && (
            <div className="tab-pane">
              <div className="card">
                <h3 className="result-section-title">Sentiment Analysis</h3>
                <div className="sentiment-layout">
                  <div className="sentiment-chart">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                          {sentimentData.map((s, i) => <Cell key={i} fill={s.fill} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="sentiment-details">
                    {sentimentData.map((s, i) => (
                      <div key={i} className="sentiment-item">
                        <div className="sentiment-item-top">
                          <span className="sentiment-label">{s.name}</span>
                          <span className="sentiment-pct" style={{ color: s.fill }}>{s.value}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${s.value}%`, background: s.fill }} />
                        </div>
                      </div>
                    ))}
                    <div className="sentiment-emotions">
                      <p className="sentiment-emotions-title">Emotional Indicators</p>
                      {Object.entries(result.emotionalIndicators).map(([key, val]) => (
                        <div key={key} className="sentiment-emotion">
                          <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          <div className="sentiment-emotion-bar">
                            <div style={{ width: `${val}%`, height: '100%', background: 'var(--gradient-brand)', borderRadius: 'var(--radius-full)' }} />
                          </div>
                          <span className="sentiment-emotion-val">{val}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Explainable AI */}
          {activeTab === 'explain' && (
            <div className="tab-pane">
              <div className="card">
                <h3 className="result-section-title">
                  <Brain size={20} style={{ color: 'var(--brand-primary)', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                  Why Does the AI Think This is {ASSESSMENT_LABELS[result.assessment]}?
                </h3>
                <div className="explain-block">
                  <p className="explain-text">{result.explanation}</p>
                </div>
                <div className="explain-note">
                  <Brain size={14} />
                  <span>This explanation is generated to help you understand the AI's reasoning. The system uses multiple signals, not a single factor, to reach its assessment.</span>
                </div>
                <div className="explain-disclaimer">
                  ⚠ This system provides evidence-based assessments and cannot determine absolute truth or falsehood. Always cross-check with additional trusted sources.
                </div>
              </div>
            </div>
          )}

          {/* Highlighted Text */}
          {activeTab === 'text' && (
            <div className="tab-pane">
              <div className="card">
                <h3 className="result-section-title">Article Content Analysis</h3>
                <div className="highlight-legend">
                  <span className="legend-item"><span className="legend-dot low" /> Low Concern</span>
                  <span className="legend-item"><span className="legend-dot medium" /> Moderate Concern</span>
                  <span className="legend-item"><span className="legend-dot high" /> High Concern</span>
                </div>
                <div className="highlight-text">
                  {result.highlightedText.map((seg, i) => (
                    <span
                      key={i}
                      className={`highlight-${seg.riskLevel.toLowerCase()}`}
                      title={`Risk level: ${seg.riskLevel}`}
                    >
                      {seg.text}{' '}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
