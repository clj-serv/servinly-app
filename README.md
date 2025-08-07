# Servinly App

Servinly is a Next.js + Supabase + TailwindCSS + OpenAI-powered web application. This README documents the project setup, local development instructions, testing integration, and tips for developer handover continuity using ChatGPT.

---

## 📁 Project Structure

```bash
tree -a -I 'node_modules|.git|.next|dist'

├── __mocks__/
│   └── @supabase/supabase-js.ts
├── .env.example
├── .env.local
├── jest.config.ts
├── babel.config.js
├── tsconfig.json
├── tsconfig.test.json
├── src/
│   ├── app/
│   ├── components/ui/
│   ├── hooks/
│   ├── lib/
│   ├── tests/
│   │   └── HomePage.test.tsx
│   └── types/
├── public/
├── servinly-docs/
├── supabase/schema.sql
├── full-file-structure.txt

Getting Started
1. Install dependencies
bash
Copy
npm install
2. Environment Variables
Copy .env.example to .env.local and fill in:

env
Copy
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
These are required for Supabase and OpenAI API integrations.

🧪 Testing Setup
1. Dependencies
The project uses Jest + React Testing Library + JSDOM.

Install (if not yet):

bash
Copy
npm install --save-dev jest @types/jest babel-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
2. Mocking Supabase
We mock Supabase to avoid external calls during unit tests. See:

ts
Copy
__mocks__/@supabase/supabase-js.ts
Make sure all Supabase imports use this path (to ensure mocking):

ts
Copy
import { supabase } from '@/lib/supabaseClient';
📦 Project Testing
To run tests:

bash
Copy
npm run test
Troubleshooting?

Ensure jest.config.ts is present and uses "babel-jest" for transformation.

Confirm "moduleNameMapper" mocks Supabase as shown in config.

💡 ChatGPT Handover Instructions
To continue this project in a new ChatGPT thread:

Paste the full README.md content (this file).

Paste the output of:

bash
Copy
tree -a -I 'node_modules|.git|.next|dist' > full-file-structure.txt
Optionally paste:

jest.config.ts

babel.config.js

HomePage.test.tsx or relevant source files

Describe your goal or current bug.

✅ To Do
 Improve test coverage

 Refactor components using Atomic Design in /components/ui/

 Add CI pipeline with GitHub Actions

👤 Maintainer
Claudio Lopes
Brisbane, QLD | Working remotely in Tech
Created with ❤️ and ambition

yaml
Copy

---

### ✅ Next Steps
1. Save this as your `README.md` at the root of your project.
2. Commit:

```bash
git add README.md
git commit -m "Add project README with setup and handover instructions"

tree -a -I 'node_modules|.git|.next|dist' > full-file-structure.txt
