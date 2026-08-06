# AGENTS.md

Context and operational guidelines for AI coding agents working on `medagent-ai`.

---

## 🛠️ Project Setup & Commands

### Prerequisites
- Node.js 18+ / Python 3.10+ (depending on active runtime package)
- Docker (optional for containerized deployment)

### Common Commands
- **Install Dependencies:** `npm install` (or `pnpm install`)
- **Start Dev Server:** `npm run dev`
- **Build Project:** `npm run build`
- **Run Tests:** `npm test`
- **Lint Code:** `npm run lint`

---

## 📐 Code Style & Conventions

- **JavaScript / TypeScript:**
  - Standard ES6+ syntax. Use modern async/await patterns over raw promises.
  - Strict type checking if TypeScript is configured (`tsconfig.json`).
  - Follow ESLint / Prettier code formatting rules.
- **Python / AI Modules (if applicable):**
  - Follow PEP8 standards.
  - Group imports (standard library, third-party, local imports).
- **Environment Variables:**
  - Never hardcode API keys, database credentials, or secret tokens.
  - Store configuration variables in `.env` and provide defaults or placeholders in `.env.example`.

---

## 🏥 Healthcare & AI Agent Safety Guidelines

- **Medical Disclaimers:** Ensure any user-facing agent responses contain appropriate medical disclaimers (e.g., stating the tool is an AI assistant, not a replacement for professional medical advice).
- **Data Privacy (HIPAA / Patient Safety):**
  - Do not log raw personal health information (PHI) or sensitive patient data in application logs.
  - Ensure all external LLM API payloads sanitize user inputs where appropriate.

---

## 🧪 Testing & PR Instructions

- **Run Tests before Committing:** Always verify tests pass via `npm test` or the appropriate test runner before opening a pull request.
- **Commit Format:** Use semantic commit messages (e.g., `feat: add patient triage agent flow`, `fix: resolve API timeout in diagnosis handler`).
- **PR Titles:** Short, clear descriptions prefixed with the scope, e.g., `[Agent Workflow] Update prompt template for medical triaging`.