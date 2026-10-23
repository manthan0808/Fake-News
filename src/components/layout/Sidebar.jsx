import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, History, Bookmark,
  User, MessageSquare, Shield, X, ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Check News', icon: CheckSquare, path: '/check' },
  { label: 'History', icon: History, path: '/history' },
  { label: 'Saved News', icon: Bookmark, path: '/saved' },
  { label: 'AI Assistant', icon: MessageSquare, path: '/assistant' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo"><Shield size={18} /></div>
            <span className="sidebar-brand-name">VerifyAI</span>
          </div>
          <button className="sidebar-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="sidebar-section-label">Navigation</div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
              onClick={onClose}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              <ChevronRight size={14} className="sidebar-chevron" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-demo-badge">
            🧪 Stage 1 — Frontend Prototype
          </div>
        </div>
      </aside>
    </>
  );
};
