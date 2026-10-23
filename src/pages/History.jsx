import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserLayout } from '../components/layout/UserLayout';
import { proofDeskService } from '../services/api';
import './History.css';

const FILTERS = ['All', 'Supported', 'Contradicted', 'Mixed', 'Unverified'];

export default function History() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadScans() {
      try {
        const history = await proofDeskService.getHistory();
        setScans(history);
      } catch (err) {
        console.error('Failed to load scan history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadScans();
  }, []);

  const filtered = scans.filter(item => {
    const status = item.assessment || 'UNVERIFIED';
    const matchFilter = activeFilter === 'All' || status.toUpperCase() === activeFilter.toUpperCase();
    const matchSearch = !search || 
      item.headline?.toLowerCase().includes(search.toLowerCase()) ||
      item.domain?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <UserLayout>
      <div className="proof-history-page">
        <div className="history-header">
          <div className="meta-tag">PUBLISH / PROOF ARCHIVE</div>
          <h1 className="history-title serif-heading">Verification Archive</h1>
          <p className="history-sub">
            Persistent log of all completed claim deconstructions, domain transparency checks, and reference checks.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="history-controls-strip">
          <input
            type="text"
            placeholder="Search proof archive by headline or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input history-search-box"
          />

          <div className="history-filter-pills">
            {FILTERS.map(f => (
              <button
                key={f}
                type="button"
                className={`history-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Archive Table */}
        <div className="card history-table-card">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#78716c' }}>
              Loading verification archive...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#78716c' }}>
              No reference checks match your search or filter.
            </div>
          ) : (
            <table className="proof-table">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>VERDICT</th>
                  <th>HEADLINE / STATEMENT</th>
                  <th style={{ width: '180px' }}>DOMAIN</th>
                  <th style={{ width: '120px' }}>DATE</th>
                  <th style={{ width: '110px' }}>CREDIBILITY</th>
                  <th style={{ width: '90px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className={`badge badge-${(item.assessment || 'unverified').toLowerCase()}`}>
                        {item.assessment === 'SUPPORTED' ? 'VERIFIED' : item.assessment}
                      </span>
                    </td>
                    <td>
                      <Link to={`/result/${item.id}`} className="history-headline-link">
                        {item.headline}
                      </Link>
                      <div className="history-sub-meta">
                        {item.counts?.verified || 0} supported claims · {item.counts?.total || 1} total
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#57534e' }}>
                        {item.domain || 'Direct Text'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#78716c' }}>
                        {new Date(item.scannedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: '#191816' }}>
                        {item.scores?.credibility || item.credibilityScore || 80}/100
                      </span>
                    </td>
                    <td>
                      <Link to={`/result/${item.id}`} className="btn btn-secondary btn-sm">
                        Inspect ↗
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
