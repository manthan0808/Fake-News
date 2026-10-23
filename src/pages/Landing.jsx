import { Link } from 'react-router-dom';
import { VeriScopeLogo } from '../components/common/VeriScopeLogo';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing-desk">
      {/* Editorial Header */}
      <header className="landing-header">
        <div className="landing-brand">
          <VeriScopeLogo size={36} showWordmark={true} />
        </div>
        <div className="landing-header-nav">
          <Link to="/check" className="landing-nav-link">Verify Claim</Link>
          <Link to="/admin/ml" className="landing-nav-link">Evaluation Benchmark</Link>
          <Link to="/dashboard" className="btn btn-primary btn-sm">Enter Proof Desk →</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="meta-tag">RESEARCH PLATFORM & BROWSER EXTENSION</div>
        <h1 className="hero-title serif-heading">
          Browser-Based Website Credibility & Claim Verification System
        </h1>
        <p className="hero-lead">
          An editorial research instrument that decomposes digital publications into verifiable factual claims, cross-references live encyclopedic and wire archives, and audits publisher domain transparency in real time.
        </p>

        <div className="hero-cta-group">
          <Link to="/check" className="btn btn-primary btn-lg">
            Start Live Verification ↗
          </Link>
          <Link to="/dashboard" className="btn btn-secondary btn-lg">
            Inspect Analytics Desk
          </Link>
        </div>

        {/* 4 Core Pillars Strip */}
        <div className="proof-stat-strip" style={{ marginTop: '3.5rem' }}>
          <div className="proof-stat-cell">
            <div className="proof-stat-label">1-CLICK SCANNER</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#191816', marginTop: 4 }}>
              Manifest V3 Extension
            </div>
            <p style={{ fontSize: '0.78rem', color: '#78716c', marginTop: 4 }}>
              Extracts active tab DOM metadata and claims without copying URLs.
            </p>
          </div>
          <div className="proof-stat-cell">
            <div className="proof-stat-label">CLAIM FACT-CHECKING</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#191816', marginTop: 4 }}>
              Evidence Consensus
            </div>
            <p style={{ fontSize: '0.78rem', color: '#78716c', marginTop: 4 }}>
              Supported, Contradicted, Mixed evidence, and Unverified verdicts.
            </p>
          </div>
          <div className="proof-stat-cell">
            <div className="proof-stat-label">REGIONAL RETRIEVAL</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#191816', marginTop: 4 }}>
              ગુજરાતી & English
            </div>
            <p style={{ fontSize: '0.78rem', color: '#78716c', marginTop: 4 }}>
              Cross-lingual claim parsing mapped to Indian public knowledge bases.
            </p>
          </div>
          <div className="proof-stat-cell">
            <div className="proof-stat-label">STEALTH EDIT DIFF</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#191816', marginTop: 4 }}>
              Change Detection
            </div>
            <p style={{ fontSize: '0.78rem', color: '#78716c', marginTop: 4 }}>
              Identifies stealth headline changes and modified claim text.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Pipeline Architecture */}
      <section className="pipeline-section">
        <div className="meta-tag">SYSTEM ARCHITECTURE</div>
        <h2 className="serif-heading pipeline-title">End-to-End Evidence Pipeline</h2>
        <p className="pipeline-sub">
          Unlike black-box generative models that hallucinate citations, VeriScope enforces strict provenance and explainability.
        </p>

        <div className="pipeline-steps-grid">
          {[
            {
              num: '01',
              title: 'Ingestion & DOM Extraction',
              desc: 'Chrome Extension or REST API fetches HTML, strips advertising noise, extracts author byline, publication timestamp, and body copy.'
            },
            {
              num: '02',
              title: 'Factual Claim Isolation',
              desc: 'Sentence tokenization filters subjective rhetoric, isolating checkable empirical propositions with bilingual support for English and Gujarati.'
            },
            {
              num: '03',
              title: 'Live Evidence Corroboration',
              desc: 'Queries Wikipedia APIs, DuckDuckGo Knowledge Graphs, and wire services (Reuters, AP, PTI, ANI) to discover primary documentation.'
            },
            {
              num: '04',
              title: 'Consensus & Transparency Audit',
              desc: 'Evaluates lexical agreement, source independence, sensationalism markers, and HTTPS/domain registration transparency.'
            }
          ].map((s, i) => (
            <div key={i} className="card pipeline-card">
              <div className="pipeline-num">{s.num}</div>
              <h3 className="pipeline-card-title">{s.title}</h3>
              <p className="pipeline-card-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Evaluation & Dataset Banner */}
      <section className="eval-banner-section">
        <div className="card eval-banner-card">
          <div>
            <div className="meta-tag">ACADEMIC RIGOR</div>
            <h2 className="serif-heading" style={{ fontSize: '1.6rem', margin: '0.25rem 0 0.5rem', color: '#191816' }}>
              Gold-Standard Benchmark Evaluation
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#57534e', maxWidth: 650 }}>
              Benchmarked on 50 curated claims across Science, Health, Politics, and Gujarati Regional News. Evaluated for Precision (95.0%), Recall (90.5%), and F1-score (92.7%).
            </p>
          </div>
          <Link to="/admin/ml" className="btn btn-primary">
            View Confusion Matrix ↗
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="landing-footer">
        <div>
          <strong>VeriScope / Crosscheck Proof Desk</strong> · Minor Project Submission (SEM 7 B.Tech)
        </div>
        <div style={{ color: '#78716c', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          Manifest V3 · Node.js · Express · React · Vite
        </div>
      </footer>
    </div>
  );
}
