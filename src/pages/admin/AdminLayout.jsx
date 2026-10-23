import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, FileText, AlertOctagon, Globe, BarChart2, Cpu, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const ADMIN_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Reports', icon: AlertOctagon, path: '/admin/reports' },
  { label: 'Sources', icon: Globe, path: '/admin/sources' },
  { label: 'Analytics', icon: BarChart2, path: '/admin/analytics' },
  { label: 'ML Performance', icon: Cpu, path: '/admin/ml' },
];

export const AdminLayout = ({ children, title, subtitle }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo"><Shield size={18} /></div>
          <div>
            <div className="admin-brand-name">VerifyAI Admin</div>
            <div className="admin-brand-sub">Platform Control</div>
          </div>
        </div>
        <nav className="admin-nav">
          {ADMIN_NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              <ChevronRight size={14} className="admin-nav-chevron" />
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-user-avatar">{user?.name?.charAt(0) || 'A'}</div>
            <div>
              <div className="admin-user-name">{user?.name || 'Admin'}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Admin Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-page-title">{title}</h1>
            {subtitle && <p className="admin-page-sub">{subtitle}</p>}
          </div>
          <div className="admin-topbar-right">
            <span className="admin-stage-badge">Stage 1 — Mock Data</span>
            <Link to="/" className="btn btn-secondary btn-sm">← Main Site</Link>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};
