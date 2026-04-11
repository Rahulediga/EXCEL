import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, Bell } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { useDatabase } from '../context/DatabaseContext';
import './Alerts.css';

export default function Alerts() {
  const { alerts: firebaseAlerts, loading } = useDatabase();
  const [localAck, setLocalAck] = useState({});
  const [filter, setFilter] = useState('all');

  if (loading || !firebaseAlerts) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  const alertList = firebaseAlerts.map(a => ({
    ...a,
    acknowledged: localAck[a.id] ?? a.acknowledged,
  }));

  const handleAcknowledge = (id) => {
    setLocalAck(prev => ({ ...prev, [id]: true }));
  };

  const filtered = alertList.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !a.acknowledged;
    return a.severity === filter;
  });

  const counts = {
    all: alertList.length,
    critical: alertList.filter(a => a.severity === 'critical').length,
    warning: alertList.filter(a => a.severity === 'warning').length,
    info: alertList.filter(a => a.severity === 'info').length,
    unread: alertList.filter(a => !a.acknowledged).length,
  };

  return (
    <div className="page">
      <div className="page-header animate-fade-in-up">
        <h1>Alerts</h1>
        <p>System notifications and warnings</p>
      </div>

      {/* Alert Stats */}
      <div className="alert-stats stagger-children">
        <div className="alert-stat glass-card critical-stat" onClick={() => setFilter('critical')}>
          <AlertTriangle size={20} />
          <div>
            <p className="alert-stat-count">{counts.critical}</p>
            <p className="alert-stat-label">Critical</p>
          </div>
        </div>
        <div className="alert-stat glass-card warning-stat" onClick={() => setFilter('warning')}>
          <AlertCircle size={20} />
          <div>
            <p className="alert-stat-count">{counts.warning}</p>
            <p className="alert-stat-label">Warnings</p>
          </div>
        </div>
        <div className="alert-stat glass-card info-stat" onClick={() => setFilter('info')}>
          <Info size={20} />
          <div>
            <p className="alert-stat-count">{counts.info}</p>
            <p className="alert-stat-label">Info</p>
          </div>
        </div>
        <div className="alert-stat glass-card unread-stat" onClick={() => setFilter('unread')}>
          <Bell size={20} />
          <div>
            <p className="alert-stat-count">{counts.unread}</p>
            <p className="alert-stat-label">Unread</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="alert-filters animate-fade-in-up">
        <div className="filter-group">
          {['all', 'critical', 'warning', 'info', 'unread'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>
        <button
          className="btn btn-outline"
          onClick={() => {
            const allAck = {};
            alertList.forEach(a => { allAck[a.id] = true; });
            setLocalAck(allAck);
          }}
        >
          Mark All Read
        </button>
      </div>

      {/* Alert List */}
      <div className="alerts-list stagger-children">
        {filtered.map(alert => (
          <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state glass-card">
            <Bell size={40} />
            <h3>No alerts</h3>
            <p>All caught up! No alerts match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
