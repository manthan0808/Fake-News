import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle, AlertTriangle, TrendingUp, Globe,
  Brain, Search, FileText, Zap, BarChart2, History, MessageSquare,
  Languages, Eye, ChevronRight, Star, ArrowRight, Check
} from 'lucide-react';
import './Landing.css';

const FEATURES = [
  { icon: Brain, title: 'AI Fake News Detection', desc: 'ML-powered models analyze text patterns and linguistic features to classify news credibility.', color: '#6366f1' },
  { icon: CheckCircle, title: 'Claim Verification', desc: 'Automatically extract and verify individual claims against trusted fact-checking databases.', color: '#22c55e' },
  { icon: Star, title: 'Source Credibility', desc: 'Evaluate publishing sources against a database of 120+ news sources with credibility scores.', color: '#f59e0b' },
  { icon: Zap, title: 'Clickbait Detection', desc: 'Identify sensational headlines, emotional triggers, and engagement-bait language patterns.', color: '#ef4444' },
  { icon: TrendingUp, title: 'Sentiment Analysis', desc: 'Measure emotional tone, fear, urgency, and bias levels in news content.', color: '#06b6d4' },
  { icon: FileText, title: 'Evidence Analysis', desc: 'Find supporting and contradicting evidence from verified news archives and reports.', color: '#8b5cf6' },
  { icon: Globe, title: 'URL & Source Analysis', desc: 'Paste any news URL and automatically extract, scrape, and analyze the full article.', color: '#ec4899' },
  { icon: Languages, title: 'Multilingual Support', desc: 'Analyze news in Hindi, Gujarati, and other regional languages. (Stage 6)', color: '#14b8a6' },
  { icon: Eye, title: 'Explainable AI', desc: 'Understand why the AI flagged content — not just what it detected, but how and why.', color: '#f97316' },
  { icon: History, title: 'Verification History', desc: 'Track all your past news checks with detailed history, filters, and search.', color: '#a78bfa' },
  { icon: BarChart2, title: 'Analytics Dashboard', desc: 'Visualize your news consumption patterns, credibility distribution, and category breakdown.', color: '#34d399' },
  { icon: MessageSquare, title: 'AI Assistant', desc: 'Chat with VerifyAI to understand analysis results, ask questions, and get explanations.', color: '#fb923c' },
];

const STATS = [
  { value: '50K+', label: 'Articles Analyzed' },
  { value: '89%', label: 'Detection Accuracy' },
  { value: '120+', label: 'Sources Tracked' },
  { value: '12', label: 'Verification Layers' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Submit Your Content', desc: 'Paste news text, a URL, or upload a screenshot. Our system accepts all formats.' },
  { step: '02', title: 'AI Analyzes Everything', desc: 'Multiple ML models, source databases, and claim extractors run in parallel to evaluate credibility.' },
  { step: '03', title: 'Get Detailed Results', desc: 'Receive a credibility score, claim analysis, evidence, and a plain-language explanation.' },
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <div className="landing-nav-logo"><Shield size={18} /></div>
            <span className="landing-nav-title">VerifyAI</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-inner">
          <div className="hero-content animate-fade-in-up">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              AI-Powered • Multi-Layer Verification • Explainable Results
            </div>
            <h1 className="hero-headline">
              Fight Misinformation with
              <span className="gradient-text"> AI-Powered</span>
              <br />News Verification
            </h1>
            <p className="hero-sub">
              Analyze news articles, verify factual claims, evaluate source credibility, and understand <em>why</em> information may be misleading — all in seconds.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                <Search size={18} /> Check News Now <ArrowRight size={16} />
              </Link>
              <a href="#features" className="btn btn-secondary btn-lg">
                Explore Features
              </a>
            </div>
            <p className="hero-note">Free to use • No account needed to browse • Demo data in Stage 1</p>
          </div>

          {/* Floating Analysis Card */}
          <div className="hero-card animate-float delay-3">
            <div className="hero-card-header">
              <Shield size={16} className="hero-card-icon" />
              <span>NEWS ANALYSIS</span>
              <span className="hero-card-demo">DEMO</span>
            </div>
            <div className="hero-card-headline">
              "Government Announces New Economic Policy for Digital India 2025"
            </div>
            <div className="hero-card-checks">
              <div className="hero-card-check"><Check size={14} className="check-green" /> Source Analysis</div>
              <div className="hero-card-check"><Check size={14} className="check-green" /> Claim Verification</div>
              <div className="hero-card-check"><Check size={14} className="check-green" /> AI Prediction</div>
              <div className="hero-card-check"><Check size={14} className="check-green" /> Evidence Detection</div>
            </div>
            <div className="hero-card-score-section">
              <span className="hero-card-score-label">Credibility Score</span>
              <div className="hero-card-score-bar">
                <div className="hero-card-score-fill" style={{ width: '86%' }} />
              </div>
              <span className="hero-card-score-value">86 / 100</span>
            </div>
            <div className="hero-card-badge badge badge-real" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
              ✓ Likely Real
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="container stats-inner">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value gradient-text">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-label">Platform Capabilities</div>
            <h2>Everything You Need to<br /><span className="gradient-text">Verify Information</span></h2>
            <p className="section-desc">
              A comprehensive multi-layer verification system built to tackle misinformation at scale.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card animate-fade-in-up delay-${Math.min(i % 5 + 1, 5)}`}>
                <div className="feature-icon-wrap" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-label">Simple Process</div>
            <h2>How <span className="gradient-text">VerifyAI</span> Works</h2>
          </div>
          <div className="how-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="how-card">
                <div className="how-step-num gradient-text">{step.step}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p>{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="how-arrow hide-mobile"><ChevronRight size={24} /></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-orb" />
            <h2>Ready to Verify Your First Article?</h2>
            <p>Join thousands of users who fact-check before they share.</p>
            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Start for Free <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="landing-nav-logo"><Shield size={16} /></div>
            <span className="landing-nav-title" style={{ fontSize: '0.95rem' }}>VerifyAI</span>
          </div>
          <p className="footer-note">
            B.Tech Final Year Project — AI-Powered Fake News Detection System<br />
            <span style={{ fontSize: '0.72rem', opacity: 0.5 }}>Stage 1: Frontend Prototype — Mock data used for demonstration</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
