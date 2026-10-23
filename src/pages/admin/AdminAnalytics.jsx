import { AdminLayout } from './AdminLayout';
import { mockAdminStats } from '../../data/mockData/dashboardStats';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color || p.fill }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
  return null;
};

export default function AdminAnalytics() {
  return (
    <AdminLayout title="Platform Analytics" subtitle="Aggregated platform usage statistics">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Daily Analyses (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockAdminStats.dailyAnalyses} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" name="Analyses" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockAdminStats.userGrowth} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" name="Users" radius={[4,4,0,0]}>
                {mockAdminStats.userGrowth.map((_, i) => <Cell key={i} fill="#22c55e" fillOpacity={0.5 + i * 0.08} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockAdminStats.categoryStats} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Checks" radius={[4,4,0,0]}>
                {mockAdminStats.categoryStats.map((_, i) => <Cell key={i} fill={`hsl(${200 + i * 25}, 70%, 55%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
