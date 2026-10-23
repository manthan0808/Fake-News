import { UserLayout } from '../../components/layout/UserLayout';
import { mockAdminStats } from '../../data/mockData/dashboardStats';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function AdminAnalytics() {
  return (
    <UserLayout>
      <div style={{ maxWidth: 1050, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="meta-tag">ANALYTICS / DESK AUDIT</div>
          <h1 className="serif-heading" style={{ fontSize: '2.2rem', margin: '0.25rem 0 0.5rem', color: '#191816' }}>
            System Audit & Verification Throughput
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#57534e' }}>
            Longitudinal telemetry tracking automated evidence retrieval latency, category load, and proof generation volume.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#191816', marginBottom: '1rem' }}>Daily Analyses Volume</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockAdminStats.dailyAnalyses} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <XAxis dataKey="date" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #ddd9cf', fontSize: '0.8rem' }} />
                <Line type="monotone" dataKey="count" stroke="#191816" strokeWidth={2} dot={{ fill: '#191816', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#191816', marginBottom: '1rem' }}>Research Desk Adoption</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockAdminStats.userGrowth} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <XAxis dataKey="month" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #ddd9cf', fontSize: '0.8rem' }} />
                <Bar dataKey="users" fill="#191816" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ gridColumn: '1 / -1', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: '#191816', marginBottom: '1rem' }}>Category Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockAdminStats.categoryStats} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <XAxis dataKey="category" tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#78716c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #ddd9cf', fontSize: '0.8rem' }} />
                <Bar dataKey="count" fill="#44403c" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
