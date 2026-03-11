# Rayeva AI App

Implemented modules:
- Module 1: AI Auto-Category & Tag Generator
- Module 3: AI Impact Reporting Generator

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Required env vars:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.3-70b-versatile
MONGODB_URI=mongodb://localhost:27017/rayeva-ai
```

## Endpoints

- POST /api/categorize
- POST /api/impact-report
- GET /api/logs

## Notes

- AI output is always parsed as JSON and re-validated with Zod.
- Impact calculations are deterministic and live in lib/services/impact.ts.
- Prompt and response logging is stored in MongoDB via AILog.
