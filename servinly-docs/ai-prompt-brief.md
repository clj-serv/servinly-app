# AI Prompt Brief – Servinly

## 🧠 Business Idea Summary
Servinly is a professional networking and job platform designed specifically for hospitality workers. It enables workers to build AI-assisted profiles, connect with others, receive peer and customer feedback, and find better jobs—while businesses get access to a validated talent pool and modern workforce management tools.

## 🎯 Core Features
- AI-generated professional bios and skill suggestions
- Customer QR code reviews and tipping
- Peer-to-peer referrals and endorsements
- Business profile claiming and management
- Worker-first onboarding and discovery experience

## 🧱 Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (Auth + Postgres + RLS)
- **Deployment:** Vercel
- **AI:** OpenAI API (GPT-4-turbo)
- **Location Services:** GeoNames API

## 🔐 Auth Strategy
- Supabase Auth (email + role-based access)
- Row-Level Security enabled on all sensitive tables
- Onboarding flow tracked per user

## 📁 File Structure
See `file-structure.txt` for detailed overview.

## ⚠️ Known Constraints
- First user experience is critical (onboarding is central)
- Must be mobile-friendly and fast
- AI features should be inexpensive to run (~$0.002/generation)

## 🧩 You Are...
For this project, act as:
- Full-stack developer using Next.js and Supabase
- Prompt engineer integrating OpenAI API
- DevOps support for scalable AI endpoints
