import { useState } from 'react';
import { UserLayout } from '../../components/layout/UserLayout';
import { mockSources } from '../../data/mockData/claims';

export default function AdminSources() {
  const [sources, setSources] = useState(mockSources);
  const [search, setSearch] = useState('');

  const filtered = sources.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <UserLayout>
      <div style={{ maxWidth: 1050, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="meta-tag">VERIFY / SOURCE EXPLORER</div>
          <h1 className="serif-heading" style={{ fontSize: '2.2rem', margin: '0.25rem 0 0.5rem', color: '#191816' }}>
            Source Credibility & Wire Directory
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#57534e' }}>
            Registered news wire services, state information departments, and academic journal repositories evaluated by VeriScope.
          </p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder="Search verified publishers and wire syndicates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ width: '320px', background: '#ffffff' }}
          />
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="proof-table">
            <thead>
              <tr>
                <th>PUBLISHER / WIRE</th>
                <th>DOMAIN</th>
                <th>CATEGORY</th>
                <th>CREDIBILITY SCORE</th>
                <th>STATUS</th>
                <th>LAST AUDITED</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const isTrusted = s.score >= 80;
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600, color: '#191816' }}>{s.name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#57534e' }}>
                      {s.domain}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#78716c' }}>{s.category}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div className="meter-bar" style={{ width: 60 }}>
                          <div
                            className="meter-fill"
                            style={{
                              width: `${s.score}%`,
                              background: isTrusted ? '#047857' : s.score >= 50 ? '#d97706' : '#b91c1c'
                            }}
                          />
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600 }}>
                          {s.score}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${isTrusted ? 'badge-verified' : 'badge-unverified'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#78716c' }}>{s.lastChecked}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}
