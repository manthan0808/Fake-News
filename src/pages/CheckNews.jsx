import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserLayout } from '../components/layout/UserLayout';
import { proofDeskService } from '../services/api';
import './CheckNews.css';

const PRESETS = [
  {
    label: 'Medical Preclinical Research (English)',
    type: 'text',
    title: 'Evaluating Preclinical Cancer Research Rigor',
    text: 'Preclinical cancer research requires reproducible protocols and validated cell lines. Multiple studies published in Nature and PLOS Medicine demonstrate that statistical power and sample size determination are critical to avoid false discovery rates in oncology drug development.'
  },
  {
    label: 'અમદાવાદ મેટ્રો અને સાયન્સ સિટી (Gujarati)',
    type: 'text',
    title: 'અમદાવાદ મેટ્રો અને સ્પેસ ગેલેરી પ્રોજેક્ટ',
    text: 'અમદાવાદ મેટ્રો ફેઝ-૨ મોટેરા સ્ટેડિયમથી મહાત્મા મંદિર ગાંધીનગર સુધી કનેક્ટિવિટી આપે છે. ગુજરાત સરકાર અને ઇસરો વચ્ચે સાયન્સ સિટી ખાતે સ્પેસ ગેલેરી માટે સમજૂતી થઈ છે. તમામ વિદ્યાર્થીઓ માટે મફત સોનાના સિક્કા આપવાની અફવા ખોટી છે.'
  },
  {
    label: '5G Viral Health Hoax (Debunked)',
    type: 'text',
    title: 'Cellular Radiation and Viral Transmission',
    text: 'Viral social media claims assert that 5G cellular towers transmit biological coronavirus infections and that drinking concentrated bleach cures viral infections within 24 hours.'
  }
];

export default function CheckNews() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputMode, setInputMode] = useState('url'); // 'url' | 'text'
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [language, setLanguage] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [progressPct, setProgressPct] = useState(0);
  const [error, setError] = useState('');

  // Handle URL query parameter pre-fill (e.g. from context menu or extension)
  useEffect(() => {
    const textParam = searchParams.get('text');
    const urlParam = searchParams.get('url');
    if (textParam) {
      setInputMode('text');
      setTextInput(textParam);
    } else if (urlParam) {
      setInputMode('url');
      setUrlInput(urlParam);
    }
  }, [searchParams]);

  const handleRunScan = async (e) => {
    e.preventDefault();
    setError('');

    if (inputMode === 'url' && !urlInput.trim()) {
      setError('Please provide a valid article URL to verify.');
      return;
    }
    if (inputMode === 'text' && !textInput.trim()) {
      setError('Please provide article or claim text to verify.');
      return;
    }

    setLoading(true);
    setProgressPct(20);
    setProgressStep('Step 1/4: Extracting article content & author metadata...');

    setTimeout(() => {
      setProgressPct(50);
      setProgressStep('Step 2/4: Identifying checkable factual claims (English/Gujarati)...');
    }, 800);

    setTimeout(() => {
      setProgressPct(75);
      setProgressStep('Step 3/4: Querying live public knowledge archives & wire syndicates...');
    }, 1600);

    try {
      const payload = inputMode === 'url'
        ? { url: urlInput.trim(), language: language === 'auto' ? undefined : language }
        : {
            bodyText: textInput.trim(),
            title: titleInput.trim() || undefined,
            language: language === 'auto' ? undefined : language
          };

      const report = await proofDeskService.scan(payload);

      setProgressPct(100);
      setProgressStep('Step 4/4: Verification compiled. Generating reference check...');

      setTimeout(() => {
        navigate(`/result/${report.id}`);
      }, 500);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the network or backend.');
      setLoading(false);
    }
  };

  const loadPreset = (preset) => {
    setInputMode('text');
    setTitleInput(preset.title);
    setTextInput(preset.text);
    setError('');
  };

  return (
    <UserLayout>
      <div className="check-desk-page">
        {/* Header */}
        <div className="check-desk-header">
          <div className="meta-tag">VERIFICATION WORKSPACE</div>
          <h1 className="check-desk-title serif-heading">New Reference Check</h1>
          <p className="check-desk-sub">
            Deconstruct news stories, press releases, or research statements into independent factual claims and cross-corroborate against live public archives.
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="card check-form-card">
          <div className="mode-toggle-strip">
            <button
              type="button"
              className={`mode-btn ${inputMode === 'url' ? 'active' : ''}`}
              onClick={() => { setInputMode('url'); setError(''); }}
            >
              Scan Webpage URL
            </button>
            <button
              type="button"
              className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
              onClick={() => { setInputMode('text'); setError(''); }}
            >
              Analyze Article Text or Claim
            </button>
          </div>

          <form onSubmit={handleRunScan} className="check-form">
            {inputMode === 'url' ? (
              <div className="form-field-group">
                <label className="field-label">ARTICLE WEBPAGE URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/news/article-headline"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="form-input url-input"
                  disabled={loading}
                />
                <span className="field-hint">
                  Supports HTTPS news portals, academic publications, press releases, and blogs. Protected against SSRF.
                </span>
              </div>
            ) : (
              <>
                <div className="form-field-group">
                  <label className="field-label">HEADLINE / DOCUMENT TITLE (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="e.g. Government Announces New Scientific Initiative"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                <div className="form-field-group">
                  <div className="field-label-row">
                    <label className="field-label">ARTICLE BODY OR STATEMENT TEXT</label>
                    <div className="lang-selector-wrap">
                      <span className="lang-label">Script:</span>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="lang-select"
                        disabled={loading}
                      >
                        <option value="auto">Auto-Detect</option>
                        <option value="en">English (en)</option>
                        <option value="gu">ગુજરાતી (Gujarati)</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    placeholder="Paste the statement or article paragraphs here (English or Gujarati)..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="form-input text-input"
                    rows={6}
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {error && (
              <div className="check-error-notice">
                ✕ {error}
              </div>
            )}

            {loading ? (
              <div className="check-progress-block">
                <div className="meter-bar" style={{ height: '6px' }}>
                  <div className="meter-fill" style={{ width: `${progressPct}%`, transition: 'width 0.4s ease' }} />
                </div>
                <div className="progress-step-label">{progressStep}</div>
              </div>
            ) : (
              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary check-submit-btn">
                  Run Reference Check ↗
                </button>
              </div>
            )}
          </form>

          {/* Quick Presets Strip for Faculty / Examiner Evaluation */}
          <div className="presets-footer">
            <span className="presets-label">Quick Benchmark Presets:</span>
            <div className="preset-buttons">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-btn"
                  onClick={() => loadPreset(p)}
                  disabled={loading}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Browser Extension Callout Box */}
        <div className="card extension-promo-card">
          <div className="ext-promo-left">
            <h3 className="ext-promo-title">One-Click Chrome Extension Available</h3>
            <p className="ext-promo-desc">
              Scan any open webpage in your browser without copying and pasting URLs. In-page claim highlighting, author transparency check, and instant proof report generation.
            </p>
          </div>
          <div className="ext-promo-right">
            <a
              href="chrome://extensions"
              onClick={(e) => {
                e.preventDefault();
                alert('To install the extension: Open chrome://extensions in Chrome, enable Developer mode, and click "Load unpacked" on the extension/ directory.');
              }}
              className="btn btn-secondary btn-sm"
            >
              Install Extension Instructions ↗
            </a>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
