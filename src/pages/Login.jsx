import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (type) => {
    if (type === 'user') setForm(f => ({ ...f, email: 'manthan@example.com', password: 'password123' }));
    else setForm(f => ({ ...f, email: 'admin@verifai.com', password: 'admin123' }));
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
            <span>VerifyAI</span>
          </Link>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-sub">Sign in to continue verifying news</p>
        </div>

        {/* Demo Credentials */}
        <div className="auth-demo-box">
          <p className="auth-demo-title">🧪 Demo Credentials</p>
          <div className="auth-demo-btns">
            <button className="auth-demo-btn" onClick={() => fillDemo('user')}>User Login</button>
            <button className="auth-demo-btn" onClick={() => fillDemo('admin')}>Admin Login</button>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              id="login-email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-pw-wrap">
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                id="login-password"
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-row">
            <label className="auth-checkbox-label">
              <input type="checkbox" checked={form.remember} onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))} />
              Remember me
            </label>
            <a href="#" className="auth-link">Forgot password?</a>
          </div>

          <button className="btn btn-primary w-full" type="submit" disabled={loading} id="login-submit">
            {loading ? <span className="auth-spinner" /> : null}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
