# 🎮 E-SPORTS BANGLADESH (ESBD) — 3D Tournament & Esports Platform

The premier online & offline gaming tournament hosting platform for Bangladesh. Powered by **React, Three.js 3D Arena Core, Supabase PostgreSQL, Node.js Serverless API**, and ready for **1-click Vercel Deployment via GitHub**.

---

## 🌟 Features

- 🌐 **3D Cyber Experience**:
  - Interactive Three.js 3D Arena Core hero mesh with gyroscope and cursor tracking.
  - Ambient 3D particle grid and depth effects (Electric Emerald & Cyber Crimson).
  - Physics-based 3D Card Tilt on tournament rosters, match cards, and creator tiles.
  - Dynamic mouse specular spotlight and esports broadcast scanlines.
- 🏆 **Complete Tournament Management**:
  - Supported games: Free Fire, PUBG Mobile, Valorant, CS2, eFootball, MLBB, Honor of Kings, CoD Mobile.
  - Bracket progression engine, live scores, room code delivery, and anti-cheat verification.
  - Player check-in, registration, and withdrawal.
- 🛡️ **Player Portal**:
  - Match schedule, live room credentials, and score reporting with screenshot proofs.
  - bKash & Nagad instant wallet top-up and prize payout history.
  - Real-time tournament notifications and clan/team management.
- ⚡ **Admin Console**:
  - Automated bracket generator.
  - Match verification and dispute resolution triage.
  - Tournament status switcher (`registration_open`, `live`, `completed`).
- 🗄️ **Supabase Backend**:
  - Full PostgreSQL schema with Row Level Security (RLS).
  - Zero-downtime dual mode: operates out of the box with embedded seed data and automatically connects to live Supabase Postgres upon setting environment keys.

---

## 🚀 Quick Start (Run Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Local Server
```bash
npm run dev
```
Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 🗄️ Supabase Backend Setup

To connect your own live Supabase PostgreSQL database:

1. Go to [https://supabase.com](https://supabase.com) and create a new project.
2. In your Supabase project dashboard, navigate to **SQL Editor** on the left menu.
3. Open [`supabase_schema.sql`](./supabase_schema.sql) in this repository, copy the full contents, paste them into the Supabase SQL Editor, and click **Run**.
   - *This creates all 20 tables, indexes, constraints, and pre-populates verified Bangladesh esports games, clients, influencers, staff, and tournaments.*
4. Go to **Project Settings** -> **API** and copy:
   - **Project URL**
   - **anon public key**
   - **service_role key** (secret)
5. Create a `.env` file in your project root (copy from [`.env.example`](./.env.example)):
   ```env
   PORT=3000
   JWT_SECRET=your-secret-jwt-key
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 🚢 Deploy to Vercel via GitHub

### Step 1: Initialize Git and Push to GitHub
Open your terminal in this directory and run:
```bash
git init
git add .
git commit -m "feat: complete E-Sports BD 3D platform with Supabase and Vercel support"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [https://vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your imported GitHub repository.
3. Under **Environment Variables**, add:
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `JWT_SECRET`: Any random secure string (e.g. `esbd-bangladesh-production-2026`)
4. Click **Deploy**.
   - Vercel will automatically configure the static SPA frontend and the serverless functions in `/api` via [`vercel.json`](./vercel.json).

---

## 🔑 Demo & Admin Credentials

| Role | Identifier / Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@esportsbd.com` (or `ESBD_Admin`) | `admin123` | Full Admin Console (`/admin`), Bracket Generator, Dispute Solver |
| **Player** | `vampire@redx.gg` (or `RedX_Vampire`) | `player123` | Player Portal (`/portal`), Matches, bKash Wallet, Teams |

*(You can also register any new account instantly on the `/register` page!)*

---

## 📁 Repository Structure

```
.
├── api/
│   └── index.js             # Full-Stack Serverless API Router (Auth, Tournaments, Wallet, Admin)
├── assets/
│   ├── ArenaCore-aAl-8thE.js # Three.js 3D Arena Core Component
│   ├── index-Bdt_ggT_.css   # Production Styling & Cyber Theme
│   └── index-DxaXhSva.js    # React Application Bundle
├── img/                     # Real Bangladesh Esports Assets (Games, Clients, Influencers, Team)
├── lib/
│   ├── seedData.js          # Fallback Bangladesh Esports Datasets
│   └── supabase.js          # Supabase Client & Connection Engine
├── .env.example             # Environment Variables Template
├── .gitignore               # Ignored files for Git
├── favicon.png              # High-DPI Logo Favicon
├── index.html               # 3D Enhanced HTML Entry Point (Particle Canvas & Tilt Engine)
├── package.json             # NPM dependencies and scripts
├── README.md                # Documentation & Setup Guide
├── server.js                # Local Express Dev Server with SPA Fallback
├── supabase_schema.sql      # 1-Click Supabase PostgreSQL Schema Script
└── vercel.json              # Vercel Serverless & SPA Rewrite Configuration
```

---

© E-SPORTS BANGLADESH (ESBD). All rights reserved.
