# Servinly

A professional networking and recruitment platform built for hospitality workers.

## 🚀 Overview
Servinly flips the traditional employer-first hiring model on its head, empowering workers to build their reputations, grow their networks, and discover job opportunities tailored to their skills and goals.

## 🧠 Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **AI Services:** OpenAI (GPT-4 Turbo)
- **Location Search:** GeoNames API
- **Deployment:** Vercel

## 📦 Features (MVP Phase 1)
- ✅ Secure auth (Supabase)
- ✅ Onboarding flow with profile + skills
- ✅ AI bio generation (coming)
- ✅ Location autocomplete (coming)
- ✅ Mobile-first responsive dashboard

## 🏗️ Project Structure
See `file-structure.txt` for full folder layout.

## 🔒 Environment Setup

Create a `.env.local` file from the example below:

```
OPENAI_API_KEY=sk-...
GEONAMES_USERNAME=your_geonames_username
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_key
```

## 📜 Scripts

```bash
npm run dev        # Start local dev server
npm run build      # Build production bundle
```

## 🤝 Contributing
Clone the repo, create a feature branch, and open a PR!

---

Made with ❤️ by Claudio & team
