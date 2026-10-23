import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, TrendingUp, AlertTriangle, CheckCircle, HelpCircle,
  ExternalLink, Bookmark, Calendar, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { UserLayout } from '../components/layout/UserLayout';
import { useAuth } from '../context/AuthContext';
import { mockDashboardStats } from '../data/mockData/dashboardStats';
import { mockNewsHistory } from '../data/mockData/news';
import {
  formatDate, truncate, ASSESSMENT_LABELS, ASSESSMENT_BADGE_CLASS
} from '../utils/formatters';
import './Dashboard.css';

const STAT_CARDS = (stats) => [
  { label: 'Total Checks', value: stats.totalChecks, icon: Search, color: '#6366f1', delta: '+12 this week' },
  { label: 'Likely Fake', value: stats.likelyFake, icon: AlertTriangle, color: '#ef4444', delta: '25% of total' },
  { label: 'Likely Real', value: stats.likelyReal, icon: CheckCircle, color: '#22c55e', delta: '55.5% of total' },
  { label: 'Misleading', value: stats.misleading, icon: HelpCircle, color: '#f59e0b', delta: '19.5% of total' },
];

const PIE_COLORS = ['#ef4444', '#22c55e', '#f59e0b', '#94a3b8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill }}>{p.name}: <strong>{p.value}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const stats = mockDashboardStats.user;
  const recentChecks = mockNewsHistory.slice(0, 5);

  const pieData = [
    { name: 'Likely Fake', value: stats.likelyFake },
    { name: 'Likely Real', value: stats.likelyReal },
    { name: 'Misleading', value: stats.misleading },
    { name: 'Unverified', value: stats.totalChecks - stats.likelyFake - stats.likelyReal - stats.misleading },
  ];

  return (
    <UserLayout>
      <div className="dashboard animate-fade-in">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Welcome back, {user?.name?.split(' ')[0]}. Here's your verification activity.</p>
          </div>
          <Link to="/check" className="btn btn-primary">
            <Search size={16} /> Check News
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="dash-stats-grid">
          {STAT_CARDS(stats).map((card, i) => (
            <div key={i} className={`dash-stat-card animate-fade-in-up delay-${i + 1}`}>
              <div className="dash-stat-top">
                <div className="dash-stat-icon" style={{ background: `${card.color}18`, border: `1px solid ${card.color}25` }}>
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                <span className="dash-stat-delta">{card.delta}</span>
              </div>
              <div className="dash-stat-value" style={{ color: card.color }}>{card.value}</div>
              <div className="dash-stat-label">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="dash-charts-row">
          {/* Area Chart — Checks over time */}
          <div className="card dash-chart-card large-chart">
            <div className="chart-header">
              <h3 className="chart-title">Checks Over Time</h3>
              <span className="chart-period">Last 30 days</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockDashboardStats.checksOverTime} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="checkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="checks" stroke="#6366f1" strokeWidth={2} fill="url(#checkGrad)" name="Checks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart — Fake/Real/Misleading */}
          <div className="card dash-chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Result Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="dash-charts-row">
          {/* Bar Chart — Categories */}
          <div className="card dash-chart-card large-chart">
            <div className="chart-header">
              <h3 className="chart-title">News Categories</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockDashboardStats.categoryBreakdown} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Checks" radius={[4, 4, 0, 0]}>
                  {mockDashboardStats.categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={`hsl(${240 + i * 30}, 70%, 60%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Credibility Distribution */}
          <div className="card dash-chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Credibility Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockDashboardStats.credibilityDistribution} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Articles" radius={[4,4,0,0]}>
                  {mockDashboardStats.credibilityDistribution.map((_, i) => (
                    <Cell key={i} fill={['#ef4444','#f97316','#f59e0b','#84cc16','#22c55e'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Checks Table */}
        <div className="card dash-recent-card animate-fade-in-up">
          <div className="chart-header">
            <h3 className="chart-title">Recent Checks</h3>
            <Link to="/history" className="btn btn-ghost btn-sm">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="recent-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Headline</th>
                  <th>Category</th>
                  <th>Result</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentChecks.map(item => (
                  <tr key={item.id}>
                    <td className="recent-headline">{truncate(item.headline, 55)}</td>
                    <td><span className="category-pill">{item.category}</span></td>
                    <td>
                      <span className={`badge ${ASSESSMENT_BADGE_CLASS[item.assessment]}`}>
                        {ASSESSMENT_LABELS[item.assessment]}
                      </span>
                    </td>
                    <td>
                      <div className="score-mini">
                        <div className="score-mini-bar" style={{ width: `${item.credibilityScore}%`, background: item.credibilityScore >= 70 ? 'var(--color-real)' : item.credibilityScore >= 40 ? 'var(--color-misleading)' : 'var(--color-fake)' }} />
                        <span className="score-mini-val">{item.credibilityScore}</span>
                      </div>
                    </td>
                    <td className="date-cell">{formatDate(item.analysisDate)}</td>
                    <td>
                      <Link to={`/result/${item.id}`} className="btn btn-ghost btn-sm">
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
