import { useState, useEffect } from 'react';
import {
  Brain, Sparkles, TrendingUp, TrendingDown, Target,
  Leaf, Recycle, Clock, MapPin, Zap, BarChart3,
  ArrowRight, CheckCircle2, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { useDatabase } from '../context/DatabaseContext';
import './AIInsights.css';

const API_URL = 'http://127.0.0.1:8000';

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

const recIcons = {
  sprout: <Leaf size={20} />,
  recycle: <Recycle size={20} />,
  trending: <TrendingUp size={20} />,
  clock: <Clock size={20} />,
  map: <MapPin size={20} />,
};

const catColors = {
  wet: { bg: 'var(--eco-wet-bg)', color: 'var(--eco-wet)' },
  dry: { bg: 'var(--eco-dry-bg)', color: 'var(--eco-dry)' },
  metal: { bg: 'var(--eco-metal-bg)', color: 'var(--eco-metal)' },
  general: { bg: 'var(--eco-ai-bg)', color: 'var(--eco-ai)' },
};

export default function AIInsights() {
  const { recommendations, patterns, loading: dbLoading } = useDatabase();

  const [prediction, setPrediction] = useState(null);
  const [mlLoading, setMlLoading] = useState(true);
  const [mlError, setMlError] = useState(null);

  const fetchPrediction = async () => {
    setMlLoading(true);
    setMlError(null);
    try {
      const res = await fetch(`${API_URL}/predict`);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error('ML API error:', err);
      setMlError(err.message);
    } finally {
      setMlLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  if (dbLoading) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  const recList = recommendations ? (Array.isArray(recommendations) ? recommendations : Object.values(recommendations)) : [];
  const patternList = patterns ? (Array.isArray(patterns) ? patterns : Object.values(patterns)) : [];

  // Transform weekForecast for Recharts (use day names)
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekChartData = prediction?.weekForecast?.map(item => {
    const d = new Date(item.date);
    return {
      day: dayNames[d.getDay()],
      predicted: item.value,
      actual: null,
    };
  }) || [];

  return (
    <div className="page">
      <div className="page-header animate-fade-in-up">
        <div className="ai-header">
          <h1>
            <Brain className="ai-header-icon" size={28} />
            AI Insights
          </h1>
          <span className="badge badge-ai">
            <Sparkles size={12} /> ML Powered
          </span>
        </div>
        <p>Predictive analytics and smart recommendations for waste optimization</p>
      </div>

      {/* ===== WASTE PREDICTION SECTION ===== */}
      <section className="ai-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="section-title-row">
          <h2 className="section-title">
            <Target size={20} /> Waste Prediction
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={fetchPrediction} disabled={mlLoading}>
            <RefreshCw size={14} className={mlLoading ? 'spin-icon' : ''} />
            {mlLoading ? 'Training...' : 'Retrain Model'}
          </button>
        </div>

        {mlLoading ? (
          <div className="ml-loading glass-card">
            <div className="loading-spinner" />
            <p>Training ML model on historical data...</p>
            <span className="ml-loading-sub">Fetching from Firebase & running Holt-Winters forecast</span>
          </div>
        ) : mlError ? (
          <div className="ml-error glass-card">
            <p>Failed to fetch predictions: {mlError}</p>
            <button className="btn btn-outline btn-sm" onClick={fetchPrediction}>Retry</button>
          </div>
        ) : prediction ? (
          <>
            <div className="prediction-grid">
              {/* Tomorrow's Forecast Card */}
              <div className="forecast-card glass-card">
                <div className="forecast-badge">
                  <Sparkles size={14} /> Tomorrow's Forecast
                </div>
                <div className="forecast-total">
                  <span className="forecast-value">{prediction.tomorrow}</span>
                  <span className="forecast-unit">kg</span>
                </div>
                <p className="forecast-subtitle">Expected total waste generation</p>

                <div className="forecast-breakdown">
                  <div className="forecast-item">
                    <span className="forecast-dot" style={{ background: 'var(--eco-wet)' }} />
                    <span>Wet</span>
                    <span className="forecast-item-val">{prediction.breakdown.wet} kg</span>
                  </div>
                  <div className="forecast-item">
                    <span className="forecast-dot" style={{ background: 'var(--eco-dry)' }} />
                    <span>Dry</span>
                    <span className="forecast-item-val">{prediction.breakdown.dry} kg</span>
                  </div>
                  <div className="forecast-item">
                    <span className="forecast-dot" style={{ background: 'var(--eco-metal)' }} />
                    <span>Metal</span>
                    <span className="forecast-item-val">{prediction.breakdown.metal} kg</span>
                  </div>
                </div>

                <div className="forecast-confidence">
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${prediction.confidence}%` }} />
                  </div>
                  <span className="confidence-text">
                    <CheckCircle2 size={12} /> {prediction.confidence}% confidence
                  </span>
                </div>

                <div className="forecast-meta">
                  <span>Trained on {prediction.trainedOn} data points</span>
                  <span>Last data: {prediction.lastDataDate}</span>
                </div>
              </div>

              {/* 7-Day Forecast Chart */}
              <div className="glass-card chart-card">
                <div className="chart-card-header">
                  <h3>7-Day Waste Forecast</h3>
                  <span className="badge badge-ai">ML Prediction</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={weekChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradPrediction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                    <XAxis dataKey="day" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" kg" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#8b5cf6" fill="url(#gradPrediction)" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: 'var(--bg-primary)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Comparison */}
            <div className="glass-card chart-card animate-fade-in-up" style={{ animationDelay: '0.2s', marginTop: '20px' }}>
              <div className="chart-card-header">
                <h3>Predicted vs Previous Actual</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prediction.monthlyComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                  <XAxis dataKey="week" tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} axisLine={false} tickLine={false} unit=" kg" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="predicted" name="Predicted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="previousActual" name="Previous Actual" fill="#4b5563" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : null}
      </section>

      {/* ===== SMART RECOMMENDATIONS ===== */}
      <section className="ai-section animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="section-title">
          <Sparkles size={20} /> Smart Recommendations
        </h2>

        <div className="recommendations-grid stagger-children">
          {recList.map(rec => {
            const colors = catColors[rec.category] || catColors.general;
            return (
              <div key={rec.id} className="rec-card glass-card">
                <div className="rec-card-header">
                  <div className="rec-icon" style={{ background: colors.bg, color: colors.color }}>
                    {recIcons[rec.icon] || <Zap size={20} />}
                  </div>
                  <span className={`badge ${rec.priority === 'high' ? 'badge-danger' : rec.priority === 'medium' ? 'badge-warning' : 'badge-info'}`}>
                    {rec.priority} priority
                  </span>
                </div>
                <h3 className="rec-title">{rec.title}</h3>
                <p className="rec-message">{rec.message}</p>
                <div className="rec-impact">
                  <ArrowRight size={14} />
                  <span>{rec.impact}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== PATTERN DETECTION ===== */}
      <section className="ai-section animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="section-title">
          <BarChart3 size={20} /> Pattern Detection
        </h2>

        <div className="patterns-list stagger-children">
          {patternList.map(pattern => (
            <div key={pattern.id} className="pattern-card glass-card">
              <div className={`pattern-trend ${pattern.trend}`}>
                {pattern.trend === 'up' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </div>
              <div className="pattern-content">
                <h4 className="pattern-title">{pattern.title}</h4>
                <p className="pattern-desc">{pattern.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
