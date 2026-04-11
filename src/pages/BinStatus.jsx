import { useState } from 'react';
import { Search, Filter, Trash2, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import BinCard from '../components/BinCard';
import { useDatabase } from '../context/DatabaseContext';
import './BinStatus.css';

export default function BinStatus() {
  const { bins, loading } = useDatabase();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  if (loading || !bins) {
    return (
      <div className="page">
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  const binList = Array.isArray(bins) ? bins : Object.values(bins);

  const filtered = binList.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(search.toLowerCase()) || bin.id.toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return bin.status === filter && matchesSearch;
  });

  const counts = {
    all: binList.length,
    online: binList.filter(b => b.status === 'online').length,
    alert: binList.filter(b => b.status === 'alert').length,
    offline: binList.filter(b => b.status === 'offline').length,
  };

  return (
    <div className="page">
      <div className="page-header animate-fade-in-up">
        <h1>Bin Status</h1>
        <p>Monitor and manage all smart waste bins</p>
      </div>

      {/* Status Overview */}
      <div className="bin-status-overview stagger-children">
        <div className="status-chip glass-card" onClick={() => setFilter('all')}>
          <Trash2 size={18} className="status-chip-icon" />
          <div>
            <p className="status-chip-count">{counts.all}</p>
            <p className="status-chip-label">Total Bins</p>
          </div>
        </div>
        <div className="status-chip glass-card online" onClick={() => setFilter('online')}>
          <Wifi size={18} className="status-chip-icon" />
          <div>
            <p className="status-chip-count">{counts.online}</p>
            <p className="status-chip-label">Online</p>
          </div>
        </div>
        <div className="status-chip glass-card alert" onClick={() => setFilter('alert')}>
          <AlertTriangle size={18} className="status-chip-icon" />
          <div>
            <p className="status-chip-count">{counts.alert}</p>
            <p className="status-chip-label">Alerts</p>
          </div>
        </div>
        <div className="status-chip glass-card offline" onClick={() => setFilter('offline')}>
          <WifiOff size={18} className="status-chip-icon" />
          <div>
            <p className="status-chip-count">{counts.offline}</p>
            <p className="status-chip-label">Offline</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bin-controls animate-fade-in-up">
        <div className="bin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search bins..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="bin-filter-group">
          {['all', 'online', 'alert', 'offline'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bins Grid */}
      <div className="bins-grid stagger-children">
        {filtered.map(bin => (
          <BinCard key={bin.id} bin={bin} />
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <Filter size={40} />
            <h3>No bins found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
