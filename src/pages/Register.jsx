import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const getPwStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const pwStrength = getPwStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#22c55e', '#22c55e'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  const validations = [
    { label: 'At least 6 characters', ok: form.password.length >= 6 },
    { label: 'Contains a number', ok: /[0-9]/.test(form.password) },
    { label: 'Passwords match', ok: form.confirm && form.password === form.confirm },
  ];

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-card animate-fade-in-up" style={{ maxWidth: 440 }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-icon"><Shield size={20} /></div>
            <span>VerifyAI</span>
          </Link>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-sub">Start verifying news in seconds</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Manthan Patel"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              id="reg-name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              id="reg-email"
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
                id="reg-password"
              />
              <button type="button" className="auth-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && (
              <div className="auth-pw-strength">
                <div className="auth-pw-bar">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="auth-pw-seg" style={{ background: i <= pwStrength ? strengthColors[pwStrength] : 'var(--bg-surface)' }} />
                  ))}
                </div>
                <span style={{ color: strengthColors[pwStrength], fontSize: '0.75rem' }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              id="reg-confirm"
            />
          </div>

          {form.password && (
            <div className="auth-validations">
              {validations.map((v, i) => (
                <div key={i} className={`auth-val-item ${v.ok ? 'ok' : ''}`}>
                  {v.ok ? <Check size={12} /> : <X size={12} />} {v.label}
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-primary w-full" type="submit" disabled={loading} id="reg-submit">
            {loading ? <span className="auth-spinner" /> : null}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
