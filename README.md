# ⚡ WealthPulse — AI-Powered Expense & Impulse Waste Intelligence

WealthPulse is a full-stack, production-ready, and **100% FREE** personal finance web application that tracks your daily expenses, monitors fixed monthly commitments, isolates impulsive "waste" spending, and unleashes hard-hitting **AI Reality Checks** powered by **Google Gemini 2.5 Flash**.

---

## 🌟 Key Features

1. **Dashboard & Overview:**
   - Real-time Monthly Salary / Income tracker.
   - Total Spent vs Total Saved meters with daily burn pace indicator.
   - Remaining Safe-to-Spend Balance & "Days Left in the Month" counter.
   - Safe daily spending allowance calculation.

2. **The Signature "Waste Tag" & Leakage Radar:**
   - Every logged expense includes an optional toggle for **"Waste / Impulse Buying 💸"**.
   - Consciously isolates money leaks from midnight delivery cravings, impulse shopping carts, or reckless splurges.
   - Live visual radar highlighting waste percentage and discipline score.

3. **Google Gemini 2.5 Flash "Reality Check" & Coach Engine:**
   - Real-time roast and diagnosis based on your actual numbers.
   - Tone selector: **Savage Roast 🔥**, **Balanced Coach ⚖️**, or **Gentle Advisor 🌱**.
   - Calculates financial health score (0–100) and danger levels (CRITICAL, WARNING, MODERATE, HEALTHY).
   - Delivers 3 immediate actionable saving prescriptions.
   - Interactive chat: Ask *"Can I afford sneakers today?"* or *"How do I cut down on food deliveries?"*.

4. **Recurring Expenses & Fixed Commitments:**
   - Dedicated tracker for Rent, EMI, Index Fund SIPs, Broadband, and Subscriptions.
   - Auto-deduction calculations showing committed funds before discretionary spending starts.

5. **Visual Spending Intelligence:**
   - Category distribution Donut Chart (Food, Shopping, Travel, Bills, Investments, Entertainment, Health).
   - Essential vs Impulse Waste comparison Bar Chart.
   - Daily spending velocity Area Chart.

---

## 🏗️ 100% Free Architecture

| Layer | Technology | Free Tier Provider | Cost |
|---|---|---|---|
| **Database** | PostgreSQL | [Supabase Free Tier](https://supabase.com) (or Local Storage fallback) | **$0 / ₹0** |
| **AI Engine** | Gemini 2.5 Flash | [Google AI Studio](https://aistudio.google.com) Free API limits | **$0 / ₹0** |
| **Backend API** | Node.js / Express | [Render Free Tier](https://render.com) or Vercel Serverless | **$0 / ₹0** |
| **Frontend** | React + Vite + Tailwind | [Vercel Free Tier](https://vercel.com) | **$0 / ₹0** |

---

## 🚀 Quick Start (Local Setup in 2 Minutes)

WealthPulse is equipped with **zero-setup local file persistence fallback**, meaning you can clone and run it immediately even before entering cloud database credentials!

### 1. Start the Backend API
```bash
cd backend
npm install
npm start
```
The backend will launch at `http://localhost:5000` with sample realistic transactions preloaded.

### 2. Start the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Adding Your Free Gemini API Key
To enable live AI reality checks and the financial coach:
1. Get a 100% free Gemini API Key at [Google AI Studio](https://aistudio.google.com/).
2. Open `backend/.env` and paste your key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```
3. Restart the backend.

---

## ☁️ Production Deployment Guide
Read [`DEPLOYMENT.md`](./DEPLOYMENT.md) for step-by-step instructions on deploying the database to Supabase, the backend to Render/Vercel, and the frontend to Vercel without spending a single rupee.
"# Expense-tracker" 
"# Expense-tracker" 
