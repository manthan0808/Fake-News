import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Link2, Image, Search, Upload, AlertCircle,
  CheckCircle2, Loader2, X
} from 'lucide-react';
import { UserLayout } from '../components/layout/UserLayout';
import { newsService } from '../services/api';
import './CheckNews.css';

const ANALYSIS_STEPS = [
  'Extracting article content',
  'Cleaning and preprocessing text',
  'Analyzing language patterns',
  'Checking source credibility',
  'Extracting factual claims',
  'Searching for evidence',
  'Running AI models',
  'Generating credibility score',
];

export default function CheckNews() {
  const [tab, setTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageDragOver, setImageDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const navigate = useNavigate();

  const runAnalysis = async () => {
    setError('');
    const input = tab === 'text' ? textInput : tab === 'url' ? urlInput : imageFile?.name;
    if (!input || (tab === 'text' && textInput.trim().length < 20)) {
      setError(tab === 'text' ? 'Please enter at least 20 characters of news content.' : tab === 'url' ? 'Please enter a valid URL.' : 'Please upload an image.');
      return;
    }
    setAnalyzing(true);
    setCompletedSteps([]);

    // Simulate step-by-step analysis
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 200));
      setCompletedSteps(prev => [...prev, i]);
    }

    await new Promise(r => setTimeout(r, 500));
    setAnalyzing(false);
    navigate('/result/nr_001');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setImageDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) setImageFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) setImageFile(file);
  };

  return (
    <UserLayout>
      <div className="check-page animate-fade-in">
        {/* Loading Overlay */}
        {analyzing && (
          <div className="analysis-overlay">
            <div className="analysis-modal animate-fade-in">
              <div className="analysis-ring">
                <Loader2 size={36} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
              </div>
              <h2 className="analysis-title">Analyzing News...</h2>
              <p className="analysis-sub">Our AI is performing multi-layer verification</p>
              <div className="analysis-steps">
                {ANALYSIS_STEPS.map((step, i) => (
                  <div key={i} className={`analysis-step ${completedSteps.includes(i) ? 'done' : i === completedSteps.length ? 'active' : ''}`}>
                    {completedSteps.includes(i) ? (
                      <CheckCircle2 size={16} className="step-icon-done" />
                    ) : i === completedSteps.length ? (
                      <Loader2 size={16} className="animate-spin step-icon-active" />
                    ) : (
                      <div className="step-icon-pending" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              <p className="analysis-note">⚠ Stage 1 Demo — Results are simulated mock data</p>
            </div>
          </div>
        )}

        <div className="page-header">
          <div>
            <h1 className="page-title">Check News</h1>
            <p className="page-sub">Analyze any news article for credibility and misinformation</p>
          </div>
        </div>

        <div className="check-layout">
          {/* Main Input Card */}
          <div className="check-main card">
            {/* Tabs */}
            <div className="tabs check-tabs">
              {[
                { key: 'text', icon: FileText, label: 'Text' },
                { key: 'url', icon: Link2, label: 'URL' },
                { key: 'image', icon: Image, label: 'Image' },
              ].map(t => (
                <button
                  key={t.key}
                  className={`tab-btn ${tab === t.key ? 'active' : ''}`}
                  onClick={() => { setTab(t.key); setError(''); }}
                  id={`tab-${t.key}`}
                >
                  <t.icon size={15} /> {t.label}
                </button>
              ))}
            </div>

            {/* Text Tab */}
            {tab === 'text' && (
              <div className="check-tab-content animate-fade-in">
                <label className="form-label check-label">Paste news article, headline, or social media post</label>
                <textarea
                  className="form-input check-textarea"
                  placeholder="Paste your news content here... (minimum 20 characters)"
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  id="check-text-input"
                />
                <div className="check-char-count">
                  <span className={textInput.length < 20 ? 'text-muted' : 'text-green'}>{textInput.length} characters</span>
                  {textInput.length < 20 && <span className="text-muted"> (min 20)</span>}
                </div>
              </div>
            )}

            {/* URL Tab */}
            {tab === 'url' && (
              <div className="check-tab-content animate-fade-in">
                <label className="form-label check-label">Enter the URL of the news article</label>
                <div className="url-input-wrap">
                  <Link2 size={16} className="url-icon" />
                  <input
                    className="form-input url-input"
                    type="url"
                    placeholder="https://news-website.com/article-title"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    id="check-url-input"
                  />
                </div>
                <p className="check-hint">
                  We'll automatically extract the article content from the URL for analysis.
                  <br />
                  <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>⚠ Stage 1: Actual URL scraping requires Stage 4 backend.</span>
                </p>
              </div>
            )}

            {/* Image Tab */}
            {tab === 'image' && (
              <div className="check-tab-content animate-fade-in">
                <label className="form-label check-label">Upload a screenshot of news content</label>
                <div
                  className={`image-dropzone ${imageDragOver ? 'drag-over' : ''} ${imageFile ? 'has-file' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setImageDragOver(true); }}
                  onDragLeave={() => setImageDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !imageFile && fileRef.current?.click()}
                  id="image-dropzone"
                >
                  {imageFile ? (
                    <div className="image-preview">
                      <CheckCircle2 size={24} style={{ color: 'var(--color-real)' }} />
                      <span className="image-filename">{imageFile.name}</span>
                      <button className="image-remove" onClick={(e) => { e.stopPropagation(); setImageFile(null); }}>
                        <X size={14} /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="image-empty">
                      <Upload size={32} style={{ opacity: 0.4 }} />
                      <p>Drag & drop an image here, or click to browse</p>
                      <span>PNG, JPG, WEBP up to 10MB</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
                <p className="check-hint" style={{ marginTop: '0.75rem' }}>
                  ⚠ Stage 1: OCR and image analysis available in Stage 6.
                </p>
              </div>
            )}

            {error && (
              <div className="check-error">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-lg check-submit"
              onClick={runAnalysis}
              disabled={analyzing}
              id="analyze-btn"
            >
              <Search size={18} />
              Analyze News
            </button>
          </div>

          {/* Sidebar Tips */}
          <div className="check-sidebar">
            <div className="card check-tips-card">
              <h4 className="tips-title">💡 Tips for Best Results</h4>
              <ul className="tips-list">
                <li>Paste the full article text for most accurate results</li>
                <li>Include the headline in your submission</li>
                <li>For URLs, use the direct article link, not the homepage</li>
                <li>Screenshots should include the headline and source name</li>
              </ul>
            </div>

            <div className="card check-tips-card">
              <h4 className="tips-title">⚠ Disclaimer</h4>
              <p className="tips-note">
                This system provides evidence-based assessments, not absolute verdicts. Results are labeled as "Likely Fake", "Likely Real", "Potentially Misleading", or "Unverified" — never as definitive truth or falsehood.
              </p>
            </div>

            <div className="card check-tips-card stages-card">
              <h4 className="tips-title">🏗 Current Stage</h4>
              <div className="stage-badge">Stage 1 — Frontend Prototype</div>
              <p className="tips-note" style={{ marginTop: '0.5rem' }}>
                Results shown are simulated mock data for demonstration. Real AI analysis will be integrated in Stage 3.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
