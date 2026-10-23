// ============================================================
// Utility functions
// ============================================================

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const timeAgo = (dateStr) => {
  const now = new Date();
  const past = new Date(dateStr);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const truncate = (str, n = 80) =>
  str?.length > n ? str.slice(0, n) + '…' : str;

export const getScoreColor = (score) => {
  if (score >= 70) return 'var(--color-real)';
  if (score >= 40) return 'var(--color-misleading)';
  return 'var(--color-fake)';
};

export const getScoreLabel = (score) => {
  if (score >= 80) return 'High';
  if (score >= 60) return 'Moderate-High';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Low';
  return 'Very Low';
};

export const getAssessmentColor = (assessment) => {
  const map = {
    LIKELY_FAKE: 'var(--color-fake)',
    LIKELY_REAL: 'var(--color-real)',
    MISLEADING: 'var(--color-misleading)',
    UNVERIFIED: 'var(--color-unverified)',
  };
  return map[assessment] || 'var(--color-unverified)';
};

export const getAssessmentBg = (assessment) => {
  const map = {
    LIKELY_FAKE: 'var(--color-fake-bg)',
    LIKELY_REAL: 'var(--color-real-bg)',
    MISLEADING: 'var(--color-misleading-bg)',
    UNVERIFIED: 'var(--color-unverified-bg)',
  };
  return map[assessment] || 'var(--color-unverified-bg)';
};

export const ASSESSMENT_LABELS = {
  LIKELY_FAKE: 'Likely Fake',
  LIKELY_REAL: 'Likely Real',
  MISLEADING: 'Potentially Misleading',
  UNVERIFIED: 'Unverified',
};

export const ASSESSMENT_BADGE_CLASS = {
  LIKELY_FAKE: 'badge-fake',
  LIKELY_REAL: 'badge-real',
  MISLEADING: 'badge-misleading',
  UNVERIFIED: 'badge-unverified',
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePassword = (pw) => pw.length >= 6;

export const getInputTypeIcon = (type) => {
  const map = { text: '📝', url: '🔗', image: '🖼️' };
  return map[type] || '📄';
};
