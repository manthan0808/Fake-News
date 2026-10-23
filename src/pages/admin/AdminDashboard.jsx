import { Users, FileText, AlertOctagon, CheckCircle, XCircle, Globe, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AdminLayout } from './AdminLayout';
import { mockAdminStats } from '../../data/mockData/dashboardStats';
import './Admin.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color || p.fill }}>{p.name}: <strong>{p.value}</strong></p>)}
    </div>
  );
  return null;
};

const STAT_CARDS = [
  { label: 'Total Users', val: mockAdminStats.totalUsers, icon: Users, color: '#6366f1' },
  { label: 'News Checked', val: mockAdminStats.newsChecked.toLocaleString(), icon: FileText, color: '#06b6d4' },
  { label: 'Fake Detected', val: mockAdminStats.fakeDetected.toLocaleString(), icon: XCircle, color: '#ef4444' },
  { label: 'Real Detected', val: mockAdminStats.realDetected.toLocaleString(), icon: CheckCircle, color: '#22c55e' },
  { label: 'Reports Filed', val: mockAdminStats.reportsSubmitted, icon: AlertOctagon, color: '#f59e0b' },
];

const PIE = [
  { name: 'Fake', value: mockAdminStats.fakeDetected, fill: '#ef4444' },
  { name: 'Real', value: mockAdminStats.realDetected, fill: '#22c55e' },
  { name: 'Misleading', value: mockAdminStats.misleadingDetected, fill: '#f59e0b' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Admin Dashboard" subtitle="Platform-wide activity overview">
      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {STAT_CARDS.map((c, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="admin-stat-val" style={{ color: c.color }}>{c.val}</div>
                <div className="admin-stat-label">{c.label}</div>
              </div>
              <div style={{ background: `${c.color}18`, border: `1px solid ${c.color}25`, width: 38, height: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={18} style={{ color: c.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Daily Analysis Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockAdminStats.dailyAnalyses} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" name="Analyses" stroke="#6366f1" strokeWidth={2} fill="url(#adminGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Fake / Real / Misleading</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={PIE} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {PIE.map((s, i) => <Cell key={i} fill={s.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={10} formatter={v => <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>User Growth</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockAdminStats.userGrowth} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" name="Users" stroke="#22c55e" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockAdminStats.categoryStats} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" radius={[4,4,0,0]}>
                {mockAdminStats.categoryStats.map((_, i) => <Cell key={i} fill={`hsl(${200 + i * 25}, 70%, 55%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
