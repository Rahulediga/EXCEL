import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { useDatabase } from '../context/DatabaseContext';
import './Analytics.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="tooltip-row">
          <span className="tooltip-dot" style={{ background: entry.color }} />
          <span>{entry.name}: {entry.value} {entry.unit || 'kg'}</span>
        </div>
      ))}
    </div>
  );
};

export default function Analytics() {
  const { analyticsDaily, collectionEfficiency, wasteComposition, monthlyTrend, loading } = useDatabase();
  const [period, setPeriod] = useState('weekly');

  if (loading || !wasteComposition || !analyticsDaily) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Wet', value: wasteComposition.wet.value, color: '#10b981' },
    { name: 'Dry', value: wasteComposition.dry.value, color: '#3b82f6' },
    { name: 'Metal', value: wasteComposition.metal.value, color: '#f59e0b' },
  ];

  const summaryStats = [
    { label: 'Total Weight', value: '270.6 kg', sub: 'This month' },
    { label: 'Average Daily', value: '9.0 kg', sub: '30-day avg' },
    { label: 'Peak Day', value: 'Thursday', sub: '12.5 kg' },
    { label: 'Recycling Rate', value: '73%', sub: '+3.1% vs last month' },
  ];

  return (
    <div className="page">
      <div className="page-header animate-fade-in-up">
        <h1>Analytics</h1>
        <p>Detailed waste data analysis and trends</p>
      </div>

      {/* Period Filters */}
      <div className="analytics-filters animate-fade-in-up">
        {['daily', 'weekly', 'monthly'].map(p => (
          <button
            key={p}
            className={`filter-btn ${period === p ? 'active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="analytics-summary stagger-children">
        {summaryStats.map((stat, i) => (
          <div key={i} className="summary-stat glass-card">
            <p className="summary-value">{stat.value}</p>
            <p className="summary-label">{stat.label}</p>
            <p className="summary-sub">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-charts">
        {/* Stacked Bar Chart */}
        <div className="glass-card chart-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="chart-card-header">
            <h3>Waste by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsDaily} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" kg" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="wet" name="Wet" fill="#10b981" radius={[4, 4, 0, 0]} stackId="stack" />
              <Bar dataKey="dry" name="Dry" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="stack" />
              <Bar dataKey="metal" name="Metal" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Collection Efficiency */}
        <div className="glass-card chart-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="chart-card-header">
            <h3>Collection Efficiency</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={collectionEfficiency || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="collected" name="Collected" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="capacity" name="Capacity" stroke="var(--text-tertiary)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="analytics-bottom">
        {/* Category Distribution */}
        <div className="glass-card chart-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="chart-card-header">
            <h3>Category Distribution</h3>
          </div>
          <div className="distribution-content">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="distribution-legend">
              {pieData.map(item => (
                <div key={item.name} className="dist-legend-item">
                  <div className="dist-dot" style={{ background: item.color }} />
                  <span className="dist-name">{item.name}</span>
                  <span className="dist-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="glass-card chart-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="chart-card-header">
            <h3>Monthly Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="week" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" kg" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="wet" name="Wet" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dry" name="Dry" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="metal" name="Metal" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
