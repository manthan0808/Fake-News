import { useState } from 'react';
import { Eye, UserX, Trash2, Search } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { mockUsers } from '../../data/mockData/users';
import { formatDate } from '../../utils/formatters';

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const statusColors = { active: 'badge-real', inactive: 'badge-unverified', suspended: 'badge-fake' };

  return (
    <AdminLayout title="User Management" subtitle={`${users.length} total users`}>
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} id="admin-user-search" />
      </div>
      <div className="card" style={{ padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Checks</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: 30, height: 30, background: 'var(--gradient-brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                    {u.name.charAt(0)}
                  </div>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.875rem' }}>{u.name}</span>
                </td>
                <td>{u.email}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{u.checks}</td>
                <td>{u.joinedAt}</td>
                <td><span className={`badge ${statusColors[u.status] || 'badge-unverified'}`}>{u.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn btn-ghost btn-sm" title="View user"><Eye size={13} /></button>
                    <button className="btn btn-ghost btn-sm" title="Disable user" style={{ color: 'var(--color-misleading)' }}><UserX size={13} /></button>
                    <button className="btn btn-ghost btn-sm" title="Delete user" style={{ color: 'var(--color-fake)' }}><Trash2 size={13} /></button>
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
