# ClauseGuard AI — Automated Legal Contract & Risk Analyzer

ClauseGuard AI is a full-stack legal intelligence workspace built with Next.js 14, TypeScript, Tailwind CSS, and the Anthropic Claude 3.5 Sonnet API. It parses contracts, NDAs, and Terms of Service to automatically identify high-risk liabilities, translate legalese into plain English, highlight missing protective provisions, and extract key operational obligations.

![Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20TypeScript%20%7C%20Tailwind%20%7C%20Claude%203.5-blue)

## Key Features

- ⚖️ **Liability & Risk Scoring:** Scans legal text for aggressive indemnification, uncapped liability, and predatory clauses.
- 📄 **Plain English Translation:** Converts dense legal jargon into clear, accessible summaries for non-lawyers.
- 🔍 **Missing Clause Audit:** Checks agreements against standard industry protection benchmarks (e.g., Governing Law, IP Ownership, Mutual Termination).
- 📌 **Obligation Extractor:** Isolates contractual deadlines, payment schedules, and compliance obligations into a structured list.
- 🛡️ **Edge Privacy Architecture:** Contract text is processed exclusively via secure server-side API routes without persistent third-party storage.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI SDK:** `@anthropic-ai/sdk` (Claude 3.5 Sonnet)
- **Icons:** Lucide React

## Local Setup

1. Clone repository: `git clone https://github.com/YOUR_USERNAME/clause-guard-ai.git`
2. Install dependencies: `npm install`
3. Configure environment variable: add `ANTHROPIC_API_KEY` to `.env.local`
4. Run server: `npm run dev`
