# YOUR GATI — State Innovation & Societal Challenge Ecosystem
> *"Your Problem. Our Universities. One GATI Forward."*

A digital platform designed for the **Smart India Hackathon 2026** to crowdsource societal challenges across Jharkhand and facilitate collaborative problem-solving through University research labs and Industry CSR partnerships.

---

## 🏛️ Ecosystem Overview

YOUR GATI connects 4 key stakeholders in a single database-driven workflow:

**Citizens → Government → Universities → Industry**

1. **Citizens**: Report real-world community challenges with photograph evidence and multimodal **Gemini 2.5 Flash Vision AI** analysis.
2. **Government Admin**: Validate reported challenges, monitor district telemetry, and route validated challenges to HEIs.
3. **Universities**: Accept routed challenges and create multidisciplinary Capstone Project teams under faculty mentorship.
4. **Industry Partners**: Browse university projects and pledge CSR support (Funding, Hardware, Mentorship, Pilot Deployment).

---

## ⚡ Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons + Poppins Typography
- **Geospatial Mapping**: Leaflet + OpenStreetMap
- **Multimodal AI**: `@google/genai` (Gemini 2.5 Flash Vision API)
- **Database & Auth**: Supabase (PostgreSQL + Row Level Security + Supabase Auth)

---

## 🗄️ Supabase Setup & Database Schema

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Go to the **SQL Editor** in your Supabase project.
3. Open `supabase_schema.sql` from this repository, copy the contents, and run the SQL script.
4. The schema automatically creates:
   - `profiles` table & auto-trigger for new auth users
   - `challenges` & `challenge_ai_analysis` tables
   - `projects`, `collaborations`, and `milestones` tables
   - Row Level Security (RLS) policies for Citizens, Government, Universities, and Industry.
5. Create a `.env.local` file in the root directory with your credentials:

```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## 🚀 How to Upload to GitHub

Follow these step-by-step commands to push this project to your GitHub account:

```bash
# 1. Initialize git repository
git init

# 2. Stage all project files
git add .

# 3. Create initial commit
git commit -m "Initial release: YOUR GATI Platform v1.0"

# 4. Rename main branch
git branch -M main

# 5. Link your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_GATI.git

# 6. Push to GitHub
git push -u origin main
```

---

## 💻 Local Development Setup

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Production build & verification
npm run build
```

---

## 📜 License & SIH 2026

Built for Smart India Hackathon 2026 — Problem Statement: Crowdsourcing societal challenges and facilitating collaborative problem-solving through university and industry partnerships.
