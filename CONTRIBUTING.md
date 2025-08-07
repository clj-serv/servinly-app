# Contributing to Servinly

Welcome! 👋 Whether you're continuing the project, onboarding, or contributing code — this guide will help you get started and stay consistent.

---

## 🔧 Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/servinly-app.git
cd servinly-app

Install dependencies

bash
Copy
npm install
Environment Variables

Set up .env.local by copying from .env.example.

bash
Copy
cp .env.example .env.local
Add your Supabase & OpenAI credentials.

🧪 Running Tests
To run the test suite:

bash
Copy
npm run test
Make sure you’re not relying on external services like Supabase — these are mocked in __mocks__/@supabase.

If errors persist, check:

jest.config.ts → ensure transform settings and mocks are correct

babel.config.js → for JSX/TSX transformation

src/tests/setupTests.ts → for global test setup

📁 Code Structure
This app uses Atomic Design for components:

bash
Copy
components/ui/
  ├── atoms/
  ├── molecules/
  └── organisms/
Use this structure when adding or updating UI components.

🧼 Git & Commit Hygiene
Don’t commit .env.local or *.tsbuildinfo

Confirm .gitignore is up-to-date

Use clear, atomic commit messages (e.g., fix: resolve supabase mock error)

🤖 Handover for ChatGPT
To continue work in a new ChatGPT thread:

Paste the latest README.md and CONTRIBUTING.md

Paste your updated folder structure:

bash
Copy
tree -a -I 'node_modules|.git|.next|dist' > full-file-structure.txt
Copy key config files (jest.config.ts, babel.config.js, etc.)

Describe the last completed task and current blocker.

🙌 Thanks for Contributing!
Questions? Reach out to Claudio Lopes — Brisbane-based, remote-first, building Servinly with ❤️.

yaml
Copy

---

4. **Save the file**, then commit it to Git:

```bash
git add CONTRIBUTING.md
git commit -m "Add CONTRIBUTING.md for onboarding and collaboration"
Let me know if you'd also like:


