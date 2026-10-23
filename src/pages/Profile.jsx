import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Bookmark, BarChart2, Settings, LogOut, Bell, Trash2 } from 'lucide-react';
import { UserLayout } from '../components/layout/UserLayout';
import { useAuth } from '../context/AuthContext';
import { mockDashboardStats } from '../data/mockData/dashboardStats';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const stats = mockDashboardStats.user;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <UserLayout>
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Profile & Settings</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Profile Card */}
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ width: 72, height: 72, background: 'var(--gradient-brand)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.75rem', fontWeight: 800, margin: '0 auto 1rem' }}>
              {user?.name?.charAt(0)}
            </div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{user?.name}</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
            <div className="divider" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { icon: BarChart2, label: 'Total Checks', val: stats.totalChecks },
                { icon: Bookmark, label: 'Saved', val: 3 },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary-light)' }}>{s.val}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-danger w-full btn-sm" onClick={handleLogout}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>

          {/* Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} style={{ color: 'var(--brand-primary)' }} /> Account Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" defaultValue={user?.name} id="profile-name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" defaultValue={user?.email} id="profile-email" />
                </div>
                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={16} style={{ color: 'var(--brand-primary)' }} /> Notifications
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>Email Notifications</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Receive alerts when analysis is complete</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24 }}>
                  <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{
                    position: 'absolute', cursor: 'pointer', inset: 0, borderRadius: 24,
                    background: notifications ? 'var(--brand-primary)' : 'var(--bg-surface)',
                    border: '1px solid var(--border-default)', transition: 'all 0.2s'
                  }}>
                    <span style={{
                      position: 'absolute', height: 16, width: 16, left: notifications ? 22 : 4, bottom: 3,
                      background: 'white', borderRadius: '50%', transition: 'left 0.2s'
                    }} />
                  </span>
                </label>
              </div>
            </div>

            <div className="card" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-fake)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trash2 size={16} /> Danger Zone
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Permanently delete your account and all your data. This action cannot be undone.
              </p>
              <button className="btn btn-danger btn-sm">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
