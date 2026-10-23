import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../Auth.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: 'admin@verifai.com', password: 'admin123' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success && result.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Use admin@verifai.com / admin123');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>
      <div className="auth-card animate-fade-in-up">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon"><Shield size={20} /></div>
            <span>VerifyAI Admin</span>
          </Link>
          <h2 className="auth-title">Admin Sign In</h2>
          <p className="auth-sub">Platform administration portal</p>
        </div>

        <div className="auth-demo-box" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.15)' }}>
          <p className="auth-demo-title" style={{ color: 'var(--color-fake)' }}>🔑 Admin Credentials (Demo)</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Email: admin@verifai.com<br />Password: admin123
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error"><AlertCircle size={15} /> {error}</div>}
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} id="admin-email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-pw-wrap">
              <input className="form-input" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} id="admin-password" />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </div>
          <button className="btn btn-primary w-full" type="submit" disabled={loading} id="admin-login-submit">
            {loading ? <span className="auth-spinner" /> : null}
            {loading ? 'Signing In...' : 'Admin Sign In'}
          </button>
        </form>
        <p className="auth-switch"><Link to="/" className="auth-link">← Back to main site</Link></p>
      </div>
    </div>
  );
}
