"""
EcoWaste ML Prediction Backend
FastAPI + Exponential Smoothing (Holt-Winters) + Firebase Realtime Database
"""

import os
import json
import logging
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import firebase_admin
from firebase_admin import credentials, db

# -- Logging ---------------------------------------------------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("ecowaste-ml")

# -- Firebase Init ----------------------------------------------------------
# Support both local file and Render environment variable
firebase_creds_json = os.environ.get("FIREBASE_CREDENTIALS")

if firebase_creds_json:
    # Running on Render: credentials come from environment variable
    cred_dict = json.loads(firebase_creds_json)
    cred = credentials.Certificate(cred_dict)
    logger.info("[FIREBASE] Using credentials from environment variable")
else:
    # Running locally: credentials come from file
    cred_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
    cred = credentials.Certificate(cred_path)
    logger.info("[FIREBASE] Using credentials from local file")

firebase_admin.initialize_app(cred, {
    "databaseURL": os.environ.get("FIREBASE_DB_URL", "https://devoops-fc055-default-rtdb.firebaseio.com")
})
logger.info("[FIREBASE] Admin SDK initialized")

# -- FastAPI App ------------------------------------------------------------
app = FastAPI(
    title="EcoWaste ML Prediction API",
    description="Time-series waste forecasting powered by Holt-Winters Exponential Smoothing",
    version="1.0.0",
)

# Allow all origins in production (Render frontend URL will be set via env var)
raw_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -- Helpers ----------------------------------------------------------------

def fetch_history() -> pd.DataFrame:
    """Fetch historical waste data from Firebase and return as DataFrame."""
    ref = db.reference("wasteData/history")
    raw = ref.get()

    if not raw:
        raise HTTPException(status_code=404, detail="No historical data found in Firebase")

    records = []
    for key, val in raw.items():
        records.append({
            "ds": pd.to_datetime(val["timestamp"]),
            "y": float(val["total"]),
            "wet": float(val["wet"]),
            "dry": float(val["dry"]),
            "metal": float(val["metal"]),
        })

    df = pd.DataFrame(records).sort_values("ds").reset_index(drop=True)
    logger.info(f"[DATA] Fetched {len(df)} records (range: {df['ds'].min().date()} -> {df['ds'].max().date()})")
    return df


def compute_ratios(df: pd.DataFrame) -> dict:
    """Compute average waste-type ratios from historical data."""
    total_wet = df["wet"].sum()
    total_dry = df["dry"].sum()
    total_metal = df["metal"].sum()
    grand_total = total_wet + total_dry + total_metal

    return {
        "wet": round(total_wet / grand_total, 4),
        "dry": round(total_dry / grand_total, 4),
        "metal": round(total_metal / grand_total, 4),
    }


def train_and_predict(df: pd.DataFrame, periods: int = 7):
    """
    Train Holt-Winters Exponential Smoothing model and forecast.
    Uses additive trend with a weekly seasonal period (7 days).
    """
    ts = df.set_index("ds")["y"].asfreq("D")

    # Fill any missing values via interpolation
    ts = ts.interpolate(method="linear").bfill().ffill()

    # Fit Holt-Winters model  (seasonal_periods=7 for weekly cycle)
    model = ExponentialSmoothing(
        ts,
        trend="add",
        seasonal="add",
        seasonal_periods=7,
    ).fit(optimized=True)

    logger.info("[MODEL] Holt-Winters model trained successfully")

    forecast = model.forecast(periods)
    return forecast, model


# -- API Endpoints ----------------------------------------------------------

@app.get("/")
def root():
    return {"status": "online", "service": "EcoWaste ML Prediction API", "version": "1.0.0"}


@app.get("/predict")
def predict():
    """
    Generate waste predictions using Holt-Winters Exponential Smoothing.
    Returns tomorrow's forecast, 7-day outlook, breakdown by waste type,
    and a confidence score.
    """
    try:
        # 1. Fetch & prepare data
        df = fetch_history()
        ratios = compute_ratios(df)

        # 2. Train model & predict 7 days
        forecast_series, model = train_and_predict(df, periods=7)

        # 3. Tomorrow's prediction
        tomorrow_total = round(max(float(forecast_series.iloc[0]), 0), 1)

        breakdown = {
            "wet": round(tomorrow_total * ratios["wet"], 1),
            "dry": round(tomorrow_total * ratios["dry"], 1),
            "metal": round(tomorrow_total * ratios["metal"], 1),
        }

        # 4. 7-day forecast
        week_forecast = []
        for date_idx, val in forecast_series.items():
            clamped = round(max(float(val), 0), 1)
            week_forecast.append({
                "date": date_idx.strftime("%Y-%m-%d"),
                "value": clamped,
            })

        # 5. Confidence score
        #    Based on residual standard error relative to mean prediction
        residuals = model.resid
        rmse = float(np.sqrt((residuals ** 2).mean()))
        mean_val = float(df["y"].mean())
        confidence = round(max(0, min(100, 100 - (rmse / mean_val * 100))), 0)

        # 6. Monthly comparison (weekly aggregation)
        last_week_actual = round(float(df["y"].tail(7).sum()), 1)
        predicted_week_sum = round(sum(d["value"] for d in week_forecast), 1)
        monthly_comparison = [
            {
                "week": "Next Week",
                "predicted": predicted_week_sum,
                "previousActual": last_week_actual,
            }
        ]

        result = {
            "tomorrow": tomorrow_total,
            "breakdown": breakdown,
            "weekForecast": week_forecast,
            "confidence": int(confidence),
            "monthlyComparison": monthly_comparison,
            "ratios": ratios,
            "trainedOn": len(df),
            "lastDataDate": df["ds"].max().strftime("%Y-%m-%d"),
        }

        logger.info(f"[OK] Prediction complete - Tomorrow: {tomorrow_total} kg, Confidence: {confidence}%")
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[ERROR] Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}
