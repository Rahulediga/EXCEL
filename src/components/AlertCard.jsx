import { AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';
import { getSeverityColor } from '../utils/helpers';
import './AlertCard.css';

const severityIcons = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

export default function AlertCard({ alert, onAcknowledge }) {
  const Icon = severityIcons[alert.severity] || Info;

  return (
    <div className={`alert-card glass-card ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''}`}>
      <div className="alert-icon-wrapper" style={{ color: getSeverityColor(alert.severity) }}>
        <Icon size={20} />
      </div>
      <div className="alert-content">
        <div className="alert-header">
          <h4 className="alert-title">{alert.title}</h4>
          <span className={`badge badge-${alert.severity === 'critical' ? 'danger' : alert.severity === 'warning' ? 'warning' : 'info'}`}>
            {alert.severity}
          </span>
        </div>
        <p className="alert-message">{alert.message}</p>
        <div className="alert-footer">
          <span className="alert-time">{alert.timestamp}</span>
          <span className="alert-bin">{alert.bin}</span>
        </div>
      </div>
      <div className="alert-actions">
        {!alert.acknowledged && (
          <button
            className="alert-ack-btn"
            onClick={() => onAcknowledge?.(alert.id)}
            title="Acknowledge"
          >
            <CheckCircle size={16} />
          </button>
        )}
        <button className="alert-dismiss-btn" title="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
