import { AdminLayout } from './AdminLayout';
import { mockSources } from '../../data/mockData/claims';
import { getScoreColor } from '../../utils/formatters';

const statusBadge = { Trusted: 'badge-real', Moderate: 'badge-misleading', Low: 'badge-fake', Untrusted: 'badge-fake' };

export default function AdminSources() {
  return (
    <AdminLayout title="Source Management" subtitle="Manage source credibility database">
      <div className="card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Source Name</th>
              <th>Domain</th>
              <th>Category</th>
              <th>Credibility Score</th>
              <th>Status</th>
              <th>Last Checked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockSources.map(s => (
              <tr key={s.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</td>
                <td style={{ fontSize: '0.78rem' }}>{s.domain}</td>
                <td>{s.category}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 50, height: 4, background: 'var(--bg-surface)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${s.score}%`, height: '100%', background: getScoreColor(s.score), borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: getScoreColor(s.score) }}>{s.score}</span>
                  </div>
                </td>
                <td><span className={`badge ${statusBadge[s.status] || 'badge-unverified'}`}>{s.status}</span></td>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.lastChecked}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.72rem' }}>Edit Score</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
