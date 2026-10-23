import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLayout } from '../components/layout/UserLayout';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <UserLayout>
      <div style={{ maxWidth: 900, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="meta-tag">ORGANIZATION / WORKSPACE</div>
          <h1 className="serif-heading" style={{ fontSize: '2.2rem', margin: '0.25rem 0 0.5rem', color: '#191816' }}>
            Analyst Profile & Workspace
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#57534e' }}>
            Manage proof desk access tokens, editorial attribution bylines, and audit notification preferences.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Profile Card */}
          <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ width: 64, height: 64, background: '#191816', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1rem', fontFamily: 'var(--font-mono)' }}>
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'MO'}
            </div>
            <h2 style={{ fontSize: '1.15rem', color: '#191816', marginBottom: '0.2rem' }}>{user?.name || 'Dr. M. Okafor'}</h2>
            <p style={{ fontSize: '0.8rem', color: '#78716c', marginBottom: '1.25rem' }}>{user?.email || 'm.okafor@meridian-desk.org'}</p>

            <div style={{ borderTop: '1px solid #eae7df', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#78716c', textTransform: 'uppercase' }}>ROLE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#191816', marginTop: 2 }}>Senior Fact Verification Lead</div>
            </div>

            <button className="btn btn-secondary w-full btn-sm" onClick={handleLogout}>
              Sign Out of Desk
            </button>
          </div>

          {/* Settings Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#191816', marginBottom: '1rem' }}>
                Account & Byline Settings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="field-label" style={{ display: 'block', marginBottom: 4 }}>ANALYST BYLINE NAME</label>
                  <input className="form-input" defaultValue={user?.name || 'Dr. M. Okafor'} />
                </div>
                <div>
                  <label className="field-label" style={{ display: 'block', marginBottom: 4 }}>INSTITUTIONAL EMAIL</label>
                  <input className="form-input" defaultValue={user?.email || 'm.okafor@meridian-desk.org'} />
                </div>
                <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
                  Save Profile Changes
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', color: '#191816', marginBottom: '0.5rem' }}>
                Automated Verification Notifications
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#78716c', marginBottom: '1rem' }}>
                Notify via browser desktop alert when high-priority background evidence retrievals complete.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="notif-toggle"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  style={{ accentColor: '#191816' }}
                />
                <label htmlFor="notif-toggle" style={{ fontSize: '0.85rem', color: '#191816', cursor: 'pointer' }}>
                  Enable real-time notification alerts
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
