export const VeriScopeLogo = ({ size = 28, showWordmark = true }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
        <line x1="32" y1="8" x2="32" y2="14" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="50" x2="32" y2="56" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="32" x2="14" y2="32" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="32" x2="56" y2="32" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <rect x="18" y="16" width="28" height="32" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
        <line x1="23" y1="23" x2="33" y2="23" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <line x1="23" y1="29" x2="41" y2="29" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
        <path d="M25 38L31 43L43 27" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: 'var(--font-sans)' }}>
            VeriScope
          </span>
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#64748b', letterSpacing: '0.12em', fontWeight: 600 }}>
            PROOF DESK SCANNER
          </span>
        </div>
      )}
    </div>
  );
};
