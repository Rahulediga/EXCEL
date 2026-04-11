"""
Seed Firebase Realtime Database with 21 days of historical waste data.
Run once: python seed_history.py
"""

import firebase_admin
from firebase_admin import credentials, db
import json
import os

# Initialize Firebase Admin
cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://devoops-fc055-default-rtdb.firebaseio.com"
})

history_data = {
    "day1":  {"timestamp": "2026-03-01", "wet": 2.1, "dry": 1.8, "metal": 0.9, "total": 4.8},
    "day2":  {"timestamp": "2026-03-02", "wet": 2.3, "dry": 1.9, "metal": 1.0, "total": 5.2},
    "day3":  {"timestamp": "2026-03-03", "wet": 2.5, "dry": 2.0, "metal": 1.1, "total": 5.6},
    "day4":  {"timestamp": "2026-03-04", "wet": 2.2, "dry": 1.7, "metal": 0.8, "total": 4.7},
    "day5":  {"timestamp": "2026-03-05", "wet": 2.6, "dry": 2.1, "metal": 1.2, "total": 5.9},
    "day6":  {"timestamp": "2026-03-06", "wet": 3.0, "dry": 2.3, "metal": 1.3, "total": 6.6},
    "day7":  {"timestamp": "2026-03-07", "wet": 3.2, "dry": 2.5, "metal": 1.4, "total": 7.1},
    "day8":  {"timestamp": "2026-03-08", "wet": 2.4, "dry": 2.0, "metal": 1.0, "total": 5.4},
    "day9":  {"timestamp": "2026-03-09", "wet": 2.5, "dry": 2.1, "metal": 1.1, "total": 5.7},
    "day10": {"timestamp": "2026-03-10", "wet": 2.7, "dry": 2.2, "metal": 1.2, "total": 6.1},
    "day11": {"timestamp": "2026-03-11", "wet": 2.3, "dry": 1.9, "metal": 0.9, "total": 5.1},
    "day12": {"timestamp": "2026-03-12", "wet": 2.8, "dry": 2.3, "metal": 1.3, "total": 6.4},
    "day13": {"timestamp": "2026-03-13", "wet": 3.1, "dry": 2.4, "metal": 1.4, "total": 6.9},
    "day14": {"timestamp": "2026-03-14", "wet": 3.3, "dry": 2.6, "metal": 1.5, "total": 7.4},
    "day15": {"timestamp": "2026-03-15", "wet": 2.6, "dry": 2.1, "metal": 1.1, "total": 5.8},
    "day16": {"timestamp": "2026-03-16", "wet": 2.7, "dry": 2.2, "metal": 1.2, "total": 6.1},
    "day17": {"timestamp": "2026-03-17", "wet": 2.9, "dry": 2.3, "metal": 1.3, "total": 6.5},
    "day18": {"timestamp": "2026-03-18", "wet": 2.5, "dry": 2.0, "metal": 1.0, "total": 5.5},
    "day19": {"timestamp": "2026-03-19", "wet": 3.0, "dry": 2.4, "metal": 1.4, "total": 6.8},
    "day20": {"timestamp": "2026-03-20", "wet": 3.2, "dry": 2.5, "metal": 1.5, "total": 7.2},
    "day21": {"timestamp": "2026-03-21", "wet": 3.4, "dry": 2.7, "metal": 1.6, "total": 7.7},
}

def seed():
    print("[SEED] Seeding wasteData/history to Firebase...")
    ref = db.reference("wasteData/history")
    ref.set(history_data)
    print("[OK] 21 days of historical data uploaded successfully!")

if __name__ == "__main__":
    seed()
