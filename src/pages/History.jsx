import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink, Calendar } from 'lucide-react';
import { UserLayout } from '../components/layout/UserLayout';
import { mockNewsHistory } from '../data/mockData/news';
import { formatDate, truncate, ASSESSMENT_LABELS, ASSESSMENT_BADGE_CLASS } from '../utils/formatters';
import './History.css';

const FILTERS = ['All', 'Likely Fake', 'Likely Real', 'Misleading', 'Unverified'];

const filterMap = {
  'All': null,
  'Likely Fake': 'LIKELY_FAKE',
  'Likely Real': 'LIKELY_REAL',
  'Misleading': 'MISLEADING',
  'Unverified': 'UNVERIFIED',
};

export default function History() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = mockNewsHistory.filter(item => {
    const matchFilter = !filterMap[activeFilter] || item.assessment === filterMap[activeFilter];
    const matchSearch = !search || item.headline.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <UserLayout>
      <div className="history-page animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Verification History</h1>
            <p className="page-sub">{mockNewsHistory.length} total checks · {filtered.length} shown</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="history-controls">
          <div className="history-search-wrap">
            <Search size={16} className="history-search-icon" />
            <input
              className="form-input history-search"
              placeholder="Search by headline or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="history-search"
            />
          </div>
          <div className="history-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
                id={`filter-${f.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card history-table-card">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Search size={48} className="empty-state-icon" />
              <h3>No results found</h3>
              <p>Try a different search term or filter</p>
            </div>
          ) : (
            <div className="history-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Headline</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Result</th>
                    <th>Score</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="history-date">
                          <Calendar size={12} />
                          {formatDate(item.analysisDate)}
                        </div>
                      </td>
                      <td className="history-headline">{truncate(item.headline, 60)}</td>
                      <td><span className="category-pill">{item.category}</span></td>
                      <td><span className="type-pill">{item.inputType}</span></td>
                      <td>
                        <span className={`badge ${ASSESSMENT_BADGE_CLASS[item.assessment]}`}>
                          {ASSESSMENT_LABELS[item.assessment]}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="score-mini-bar" style={{
                            width: 50, height: 4, background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-full)', overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%', width: `${item.credibilityScore}%`,
                              background: item.credibilityScore >= 70 ? 'var(--color-real)' : item.credibilityScore >= 40 ? 'var(--color-misleading)' : 'var(--color-fake)',
                              borderRadius: 'var(--radius-full)'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {item.credibilityScore}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Link to={`/result/${item.id}`} className="btn btn-ghost btn-sm">
                          <ExternalLink size={13} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
