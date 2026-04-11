import { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../utils/firebase';

const DatabaseContext = createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

// All top-level keys we want to listen to
const DATA_KEYS = [
  'wasteComposition',
  'weeklyTrend',
  'monthlyTrend',
  'bins',
  'alerts',
  'recentActivity',
  'reports',
  'predictions',
  'recommendations',
  'patterns',
  'analyticsDaily',
  'collectionEfficiency',
  'dashboardStats',
];

export function DatabaseProvider({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribes = [];
    let received = 0;

    DATA_KEYS.forEach((key) => {
      const dbRef = ref(db, key);
      const unsub = onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        setData((prev) => ({ ...prev, [key]: val }));
        received++;
        // Once we've received at least one snapshot for every key, stop loading
        if (received >= DATA_KEYS.length) {
          setLoading(false);
        }
      });
      unsubscribes.push(unsub);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  const value = { ...data, loading };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}
