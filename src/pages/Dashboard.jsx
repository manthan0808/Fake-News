import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserLayout } from '../components/layout/UserLayout';
import { proofDeskService } from '../services/api';
import './Dashboard.css';

// 30 days daily proofs bar data matching Screenshot 1
const DAILY_BARS = [
  24, 28, 32, 29, 36, 42, 38, 30, 26, 34, 40, 48, 44, 38, 36,
  46, 52, 49, 42, 39, 44, 48, 54, 58, 56, 50, 46, 52, 60, 64
];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [stats, history] = await Promise.all([
          proofDeskService.getAnalytics(),
          proofDeskService.getHistory()
        ]);
        setAnalytics(stats);
        setRecentScans(history);
      } catch (err) {
        console.error('Failed to load dashboard analytics:', err);
      }
    }
    loadData();
  }, []);

  const totalProofs = analytics ? analytics.totalProofs.toLocaleString() : '3,412';
  const avgTime = analytics ? analytics.avgTimeToVerdict : '2.1s';
  const autoVerified = analytics ? analytics.autoVerifiedRate : '61%';
  const disputed = analytics ? analytics.disputedVerdictsRate : '0.4%';

  return (
    <UserLayout>
      <div className="proof-desk-analytics">
        {/* Header matching Screenshot 1 */}
        <div className="analytics-header">
          <div className="analytics-meta-tag">LAST 30 DAYS</div>
          <h1 className="analytics-title serif-heading">Analytics</h1>
        </div>

        {/* 4-Column Stat Strip */}
        <div className="proof-stat-strip">
          <div className="proof-stat-cell">
            <div className="proof-stat-label">TOTAL PROOFS</div>
            <div className="proof-stat-val">{totalProofs}</div>
          </div>
          <div className="proof-stat-cell">
            <div className="proof-stat-label">AVG TIME TO VERDICT</div>
            <div className="proof-stat-val">{avgTime}</div>
          </div>
          <div className="proof-stat-cell">
            <div className="proof-stat-label">AUTO-VERIFIED</div>
            <div className="proof-stat-val">{autoVerified}</div>
          </div>
          <div className="proof-stat-cell">
            <div className="proof-stat-label">DISPUTED VERDICTS</div>
            <div className="proof-stat-val text-green">{disputed}</div>
          </div>
        </div>

        {/* Main Analytics Grid matching Screenshot 1 */}
        <div className="analytics-grid">
          {/* Left Column: Proofs Per Day + Topics by Volume */}
          <div className="analytics-left-col">
            {/* Proofs per Day Chart */}
            <div className="card analytics-chart-card">
              <div className="chart-header">
                <span className="chart-title">PROOFS PER DAY</span>
                <span className="chart-hint">
                  {hoveredBar !== null ? `Day ${hoveredBar + 1}: ${DAILY_BARS[hoveredBar]} proofs` : 'hover the bars'}
                </span>
              </div>

              <div className="bar-chart-strip">
                {DAILY_BARS.map((val, idx) => {
                  const isLatest = idx === DAILY_BARS.length - 1;
                  const heightPct = (val / 70) * 100;
                  return (
                    <div
                      key={idx}
                      className="bar-chart-slot"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      <div
                        className={`bar-chart-bar ${isLatest ? 'bar-latest' : ''}`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="bar-chart-timeline">
                <span>JUN 7</span>
                <span>JUN 21</span>
                <span>JUL 6</span>
              </div>
            </div>

            {/* Topics by Volume */}
            <div className="card topics-card">
              <div className="topics-heading">TOPICS BY VOLUME</div>
              <div className="topics-list">
                {[
                  { topic: 'Politics', count: '1084', width: '92%' },
                  { topic: 'Health', count: '742', width: '70%' },
                  { topic: 'Finance', count: '618', width: '58%' },
                  { topic: 'Tech & AI', count: '512', width: '48%' },
                  { topic: 'Climate', count: '456', width: '42%' }
                ].map((item, i) => (
                  <div key={i} className="topic-row">
                    <span className="topic-name">{item.topic}</span>
                    <div className="topic-bar-track">
                      <div className="topic-bar-fill" style={{ width: item.width }} />
                    </div>
                    <span className="topic-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Verdict Mix, Calibration, Busiest Hour */}
          <div className="analytics-right-col">
            {/* Verdict Mix */}
            <div className="card right-panel-card">
              <div className="verdict-mix-heading">VERDICT MIX · 300</div>
              
              <div className="segmented-bar">
                <div className="seg-fill seg-verified" style={{ width: '60%' }} title="Verified 2,047" />
                <div className="seg-fill seg-misleading" style={{ width: '18%' }} title="Misleading 614" />
                <div className="seg-fill seg-false" style={{ width: '14%' }} title="False 512" />
                <div className="seg-fill seg-unverified" style={{ width: '8%' }} title="Unverified 239" />
              </div>

              <div className="verdict-legend-grid">
                <div className="legend-item"><span className="legend-dot dot-verified" /> Verified 2,047</div>
                <div className="legend-item"><span className="legend-dot dot-misleading" /> Misleading 614</div>
                <div className="legend-item"><span className="legend-dot dot-false" /> False 512</div>
                <div className="legend-item"><span className="legend-dot dot-unverified" /> Unverified 239</div>
              </div>

              <div className="panel-divider" />

              {/* Confidence Calibration */}
              <div className="calibration-section">
                <div className="calibration-heading">CONFIDENCE CALIBRATION</div>
                <p className="calibration-text">
                  Verdicts filed at 90%+ confidence were later disputed in 0.2% of cases — within the 0.5% target. Calibration drift: none detected.
                </p>
              </div>

              <div className="panel-divider" />

              {/* Busiest Hour */}
              <div className="busiest-hour-section">
                <div className="busiest-heading">BUSIEST HOUR</div>
                <div className="busiest-time serif-heading">08:00–09:00</div>
                <p className="busiest-sub">Morning wire ingest + overnight viral backlog</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Scans Table (Reference checks) */}
        <div className="recent-scans-section">
          <div className="recent-scans-header">
            <h2 className="recent-scans-title serif-heading">Recent Reference Checks</h2>
            <Link to="/check" className="btn btn-secondary btn-sm">+ Scan Webpage or Claim</Link>
          </div>

          <div className="card table-card">
            <table className="proof-table">
              <thead>
                <tr>
                  <th>STATUS</th>
                  <th>HEADLINE / CLAIM</th>
                  <th>DOMAIN / SOURCE</th>
                  <th>CONFIDENCE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.slice(0, 5).map(scan => (
                  <tr key={scan.id}>
                    <td>
                      <span className={`badge badge-${scan.assessment.toLowerCase()}`}>
                        {scan.assessment}
                      </span>
                    </td>
                    <td>
                      <Link to={`/result/${scan.id}`} className="scan-table-headline">
                        {scan.headline}
                      </Link>
                      <div className="scan-table-meta">
                        {scan.counts?.verified || 0} verified claims · {new Date(scan.scannedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className="scan-table-domain">{scan.domain || 'Direct Input'}</span>
                    </td>
                    <td>
                      <div className="confidence-cell">
                        <div className="meter-bar" style={{ width: '60px' }}>
                          <div className="meter-fill" style={{ width: `${scan.scores?.credibility || 85}%` }} />
                        </div>
                        <span className="confidence-num">{scan.scores?.credibility || 85}%</span>
                      </div>
                    </td>
                    <td>
                      <Link to={`/result/${scan.id}`} className="btn btn-secondary btn-sm">
                        View Report ↗
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
