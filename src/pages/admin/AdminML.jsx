import { Info, Cpu, Clock } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { mockMLPerformance } from '../../data/mockData/claims';

const statusColor = { pending: 'var(--color-unverified)', planned: 'var(--brand-primary-light)' };
const statusLabel = { pending: 'Pending Training', planned: 'Planned (Stage 6)' };

export default function AdminML() {
  return (
    <AdminLayout title="ML Model Performance" subtitle="AI model metrics — will be populated after Stage 3 training">
      <div style={{ marginBottom: '1.25rem' }}>
        <div className="card" style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.15)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Info size={18} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.25rem' }}>
                Machine Learning Models — Stage 3
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Actual ML model training is scheduled for <strong>Stage 3</strong>. The performance metrics below will be populated with real accuracy, precision, recall, and F1 scores after training on the fake news dataset. No values have been fabricated.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {mockMLPerformance.models.map((model, i) => (
          <div key={i} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={16} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{model.name}</div>
                <div style={{ fontSize: '0.72rem', color: statusColor[model.status] || 'var(--text-muted)' }}>
                  <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{statusLabel[model.status] || model.status}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['accuracy', 'precision', 'recall', 'f1'].map(metric => (
                <div key={metric} style={{ background: 'var(--bg-surface)', borderRadius: 8, padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {model[metric] !== null ? `${(model[metric] * 100).toFixed(1)}%` : '—'}
                  </div>
                  <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 2 }}>{metric}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>Dataset Information</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {mockMLPerformance.note}
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {['LIAR Dataset', 'FakeNewsNet', 'ISOT Fake News Dataset', 'Custom collected data'].map((d, i) => (
            <span key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', padding: '0.3rem 0.75rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {d}
            </span>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
