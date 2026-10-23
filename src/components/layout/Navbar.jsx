import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, Bell, User, Menu, X, Search, ChevronDown,
  LayoutDashboard, CheckSquare, History, Bookmark,
  MessageSquare, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockNotifications } from '../../data/mockData/dashboardStats';
import { timeAgo, truncate } from '../../utils/formatters';
import './Navbar.css';

export const Navbar = ({ onMenuToggle, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo">
            <Shield size={20} />
          </div>
          <span className="navbar-title">VerifyAI</span>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/check" className="btn btn-primary btn-sm">
          <CheckSquare size={15} />
          Check News
        </Link>

        {/* Notifications */}
        <div className="navbar-dropdown-wrapper">
          <button
            className="navbar-icon-btn"
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotifications && (
            <div className="navbar-dropdown notif-dropdown">
              <div className="notif-header">
                <span className="notif-title">Notifications</span>
                {unreadCount > 0 && (
                  <button className="notif-mark-read" onClick={markAllRead}>Mark all read</button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <p className="notif-empty">No notifications</p>
                ) : notifications.map(n => (
                  <div key={n.id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                    onClick={() => { if (n.link) navigate(n.link); setShowNotifications(false); }}>
                    <div className="notif-dot-indicator" style={{ background: !n.isRead ? 'var(--brand-primary)' : 'transparent' }} />
                    <div className="notif-content">
                      <p className="notif-item-title">{n.title}</p>
                      <p className="notif-item-msg">{truncate(n.message, 60)}</p>
                      <span className="notif-time">{timeAgo(n.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="navbar-dropdown-wrapper">
          <button
            className="navbar-profile-btn"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
          >
            <div className="navbar-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="navbar-user-name hide-mobile">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} className="hide-mobile" />
          </button>

          {showProfile && (
            <div className="navbar-dropdown profile-dropdown">
              <div className="profile-dd-header">
                <div className="navbar-avatar navbar-avatar-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="profile-dd-name">{user?.name}</p>
                  <p className="profile-dd-email">{user?.email}</p>
                </div>
              </div>
              <div className="profile-dd-divider" />
              <Link to="/profile" className="profile-dd-item" onClick={() => setShowProfile(false)}>
                <User size={15} /> Profile & Settings
              </Link>
              <Link to="/dashboard" className="profile-dd-item" onClick={() => setShowProfile(false)}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/assistant" className="profile-dd-item" onClick={() => setShowProfile(false)}>
                <MessageSquare size={15} /> AI Assistant
              </Link>
              <div className="profile-dd-divider" />
              <button className="profile-dd-item profile-dd-logout" onClick={handleLogout}>
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div className="navbar-backdrop" onClick={() => { setShowNotifications(false); setShowProfile(false); }} />
      )}
    </nav>
  );
};
