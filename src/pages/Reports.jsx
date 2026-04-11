import { useState } from 'react';
import { FileText, Download, Calendar, ArrowUpRight, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useDatabase } from '../context/DatabaseContext';
import './Reports.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: entry.color }} />
          <span>{entry.name}: {entry.value} kg</span>
        </div>
      ))}
    </div>
  );
};

export default function Reports() {
  const { reports, loading } = useDatabase();
  const [typeFilter, setTypeFilter] = useState('all');

  if (loading || !reports) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  const reportList = Array.isArray(reports) ? reports : Object.values(reports);
  const filtered = typeFilter === 'all' ? reportList : reportList.filter(r => r.type === typeFilter);

  return (
    <div className="page">
      <div className="page-header animate-fade-in-up">
        <h1>Reports</h1>
        <p>Generate and view waste management reports</p>
      </div>

      {/* Type Filter */}
      <div className="reports-controls animate-fade-in-up">
        <div className="filter-group">
          {['all', 'daily', 'weekly', 'monthly'].map(t => (
            <button
              key={t}
              className={`filter-btn ${typeFilter === t ? 'active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-primary">
          <FileText size={16} /> Generate Report
        </button>
      </div>

      {/* Report Cards */}
      <div className="reports-list stagger-children">
        {filtered.map(report => (
          <div key={report.id} className="report-card glass-card">
            <div className="report-card-header">
              <div className="report-icon-wrapper">
                <FileText size={20} />
              </div>
              <div className="report-meta">
                <h3 className="report-title">{report.title}</h3>
                <div className="report-period">
                  <Calendar size={13} />
                  <span>{report.period}</span>
                </div>
              </div>
              <span className={`badge badge-${report.type === 'daily' ? 'info' : report.type === 'weekly' ? 'warning' : 'success'}`}>
                {report.type}
              </span>
            </div>

            {/* Mini Chart */}
            <div className="report-chart">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={[
                  { name: 'Wet', value: report.wet, fill: '#10b981' },
                  { name: 'Dry', value: report.dry, fill: '#3b82f6' },
                  { name: 'Metal', value: report.metal, fill: '#f59e0b' },
                ]} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Weight" radius={[4, 4, 0, 0]}>
                    {[
                      { name: 'Wet', fill: '#10b981' },
                      { name: 'Dry', fill: '#3b82f6' },
                      { name: 'Metal', fill: '#f59e0b' },
                    ].map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Grid */}
            <div className="report-stats-grid">
              <div className="report-stat">
                <span className="report-stat-value">{report.totalWaste} kg</span>
                <span className="report-stat-label">Total Waste</span>
              </div>
              <div className="report-stat">
                <span className="report-stat-value">{report.efficiency}%</span>
                <span className="report-stat-label">Efficiency</span>
              </div>
              <div className="report-stat">
                <span className="report-stat-value">{report.collections}</span>
                <span className="report-stat-label">Collections</span>
              </div>
            </div>

            {/* Actions */}
            <div className="report-actions">
              <button className="btn btn-outline btn-sm">
                <Download size={14} /> Export PDF
              </button>
              <button className="btn btn-ghost btn-sm">
                <ArrowUpRight size={14} /> View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
