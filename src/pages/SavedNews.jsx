import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserLayout } from '../components/layout/UserLayout';
import { proofDeskService } from '../services/api';

export default function SavedNews() {
  const [savedScans, setSavedScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      try {
        const history = await proofDeskService.getHistory();
        setSavedScans(history.filter(s => s.isSaved));
      } catch (err) {
        console.error('Failed to load saved cases:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleRemove = async (id) => {
    await proofDeskService.toggleBookmark(id);
    setSavedScans(prev => prev.filter(s => s.id !== id));
  };

  return (
    <UserLayout>
      <div style={{ maxWidth: 1000, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="meta-tag">PUBLISH / SAVED CASES</div>
          <h1 className="serif-heading" style={{ fontSize: '2.2rem', margin: '0.25rem 0 0.5rem', color: '#191816' }}>
            Saved Proof Cases
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#57534e' }}>
            Bookmarked claim verification reports and reference checks saved for research citations.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#78716c' }}>
            Loading saved cases...
          </div>
        ) : savedScans.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#191816', marginBottom: '0.5rem' }}>No bookmarked cases yet</h3>
            <p style={{ fontSize: '0.85rem', color: '#78716c', marginBottom: '1.25rem' }}>
              Whenever you complete a reference check, click "Bookmark Case" to save it here for citation export.
            </p>
            <Link to="/check" className="btn btn-primary btn-sm">
              Verify an Article or Claim →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
            {savedScans.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge badge-${(item.assessment || 'unverified').toLowerCase()}`}>
                    {item.assessment === 'SUPPORTED' ? 'VERIFIED' : item.assessment}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
                  >
                    Remove ✕
                  </button>
                </div>

                <Link to={`/result/${item.id}`} style={{ fontSize: '0.95rem', fontWeight: 600, color: '#191816', textDecoration: 'none', lineHeight: 1.4 }}>
                  {item.headline}
                </Link>

                <div style={{ fontSize: '0.78rem', color: '#78716c', display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #eae7df' }}>
                  <span>{item.domain || 'Direct Text'}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>Credibility: <strong>{item.credibilityScore || 85}/100</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
