import { Wifi, WifiOff, AlertTriangle, Battery, MapPin, Clock, Thermometer, Droplets } from 'lucide-react';
import { getFillColor, getFillClass } from '../utils/helpers';
import './BinCard.css';

export default function BinCard({ bin, onClick }) {
  const statusIcon = {
    online: <Wifi size={14} />,
    offline: <WifiOff size={14} />,
    alert: <AlertTriangle size={14} />,
  };

  const statusLabel = {
    online: 'Online',
    offline: 'Offline',
    alert: 'Alert',
  };

  return (
    <div className={`bin-card glass-card ${bin.status}`} onClick={() => onClick?.(bin)}>
      <div className="bin-card-header">
        <div>
          <h3 className="bin-name">{bin.name}</h3>
          <p className="bin-id">{bin.id}</p>
        </div>
        <div className={`bin-status-badge ${bin.status}`}>
          {statusIcon[bin.status]}
          <span>{statusLabel[bin.status]}</span>
        </div>
      </div>

      <div className="bin-fill-section">
        <div className="bin-fill-header">
          <span>Fill Level</span>
          <span className="bin-fill-value" style={{ color: getFillColor(bin.fillLevel) }}>
            {bin.fillLevel}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-bar-fill ${getFillClass(bin.fillLevel)}`}
            style={{ width: `${bin.fillLevel}%` }}
          />
        </div>
      </div>

      <div className="bin-meta-grid">
        <div className="bin-meta-item">
          <MapPin size={13} />
          <span>{bin.location}</span>
        </div>
        <div className="bin-meta-item">
          <Battery size={13} />
          <span>{bin.battery}%</span>
        </div>
        <div className="bin-meta-item">
          <Clock size={13} />
          <span>{bin.lastEmptied}</span>
        </div>
        <div className="bin-meta-item">
          <Thermometer size={13} />
          <span>{bin.temperature}°C</span>
        </div>
      </div>

      <div className="bin-card-footer">
        <div className="bin-breakdown">
          <div className="breakdown-item">
            <span className="dot wet"></span>
            <span>{bin.breakdown?.wet || 0}kg Wet</span>
          </div>
          <div className="breakdown-item">
            <span className="dot dry"></span>
            <span>{bin.breakdown?.dry || 0}kg Dry</span>
          </div>
          <div className="breakdown-item">
            <span className="dot metal"></span>
            <span>{bin.breakdown?.metal || 0}kg Metal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getCatColor(cat) {
  switch (cat) {
    case 'Wet': return 'var(--eco-wet)';
    case 'Dry': return 'var(--eco-dry)';
    case 'Metal': return 'var(--eco-metal)';
    default: return 'var(--text-secondary)';
  }
}
