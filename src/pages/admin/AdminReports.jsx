import { AdminLayout } from './AdminLayout';
import { mockReports } from '../../data/mockData/dashboardStats';

const statusBadge = { PENDING: 'badge-unverified', REVIEWING: 'badge-misleading', VERIFIED: 'badge-fake', REJECTED: 'badge-real' };

export default function AdminReports() {
  return (
    <AdminLayout title="User Reports" subtitle="News flagged by users for review">
      <div className="card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Headline</th>
              <th>Reporter</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map(r => (
              <tr key={r.id}>
                <td style={{ color: 'var(--text-primary)', maxWidth: 240, fontSize: '0.82rem' }}>{r.headline}</td>
                <td>{r.reporter}</td>
                <td style={{ maxWidth: 180, fontSize: '0.78rem' }}>{r.reason}</td>
                <td>{r.date}</td>
                <td><span className={`badge ${statusBadge[r.status] || 'badge-unverified'}`}>{r.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.72rem' }}>Review</button>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.72rem', color: 'var(--color-fake)' }}>Dismiss</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
