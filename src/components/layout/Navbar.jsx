import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const BREADCRUMB_MAP = {
  '/dashboard': 'Analytics / Last 30 days',
  '/check': 'Verify / Factual Claim & URL Scanner',
  '/history': 'Publish / Proof Archive',
  '/saved': 'Publish / Saved Cases',
  '/profile': 'Organization / Team Workspace',
  '/admin/analytics': 'Analytics / Proof Desk Performance',
  '/admin/ml': 'Evaluation / Model Benchmark & Confusion Matrix',
  '/admin/sources': 'Verify / Source Credibility Directory'
};

export const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const breadcrumb = BREADCRUMB_MAP[currentPath] || 'The Meridian / Proof Desk';

  const parts = breadcrumb.split(' / ');

  return (
    <header className="desk-navbar">
      <div className="desk-navbar-left">
        <button className="desk-menu-toggle" onClick={onMenuToggle} aria-label="Toggle Navigation">
          ☰
        </button>
        <div className="desk-breadcrumb">
          <span className="desk-breadcrumb-parent">{parts[0]}</span>
          {parts[1] && (
            <>
              <span className="desk-breadcrumb-sep">/</span>
              <span className="desk-breadcrumb-active">{parts[1]}</span>
            </>
          )}
        </div>
      </div>

      <div className="desk-navbar-right">
        <div className="desk-search-box">
          <input
            type="text"
            placeholder="Search claims or command..."
            className="desk-search-input"
            readOnly
            onClick={() => window.location.href = '/check'}
          />
          <span className="desk-search-kbd">⌘K</span>
        </div>

        <Link to="/check" className="btn btn-primary btn-sm desk-new-btn">
          + New verification
        </Link>
      </div>
    </header>
  );
};
