import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatsCard.css';

export default function StatsCard({ label, value, unit, change, icon: Icon, color, delay = 0 }) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="stats-card glass-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ background: `${color}18`, color: color }}>
          <Icon size={20} />
        </div>
        {!isNeutral && (
          <div className={`stats-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
        {isNeutral && (
          <div className="stats-change neutral">
            <Minus size={14} />
            <span>0%</span>
          </div>
        )}
      </div>
      <div className="stats-card-body">
        <div className="stats-value">
          {value}
          <span className="stats-unit">{unit}</span>
        </div>
        <p className="stats-label">{label}</p>
      </div>
    </div>
  );
}
