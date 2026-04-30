import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, AlertCircle, Info, Bell, Mail, Loader2, CheckCircle } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import './Alerts.css';

const EMAIL_API = 'http://localhost:3001';

export default function Alerts() {
  const { alerts: firebaseAlerts, loading } = useDatabase();
  const { currentUser } = useAuth();
  const [localAck, setLocalAck] = useState({});
  const [filter, setFilter] = useState('all');
  const [emailStatus, setEmailStatus] = useState('idle'); // idle | sending | sent | error
  const [autoSentIds, setAutoSentIds] = useState(new Set()); // track auto-sent alert IDs
  const autoSendTriggered = useRef(false);

  // Get the logged-in user's email
  const userEmail = currentUser?.email;

  // ─── Auto-send email for critical alerts on first load ───
  useEffect(() => {
    if (loading || !firebaseAlerts || autoSendTriggered.current || !userEmail) return;

    const criticalAlerts = firebaseAlerts.filter(
      a => a.severity === 'critical' && !a.acknowledged
    );

    // Only auto-send if there are critical alerts we haven't emailed yet
    const newCritical = criticalAlerts.filter(a => !autoSentIds.has(a.id));

    if (newCritical.length > 0) {
      autoSendTriggered.current = true;
      sendCriticalAlerts(newCritical, true);
    }
  }, [loading, firebaseAlerts, userEmail]);

  // ─── Send critical alerts via email ───
  const sendCriticalAlerts = async (alertsToSend, isAuto = false) => {
    if (!alertsToSend || alertsToSend.length === 0) return;

    try {
      setEmailStatus('sending');

      const response = await fetch(`${EMAIL_API}/send-alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alerts: alertsToSend, recipientEmail: userEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailStatus('sent');
        // Track which alert IDs we've sent
        setAutoSentIds(prev => {
          const next = new Set(prev);
          alertsToSend.forEach(a => next.add(a.id));
          return next;
        });
        console.log(`[EMAIL] ${isAuto ? 'Auto-sent' : 'Sent'} ${alertsToSend.length} critical alert(s)`);
        setTimeout(() => setEmailStatus('idle'), 4000);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (err) {
      console.error('[EMAIL] Send failed:', err);
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 4000);
    }
  };

  // ─── Manual "Email Critical Alerts" button handler ───
  const handleEmailCritical = () => {
    const criticalAlerts = alertList.filter(
      a => a.severity === 'critical' && !a.acknowledged
    );
    if (criticalAlerts.length === 0) {
      alert('No unacknowledged critical alerts to email.');
      return;
    }
    sendCriticalAlerts(criticalAlerts, false);
  };

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

      {/* Email Status Toast */}
      {emailStatus !== 'idle' && (
        <div className={`email-toast email-toast-${emailStatus} animate-fade-in-up`}>
          {emailStatus === 'sending' && (
            <>
              <Loader2 size={16} className="spin-icon" />
              <span>Sending critical alerts to email...</span>
            </>
          )}
          {emailStatus === 'sent' && (
            <>
              <CheckCircle size={16} />
              <span>Critical alerts emailed successfully!</span>
            </>
          )}
          {emailStatus === 'error' && (
            <>
              <AlertTriangle size={16} />
              <span>Failed to send email. Make sure the email server is running.</span>
            </>
          )}
        </div>
      )}

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
        <div className="alert-header-actions">
          <button
            className={`btn ${emailStatus === 'sent' ? 'btn-success-email' : 'btn-danger'}`}
            onClick={handleEmailCritical}
            disabled={emailStatus === 'sending'}
          >
            {emailStatus === 'sending' ? (
              <>
                <Loader2 size={15} className="spin-icon" /> Sending...
              </>
            ) : emailStatus === 'sent' ? (
              <>
                <CheckCircle size={15} /> Sent!
              </>
            ) : (
              <>
                <Mail size={15} /> Email Critical Alerts
              </>
            )}
          </button>
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
