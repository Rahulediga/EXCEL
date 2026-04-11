// ==============================
// EcoWaste — Mock Data
// ==============================

export const wasteComposition = {
  wet: { value: 42, weight: 12.6, label: 'Wet Waste', color: '#10b981' },
  dry: { value: 35, weight: 10.5, label: 'Dry Waste', color: '#3b82f6' },
  metal: { value: 23, weight: 6.9, label: 'Metal Waste', color: '#f59e0b' },
};

export const weeklyTrend = [
  { day: 'Mon', wet: 4.2, dry: 3.1, metal: 1.8, total: 9.1 },
  { day: 'Tue', wet: 5.1, dry: 3.8, metal: 2.3, total: 11.2 },
  { day: 'Wed', wet: 3.8, dry: 4.2, metal: 1.5, total: 9.5 },
  { day: 'Thu', wet: 6.2, dry: 3.5, metal: 2.8, total: 12.5 },
  { day: 'Fri', wet: 5.5, dry: 4.8, metal: 2.1, total: 12.4 },
  { day: 'Sat', wet: 4.8, dry: 3.2, metal: 1.9, total: 9.9 },
  { day: 'Sun', wet: 3.5, dry: 2.8, metal: 1.2, total: 7.5 },
];

export const monthlyTrend = [
  { week: 'Week 1', wet: 28.5, dry: 22.1, metal: 13.2, total: 63.8 },
  { week: 'Week 2', wet: 31.2, dry: 24.8, metal: 14.5, total: 70.5 },
  { week: 'Week 3', wet: 26.8, dry: 23.5, metal: 11.8, total: 62.1 },
  { week: 'Week 4', wet: 33.1, dry: 25.2, metal: 15.9, total: 74.2 },
];

export const bins = [
  { id: 'BIN-001', name: 'Block A - Entrance', location: 'Building A, Ground Floor', fillLevel: 78, category: 'Mixed', battery: 92, status: 'online', lastEmptied: '2 hours ago', temperature: 28, humidity: 65, totalCollected: 45.2, breakdown: { wet: 20.0, dry: 15.2, metal: 10.0 } },
  { id: 'BIN-002', name: 'Block B - Cafeteria', location: 'Building B, Floor 1', fillLevel: 95, category: 'Wet', battery: 45, status: 'alert', lastEmptied: '6 hours ago', temperature: 31, humidity: 72, totalCollected: 62.8, breakdown: { wet: 58.0, dry: 3.5, metal: 1.3 } },
  { id: 'BIN-003', name: 'Block C - Lab Wing', location: 'Building C, Floor 2', fillLevel: 34, category: 'Dry', battery: 88, status: 'online', lastEmptied: '1 hour ago', temperature: 25, humidity: 55, totalCollected: 28.5, breakdown: { wet: 2.1, dry: 25.0, metal: 1.4 } },
  { id: 'BIN-004', name: 'Block D - Workshop', location: 'Building D, Ground Floor', fillLevel: 62, category: 'Metal', battery: 71, status: 'online', lastEmptied: '4 hours ago', temperature: 30, humidity: 48, totalCollected: 38.1, breakdown: { wet: 1.5, dry: 3.6, metal: 33.0 } },
  { id: 'BIN-005', name: 'Parking Area', location: 'Outdoor, Zone P', fillLevel: 15, category: 'Mixed', battery: 95, status: 'online', lastEmptied: '30 mins ago', temperature: 33, humidity: 58, totalCollected: 12.3, breakdown: { wet: 5.2, dry: 4.8, metal: 2.3 } },
  { id: 'BIN-006', name: 'Garden Side', location: 'Outdoor, Zone G', fillLevel: 88, category: 'Wet', battery: 22, status: 'alert', lastEmptied: '8 hours ago', temperature: 29, humidity: 78, totalCollected: 55.6, breakdown: { wet: 50.1, dry: 4.1, metal: 1.4 } },
  { id: 'BIN-007', name: 'Admin Block', location: 'Admin Building, Floor 1', fillLevel: 45, category: 'Dry', battery: 83, status: 'online', lastEmptied: '3 hours ago', temperature: 26, humidity: 52, totalCollected: 31.7, breakdown: { wet: 1.2, dry: 28.5, metal: 2.0 } },
  { id: 'BIN-008', name: 'Sports Complex', location: 'Sports Zone', fillLevel: 8, category: 'Mixed', battery: 98, status: 'offline', lastEmptied: '12 hours ago', temperature: 0, humidity: 0, totalCollected: 8.4, breakdown: { wet: 3.2, dry: 2.1, metal: 3.1 } },
];

export const alerts = [
  { id: 1, type: 'bin_full', severity: 'critical', title: 'Bin Almost Full', message: 'BIN-002 (Cafeteria) has reached 95% capacity. Immediate emptying required.', timestamp: '5 mins ago', acknowledged: false, bin: 'BIN-002' },
  { id: 2, type: 'bin_full', severity: 'critical', title: 'Bin Overflow Risk', message: 'BIN-006 (Garden Side) at 88% capacity and rising. Schedule pickup.', timestamp: '15 mins ago', acknowledged: false, bin: 'BIN-006' },
  { id: 3, type: 'battery_low', severity: 'warning', title: 'Low Battery', message: 'BIN-006 battery at 22%. Replacement needed within 24 hours.', timestamp: '1 hour ago', acknowledged: true, bin: 'BIN-006' },
  { id: 4, type: 'sensor_error', severity: 'warning', title: 'Sensor Malfunction', message: 'Temperature sensor on BIN-008 is not responding. Device may be offline.', timestamp: '2 hours ago', acknowledged: false, bin: 'BIN-008' },
  { id: 5, type: 'maintenance', severity: 'info', title: 'Scheduled Maintenance', message: 'BIN-001 is due for routine calibration in 2 days.', timestamp: '3 hours ago', acknowledged: true, bin: 'BIN-001' },
  { id: 6, type: 'collection', severity: 'info', title: 'Collection Complete', message: 'BIN-005 emptied successfully. Fill level reset to 0%.', timestamp: '30 mins ago', acknowledged: true, bin: 'BIN-005' },
  { id: 7, type: 'battery_low', severity: 'warning', title: 'Battery Warning', message: 'BIN-002 battery at 45%. Consider scheduling replacement.', timestamp: '4 hours ago', acknowledged: false, bin: 'BIN-002' },
  { id: 8, type: 'sensor_error', severity: 'critical', title: 'Connection Lost', message: 'BIN-008 has been offline for 12 hours. Check ESP32 connectivity.', timestamp: '12 hours ago', acknowledged: false, bin: 'BIN-008' },
];

export const recentActivity = [
  { id: 1, icon: 'recycle', text: 'Wet waste detected — 0.8 kg added to BIN-002', time: '2 mins ago', color: '#10b981' },
  { id: 2, icon: 'alert', text: 'BIN-006 fill level exceeded 85% threshold', time: '10 mins ago', color: '#ef4444' },
  { id: 3, icon: 'metal', text: 'Metal object classified — 0.3 kg to BIN-004', time: '15 mins ago', color: '#f59e0b' },
  { id: 4, icon: 'collection', text: 'BIN-005 emptied by Municipal Worker #12', time: '30 mins ago', color: '#3b82f6' },
  { id: 5, icon: 'sensor', text: 'BIN-003 load cell recalibrated successfully', time: '45 mins ago', color: '#8b5cf6' },
  { id: 6, icon: 'recycle', text: 'Dry waste classified — 1.2 kg to BIN-007', time: '1 hour ago', color: '#3b82f6' },
  { id: 7, icon: 'battery', text: 'BIN-001 battery charged to 92%', time: '1.5 hours ago', color: '#10b981' },
  { id: 8, icon: 'alert', text: 'BIN-002 temperature spike detected (31°C)', time: '2 hours ago', color: '#f59e0b' },
];

export const reports = [
  { id: 1, title: 'Daily Collection Report', period: 'April 6, 2026', type: 'daily', totalWaste: 30.0, wet: 12.6, dry: 10.5, metal: 6.9, efficiency: 87, bins: 8, collections: 12 },
  { id: 2, title: 'Weekly Summary Report', period: 'Mar 31 – Apr 6, 2026', type: 'weekly', totalWaste: 72.1, wet: 32.1, dry: 25.4, metal: 14.6, efficiency: 91, bins: 8, collections: 42 },
  { id: 3, title: 'Monthly Overview', period: 'March 2026', type: 'monthly', totalWaste: 270.6, wet: 119.6, dry: 95.6, metal: 55.4, efficiency: 89, bins: 8, collections: 168 },
  { id: 4, title: 'Daily Collection Report', period: 'April 5, 2026', type: 'daily', totalWaste: 28.4, wet: 11.8, dry: 10.2, metal: 6.4, efficiency: 85, bins: 8, collections: 11 },
  { id: 5, title: 'Weekly Summary Report', period: 'Mar 24 – 30, 2026', type: 'weekly', totalWaste: 68.5, wet: 29.8, dry: 24.2, metal: 14.5, efficiency: 88, bins: 8, collections: 39 },
];

export const predictions = {
  tomorrow: { total: 5.2, wet: 2.1, dry: 1.8, metal: 1.3, confidence: 89 },
  weekForecast: [
    { day: 'Mon', predicted: 5.2, actual: null },
    { day: 'Tue', predicted: 6.1, actual: null },
    { day: 'Wed', predicted: 4.8, actual: null },
    { day: 'Thu', predicted: 7.0, actual: null },
    { day: 'Fri', predicted: 6.5, actual: null },
    { day: 'Sat', predicted: 5.0, actual: null },
    { day: 'Sun', predicted: 3.8, actual: null },
  ],
  monthlyPrediction: [
    { week: 'This Week', predicted: 38.4, previousActual: 35.8 },
    { week: 'Next Week', predicted: 41.2, previousActual: 38.5 },
    { week: 'Week 3', predicted: 36.8, previousActual: 34.2 },
    { week: 'Week 4', predicted: 42.5, previousActual: 40.1 },
  ],
};

export const recommendations = [
  { id: 1, priority: 'high', category: 'wet', title: 'Composting Recommended', message: 'Wet waste generation is 20% above average. Consider setting up an on-site composting unit to reduce landfill dependency.', icon: 'sprout', impact: 'Reduce wet waste disposal by 35%' },
  { id: 2, priority: 'high', category: 'dry', title: 'Increase Dry Waste Recycling', message: 'Dry waste recycling rate is at 62%. Target 80% by partnering with local recycling centers for paper and plastic collection.', icon: 'recycle', impact: 'Save ₹2,400/month on disposal' },
  { id: 3, priority: 'medium', category: 'metal', title: 'Metal Waste Trending Up', message: 'Metal waste increased 20% this week. Schedule additional metal pickups on Tuesdays and Fridays.', icon: 'trending', impact: 'Optimize collection by 15%' },
  { id: 4, priority: 'medium', category: 'general', title: 'Peak Hours Optimization', message: 'Peak waste generation occurs between 12 PM – 2 PM. Deploy extra bins during lunch hours to prevent overflow.', icon: 'clock', impact: 'Reduce overflow incidents by 40%' },
  { id: 5, priority: 'low', category: 'general', title: 'Bin Placement Optimization', message: 'BIN-008 (Sports Complex) consistently has low fill levels. Consider relocating to higher-traffic area.', icon: 'map', impact: 'Improve bin utilization by 25%' },
];

export const patterns = [
  { id: 1, title: 'Peak Waste Days', description: 'Tuesdays and Fridays consistently show 25-30% higher waste generation.', trend: 'up' },
  { id: 2, title: 'Metal Waste Spike', description: 'Metal waste increased 20% compared to last week. Workshop activities may be the cause.', trend: 'up' },
  { id: 3, title: 'Weekend Drop-off', description: 'Weekends show 35% less waste. Consider reducing weekend collection frequency.', trend: 'down' },
  { id: 4, title: 'Seasonal Wet Waste Rise', description: 'Wet waste tends to increase during monsoon season due to garden debris.', trend: 'up' },
];

export const analyticsDaily = [
  { date: 'Apr 1', wet: 11.2, dry: 9.8, metal: 6.1 },
  { date: 'Apr 2', wet: 12.5, dry: 10.2, metal: 6.5 },
  { date: 'Apr 3', wet: 10.8, dry: 11.5, metal: 5.8 },
  { date: 'Apr 4', wet: 13.1, dry: 9.5, metal: 7.2 },
  { date: 'Apr 5', wet: 11.8, dry: 10.2, metal: 6.4 },
  { date: 'Apr 6', wet: 12.6, dry: 10.5, metal: 6.9 },
];

export const collectionEfficiency = [
  { date: 'Apr 1', collected: 85, capacity: 100 },
  { date: 'Apr 2', collected: 92, capacity: 100 },
  { date: 'Apr 3', collected: 78, capacity: 100 },
  { date: 'Apr 4', collected: 95, capacity: 100 },
  { date: 'Apr 5', collected: 88, capacity: 100 },
  { date: 'Apr 6', collected: 87, capacity: 100 },
];

export const dashboardStats = {
  totalWasteToday: { value: 30.0, unit: 'kg', change: 5.2, label: 'Total Waste Today' },
  activeBins: { value: 7, unit: '/ 8', change: 0, label: 'Active Bins' },
  alertsCount: { value: 4, unit: 'active', change: -2, label: 'Active Alerts' },
  recyclingRate: { value: 73, unit: '%', change: 3.1, label: 'Recycling Rate' },
};
