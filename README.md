# EcoWaste IoT Dashboard

![EcoWaste Banner](https://img.shields.io/badge/EcoWaste-IoT%20Dashboard-10b981?style=for-the-badge)

**EcoWaste** is a comprehensive, intelligent IoT dashboard designed to monitor and manage waste efficiently. By integrating real-time hardware data, machine learning predictions, and an automated alert system, EcoWaste provides a complete solution for modern, eco-friendly waste management.

---

## 🌟 Key Features

- **📊 Real-time Bin Monitoring:** View the live status of waste bins, categorizing waste into Wet, Dry, and Metal.
- **🧠 AI-Driven Insights (Machine Learning):** Uses a Python-based FastAPI backend with Holt-Winters Exponential Smoothing to predict future waste generation based on historical trends.
- **🚨 Automated Alert System:** Instantly notifies administrators via email when bins reach critical capacity, ensuring timely waste collection.
- **📄 Comprehensive Reporting:** Generate, download, and email detailed PDF reports summarizing waste collection and system analytics.
- **🎨 Premium UI/UX:** Features a sleek, responsive interface with a glassmorphism design, supporting both Light and Dark modes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React + Vite
- **Styling:** Vanilla CSS with Glassmorphism and CSS Variables
- **Icons & Charts:** Lucide-React, Recharts
- **PDF Generation:** jsPDF, jsPDF-AutoTable

### Backend Services
- **ML Prediction API:** Python, FastAPI, Statsmodels, Pandas
- **Email Notification Service:** Node.js, Express, Nodemailer
- **Database & Auth:** Firebase (Realtime Database & Authentication), Supabase (Auth)

---

## 🚀 Getting Started

To run the EcoWaste project locally, you need to start three separate components: the React Frontend, the Node.js Email Service, and the Python ML API.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.9 or higher)
- A Firebase Project with Realtime Database enabled
- An SMTP email account (e.g., Gmail) for notifications

---

### 1. Frontend Setup (React + Vite)

The frontend is the main user interface for the dashboard.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

### 2. Email Service Setup (Node.js)

The email service handles sending critical alerts and PDF reports.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install Node.js dependencies
npm install

# 3. Start the email server
npm start
```
The email service will run on `http://localhost:3001`. 
*(Note: You will need to configure your SMTP credentials in `backend/email-server.js` or via environment variables).*

---

### 3. ML Prediction API Setup (Python FastAPI)

The Python backend fetches historical data from Firebase and trains a machine learning model to predict future waste trends.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Add Firebase Credentials
# Place your Firebase Admin SDK JSON file as `serviceAccountKey.json` inside the `backend/` folder.

# 6. Start the FastAPI server
python -m uvicorn main:app --reload
```
The ML API will run on `http://127.0.0.1:8000`.

---

## ⚙️ Environment Variables

For the services to run correctly in a production or fully-configured local environment, ensure the following are set up:
- **Frontend:** Firebase config variables for client-side authentication and database access.
- **Email Service:** `EMAIL_USER` and `EMAIL_PASS` (App Password) for Nodemailer.
- **Python ML API:** `FIREBASE_CREDENTIALS` (or a local `serviceAccountKey.json`) and `FIREBASE_DB_URL`.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page to see how you can help improve EcoWaste.

## 📝 License
This project is licensed under the MIT License.
