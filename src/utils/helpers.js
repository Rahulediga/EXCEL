export function formatWeight(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`;
  return `${kg.toFixed(1)} kg`;
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function getFillColor(level) {
  if (level >= 80) return 'var(--eco-danger)';
  if (level >= 50) return 'var(--eco-warning)';
  return 'var(--eco-success)';
}

export function getFillClass(level) {
  if (level >= 80) return 'danger';
  if (level >= 50) return 'warning';
  return '';
}

export function getSeverityColor(severity) {
  switch (severity) {
    case 'critical': return 'var(--eco-danger)';
    case 'warning': return 'var(--eco-warning)';
    case 'info': return 'var(--eco-info)';
    default: return 'var(--text-tertiary)';
  }
}

export function getPriorityBadge(priority) {
  switch (priority) {
    case 'high': return 'badge-danger';
    case 'medium': return 'badge-warning';
    case 'low': return 'badge-info';
    default: return 'badge-info';
  }
}

export function getCategoryColor(category) {
  switch (category?.toLowerCase()) {
    case 'wet': return 'var(--eco-wet)';
    case 'dry': return 'var(--eco-dry)';
    case 'metal': return 'var(--eco-metal)';
    default: return 'var(--text-secondary)';
  }
}

export function getTimeAgo(timestamp) {
  return timestamp; // Already formatted in mock data
}
