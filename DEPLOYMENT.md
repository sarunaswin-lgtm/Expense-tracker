# 🚀 WealthPulse 100% Free Production Deployment Guide

Follow this guide to deploy WealthPulse across industry-standard free tiers without spending a single dollar or rupee.

---

## 📋 Free Tier Providers Overview

1. **Database:** [Supabase](https://supabase.com) — Free Tier includes 500MB PostgreSQL database, unlimited API requests within tier, and automated backups.
2. **AI Intelligence:** [Google AI Studio](https://aistudio.google.com) — Free Tier includes generous RPM limits for `gemini-2.5-flash`.
3. **Backend API:** [Render](https://render.com) — Free Web Service tier (or Vercel Serverless Functions).
4. **Frontend UI:** [Vercel](https://vercel.com) — Free Hobby tier with unlimited automated CI/CD and global edge CDN.

---

## Step 1: Set Up Free Supabase Database

1. Go to [supabase.com](https://supabase.com/) and create a free account.
2. Click **New Project**, choose an organization, name your project `wealthpulse-db`, and set a strong database password.
3. Once the database provisions (takes ~1 minute), navigate to **SQL Editor** on the left navigation bar.
4. Click **New Query**, paste the contents of `database/schema.sql`, and click **Run**.
   - This creates the `profiles`, `transactions`, and `recurring_bills` tables, along with indexes and initial demo records.
5. Retrieve your project API credentials:
   - Go to **Project Settings** > **API**.
   - Copy **Project URL** (`https://xyzcompany.supabase.co`).
   - Copy the **anon / public** API key.

---

## Step 2: Get Free Google Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** > **Create API key in new project**.
4. Copy the generated key. (Free tier includes rate limits for `gemini-2.5-flash`).

---

## Step 3: Deploy Backend on Render (100% Free)

1. Push your code to a GitHub repository.
2. Go to [render.com](https://render.com/) and create a free account.
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Configure the service settings:
   - **Name:** `wealthpulse-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Instance Type:** `Free`
6. Add the following **Environment Variables** in the Render dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `GEMINI_API_KEY`: *(Your Google AI Studio API key)*
   - `SUPABASE_URL`: *(Your Supabase Project URL)*
   - `SUPABASE_ANON_KEY`: *(Your Supabase Anon Key)*
   - `CLIENT_URL`: *(Will update with frontend URL once Vercel is deployed)*
7. Click **Create Web Service**. Once deployed, copy your service URL (e.g. `https://wealthpulse-backend.onrender.com`).

---

## Step 4: Deploy Frontend on Vercel (100% Free)

1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** > **Project** and import your GitHub repository.
3. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and select `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://wealthpulse-backend.onrender.com` *(Replace with your Render backend URL)*
5. Click **Deploy**. In under 60 seconds, your site will be live with a free `*.vercel.app` URL and SSL certificate!
6. *(Optional)* Return to your Render backend environment variables and set `CLIENT_URL` to your new Vercel URL for CORS protection.

---

## 🔒 Security Best Practices
- Never commit actual `.env` files with secret keys to public git repositories.
- `backend/.env.example` is provided as a template.
- Supabase Row Level Security (RLS) is enabled in `database/schema.sql` for enterprise-grade data isolation.
