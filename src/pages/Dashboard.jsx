import { Scale, Trash2, Bell, Recycle, Droplets, Zap, Activity, Timer } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import { useDatabase } from '../context/DatabaseContext';
import './Dashboard.css';

const activityIcons = {
  recycle: <Recycle size={14} />,
  alert: <Bell size={14} />,
  metal: <Zap size={14} />,
  collection: <Trash2 size={14} />,
  sensor: <Activity size={14} />,
  battery: <Zap size={14} />,
};

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

export default function Dashboard() {
  const { dashboardStats, wasteComposition, weeklyTrend, recentActivity, loading } = useDatabase();

  if (loading || !dashboardStats || !wasteComposition) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  const s = dashboardStats;

  const pieData = [
    { name: 'Wet Waste', value: wasteComposition.wet.value, color: '#10b981' },
    { name: 'Dry Waste', value: wasteComposition.dry.value, color: '#3b82f6' },
    { name: 'Metal Waste', value: wasteComposition.metal.value, color: '#f59e0b' },
  ];

  const activityData = recentActivity || [];

  return (
    <div className="page">
      <div className="page-header animate-fade-in-up">
        <h1>Dashboard</h1>
        <p>Real-time overview of your waste management system</p>
      </div>

      {/* Stats Row */}
      <div className="grid-4 stagger-children">
        <StatsCard label={s.totalWasteToday.label} value={s.totalWasteToday.value} unit={s.totalWasteToday.unit} change={s.totalWasteToday.change} icon={Scale} color="#3b82f6" />
        <StatsCard label={s.activeBins.label} value={s.activeBins.value} unit={s.activeBins.unit} change={s.activeBins.change} icon={Trash2} color="#10b981" />
        <StatsCard label={s.alertsCount.label} value={s.alertsCount.value} unit={s.alertsCount.unit} change={s.alertsCount.change} icon={Bell} color="#ef4444" />
        <StatsCard label={s.recyclingRate.label} value={s.recyclingRate.value} unit={s.recyclingRate.unit} change={s.recyclingRate.change} icon={Recycle} color="#8b5cf6" />
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts">
        {/* Waste Composition */}
        <div className="glass-card chart-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="chart-card-header">
            <h3>Waste Composition</h3>
            <span className="badge badge-info">Today</span>
          </div>
          <div className="composition-chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="composition-legend">
              {pieData.map(item => (
                <div key={item.name} className="legend-item">
                  <span className="legend-dot" style={{ background: item.color }} />
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="glass-card chart-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="chart-card-header">
            <h3>Weekly Collection Trend</h3>
            <span className="badge badge-info">Last 7 Days</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradWet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMetal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" kg" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="wet" name="Wet" stroke="#10b981" fill="url(#gradWet)" strokeWidth={2} />
              <Area type="monotone" dataKey="dry" name="Dry" stroke="#3b82f6" fill="url(#gradDry)" strokeWidth={2} />
              <Area type="monotone" dataKey="metal" name="Metal" stroke="#f59e0b" fill="url(#gradMetal)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="glass-card activity-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="chart-card-header">
          <h3>Recent Activity</h3>
          <button className="btn btn-ghost">View All</button>
        </div>
        <div className="activity-list stagger-children">
          {activityData.map(item => (
            <div key={item.id} className="activity-item">
              <div className="activity-icon" style={{ color: item.color, background: `${item.color}15` }}>
                {activityIcons[item.icon] || <Activity size={14} />}
              </div>
              <div className="activity-text">
                <p>{item.text}</p>
                <span className="activity-time">
                  <Timer size={11} /> {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
