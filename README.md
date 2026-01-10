# CodeDiff AI

![CodeDiff AI Banner](https://placehold.co/1200x300/0a0a0a/ffffff?text=CodeDiff+AI:+Economic+Security+Engine)

<div align="center">

**The First Economic Security Engine for GitHub**  
*Translating Code Vulnerabilities into Financial Risk.*

[![Next.js 14](https://img.shields.io/badge/Next.js%2014-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-teal?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![NeonDB](https://img.shields.io/badge/Neon-Serverless%20Postgres-green?style=flat-square&logo=postgresql)](https://neon.tech/)
[![AI Orchestration](https://img.shields.io/badge/AI-Multi--Model-purple?style=flat-square&logo=openai)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 🏁 **Final Note to AlamedaHacks Judges**

### **The Bottom Line:**
**Every innovative feature in CodeDiff AI was built during this hackathon.**

### **What We Delivered in 40 Hours:**
```text
┌─────────────────────────────────────────────┐
│ 19 COMMITS OF PURE INNOVATION               │
├─────────────────────────────────────────────┤
│ ✅ Live Attack Simulation Engine            │
│ ✅ Deterministic PCI Auditor (Luhn Algorithm)│
│ ✅ Financial Risk Calculator ($10K-$5M)     │
│ ✅ Multi-AI Security Orchestrator           │
│ ✅ Compliance Dashboard with Real Charts    │
│ ✅ Production Deployment (vercel.app)       │
│ ✅ Complete Documentation                   │
└─────────────────────────────────────────────┘

## 🚀 The Problem vs. The Solution

### The Problem
Traditional tools (ESLint, SonarQube) speak "Developer." They flag null pointer exceptions and syntax errors. But in Fintech, a CEO or Chief Risk Officer doesn't care about a "missing semicolon" or "SQL Injection"—they care about a **$5M GDPR Fine**, **Regulatory Non-Compliance**, or **Fraud Liability**. There is a massive translation gap between *technical debt* and *financial risk*.

### The Solution
**CodeDiff AI** is the translation layer. It is an intelligent security pipeline that sits between your Payment Gateway and your Pull Requests. It orchestrates specific AI models to audit code, not just for bugs, but for **business logic flaws**. It then quantifies the exact financial liability of that code (e.g., "$1.2M potential fraud loss due to Race Condition") before it ever reaches production.

---

## ⚡ Key Features (The Secret Sauce)

CodeDiff AI isn't a wrapper around OpenAI. It is a complex **Multi-Model Orchestrator** designed for high-precision auditing.

### 🧠 Multi-Model AI Orchestrator
We don't trust one brain. We use a "Council of AIs" to review every line of code (see `lib/ai/orchestrator.ts`):

1.  **The Syntax Specialist (Groq & DeepSeek V3):**
    *   *Role:* Lightning-fast analysis of syntax, logic errors, and strict bug hunting.
    *   *Why:* Extremely low latency and high precision for code structures.
2.  **The Chief Risk Officer (Gemini 1.5 Pro):**
    *   *Role:* Contextual security analysis and financial impact estimation.
    *   *Why:* Massive context window allows it to read surrounding files and understand *why* a bug matters financially.
3.  **The Librarian (HuggingFace Zero-Shot):**
    *   *Role:* Intent classification.
    *   *Why:* Determines if a PR is a "Database Migration," "UI Tweak," or "Critical Auth Change."

### 💰 Financial Risk Quantification
CodeDiff AI assigns a dollar value to code quality.
*   **Regulatory Fines:** Automatically calculates potential GDPR/PCI-DSS fines based on data exposure types.
*   **Fraud Multipliers:** Applies industry-specific multipliers (e.g., 2.8x for Banking Race Conditions) to estimate liability.
*   **Visual Matrix:** Plots technical complexity against financial impact in real-time.

### 🧬 Self-Healing Infrastructure
The system includes a robust self-healing database layer (`prisma/schema.prisma`). If a GitHub App installation ID changes or a repository is moved, CodeDiff automatically updates strict relational links, ensuring audit trails never break.

---

## 🏗️ System Architecture

CodeDiff AI follows an event-driven, serverless architecture deployed on Vercel.

```mermaid
graph TD
    A[GitHub Webhook] -->|Push/PR Event| B(Next.js Edge API)
    B --> C{AI Orchestrator}
    
    subgraph "The Council of AIs"
        C -->|Intent Classify| D[HuggingFace]
        C -->|Bug Hunt| E[DeepSeek / Groq]
        C -->|Impact Analysis| F[Gemini 1.5 Pro]
    end
    
    D & E & F --> G[Synthesis Engine]
    G --> H[Risk Score Algorithm]
    
    H --> I[(Neon Serverless DB)]
    H --> J[GitHub PR Comment]
    H --> K[Next.js Dashboard]
```

**Tech Stack:**
*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Database:** PostgreSQL (Neon) via Prisma ORM
*   **Auth:** Clerk
*   **AI Providers:** Google Gemini, OpenRouter (DeepSeek), HuggingFace Inference
*   **Visualization:** Recharts & Lucide React

---

## 🛠️ Local Setup Guide

Follow these steps to run the Economic Security Engine locally.

### 1. Prerequisites
*   Node.js 18+
*   PostgreSQL Database (Local or Neon)
*   A GitHub App created in your settings.

### 2. Clone & Install
```bash
git clone https://github.com/your-username/codediff-ai.git
cd codediff-ai
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the root directory. You will need keys for the AI providers and Database.

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/codediff?sslmode=require"

# AI Providers
GEMINI_API_KEY="AIzaSy..."
OPENROUTER_API_KEY="sk-or-..."
HUGGINGFACE_API_KEY="hf_..."
# GROQ_API_KEY="gsk_..." (Optional if using Groq fallback)

# GitHub App Configuration
GITHUB_APP_ID="12345"
GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
GITHUB_WEBHOOK_SECRET="your_webhook_secret"
GITHUB_CLIENT_ID="iv1..."
GITHUB_CLIENT_SECRET="..."

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_GITHUB_INSTALL_URL="https://github.com/apps/codediff-ai/installations/new"

# Authentication
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
```

### 4. Database Migration
Sync your Prisma schema with your database.
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to access the dashboard. To trigger an audit, use a tool like `ngrok` to tunnel GitHub webhooks to your local machine.

---

## 🔮 Future Scope (Roadmap)

We are building the operating system for Fintech Security.

*   **Phase 1 (Current): Economic Security Engine**
    *   Detection, Financial Quantification, and Compliance Mapping.
*   **Phase 2 (Q2 2026): Live Vulnerability Prover**
    *   Spins up isolated Docker sandboxes for every PR.
    *   Actually *executes* an SQL injection or XSS attack against the branch to prove it is vulnerable, providing a replay video in the dashboard.
*   **Phase 3 (Q4 2026): Predictive Debt Oracle**
    *   Analyzes git velocity and churn to predict architectural breakage.
    *   "If you merge this, module X will fail in 3 months."
*   **Phase 4 (Year 1): Codebase DNA Sequencer**
    *   Genetic analysis of project health over time, tracking "mutation" of code patterns into anti-patterns.

---

## 📸 Screenshots

| Financial Dashboard | Risk Analysis |
### 1. The Economic Security Dashboard
*Real-time quantification of financial risk and regulatory liability.*
![Financial Risk Dashboard](./public/dashboard.png)

### 2. Compliance & Risk Matrix
*Visualizing high-stakes vulnerabilities mapped against potential financial loss.*
![Compliance Matrix](./public/scan.png)



Made with ❤️ for teams who measure security by dollars saved, not checklists.


