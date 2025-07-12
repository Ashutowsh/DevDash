# 🚀 DevDash – AI-Powered Developer Dashboard

DevDash is an AI-powered, GitHub-integrated developer dashboard designed to give engineering teams a centralized, intelligent view of their codebases. It enables deep code understanding, seamless team collaboration, and real-time insights — all in one modern, responsive interface.

## 🌐 Live Demo

Coming soon...

---

## 🧠 Why DevDash?

In modern development teams, understanding legacy codebases, tracking contributions, and navigating large repositories can be painful. DevDash combines **GitHub integration**, **AI reasoning**, and **visual insights** to bridge that gap — so your team can ship faster with confidence.

---

## 🔍 Core Features

### ✅ GitHub Integration
- Connect GitHub repositories securely
- Fetches:
  - Commit history
  - Contributors
  - Full source code (for AI indexing and Q&A)

### 🤖 AI-Powered Q&A Assistant
- Ask technical questions like:
  - “Where is the login logic?”
  - “What does the `useAuth` hook do?”
- Streamed, Markdown-rendered answers
- Includes:
  - Referenced file summaries
  - Related code file suggestions

### 📊 Commit Visualization
- Pie chart view of commits per author
- Helps identify contribution patterns and team activity

### 🛡️ Security Scan
- Repository scanning for:
  - Vulnerabilities
  - Severity analysis
- Visual indicators (e.g., charts, flags)

### 💳 Billing & Credit System (Billing is off for some time )
- **Credit-based system** (1 file indexed = 1 credit)
- Custom slider to buy more credits
- Real-time credit cost calculator
- Billing page integrated with payment gateway *(Razorpay)*

### 🧩 Multi-Project Support
- Create & manage multiple projects
- Sidebar switcher for seamless project context
- No page reloads or route changes — fully client-side state management

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/docs/app)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend Communication:** [tRPC](https://trpc.io/)
- **Auth:** [Clerk.dev](https://clerk.dev/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Validation:** [Zod](https://zod.dev/)
- **AI Q&A:** OpenAI / Gemini APIs *(Pluggable)*
- **State Management:** Global project context
- **Database:** PostgreSQL + Prisma
- **Charts:** Recharts or similar for pie visualizations

---

## 🧾 Getting Started

```bash
git clone https://github.com/Ashutowsh/DevDash.git
cd devdash
bun run dev
