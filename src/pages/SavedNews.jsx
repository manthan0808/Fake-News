import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkX, ExternalLink } from 'lucide-react';
import { UserLayout } from '../components/layout/UserLayout';
import { mockNewsHistory } from '../data/mockData/news';
import { formatDate, truncate, ASSESSMENT_LABELS, ASSESSMENT_BADGE_CLASS } from '../utils/formatters';

export default function SavedNews() {
  const [saved, setSaved] = useState(mockNewsHistory.filter(n => n.isSaved));

  const remove = (id) => setSaved(prev => prev.filter(n => n.id !== id));

  return (
    <UserLayout>
      <div className="animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Saved News</h1>
            <p className="page-sub">{saved.length} bookmarked articles</p>
          </div>
        </div>

        {saved.length === 0 ? (
          <div className="empty-state">
            <Bookmark size={52} className="empty-state-icon" />
            <h3>No saved articles</h3>
            <p>Bookmark analysis results to access them here later</p>
            <Link to="/check" className="btn btn-primary" style={{ marginTop: '1rem' }}>Check News</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {saved.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span className={`badge ${ASSESSMENT_BADGE_CLASS[item.assessment]}`}>
                    {ASSESSMENT_LABELS[item.assessment]}
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => remove(item.id)}
                    title="Remove bookmark"
                    style={{ color: 'var(--color-fake)', padding: '4px' }}
                  >
                    <BookmarkX size={16} />
                  </button>
                </div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {truncate(item.headline, 90)}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>{item.category}</span>
                  <span>Score: <strong style={{ color: 'var(--text-primary)' }}>{item.credibilityScore}/100</strong></span>
                  <span>{formatDate(item.analysisDate)}</span>
                </div>
                <Link to={`/result/${item.id}`} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                  <ExternalLink size={13} /> View Analysis
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
