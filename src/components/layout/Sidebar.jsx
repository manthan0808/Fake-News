import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VeriScopeLogo } from '../common/VeriScopeLogo';
import './Sidebar.css';

const SECTIONS = [
  {
    heading: 'VERIFY',
    items: [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Fact Check', path: '/check' },
      { label: 'Evidence Benchmark', path: '/admin/ml' },
      { label: 'Source Explorer', path: '/admin/sources' }
    ]
  },
  {
    heading: 'PUBLISH',
    items: [
      { label: 'Proof Archive', path: '/history' },
      { label: 'Saved Cases', path: '/saved' }
    ]
  },
  {
    heading: 'ORGANIZATION',
    items: [
      { label: 'Analytics', path: '/admin/analytics' },
      { label: 'Team Workspace', path: '/profile' }
    ]
  }
];

export const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-brand-link">
            <VeriScopeLogo size={32} showWordmark={true} />
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {SECTIONS.map((section, idx) => (
            <div key={idx} className="sidebar-group">
              <div className="sidebar-group-heading">{section.heading}</div>
              {section.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                  onClick={onClose}
                >
                  <span className="sidebar-link-text">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-links">
            <NavLink to="/history" className="sidebar-footer-link">
              <span>Notifications</span>
              <span className="sidebar-badge-count">3</span>
            </NavLink>
            <NavLink to="/profile" className="sidebar-footer-link">
              <span>Settings</span>
            </NavLink>
          </div>
          <div className="sidebar-user-strip">
            <div className="sidebar-avatar">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'MO'}
            </div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">{user?.name || 'M. Okafor'}</span>
              <span className="sidebar-user-role">Research Desk</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
