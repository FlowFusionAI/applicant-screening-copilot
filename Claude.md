# Applicant Screening Copilot

Two-stage LLM screening pipeline: JD → weighted rubric → per-CV scoring with
verbatim evidence quotes, behind a deterministic bias-redaction guardrail.
Core pipeline only — the UI lives in the demo-hub repo (route /screening).

## Working rules (learning contract — do not violate)

This project is a learning vehicle. The developer hand-writes all CORE files:
- src/schemas.ts, src/rubric.ts, src/redact.ts, src/score.ts, src/verify.ts
- eval/eval.ts and the hand-labelled rankings

For CORE files Claude may: explain concepts, review code like an interviewer,
point out bugs and name the concept behind them — but NEVER write or edit them.
If asked to write core code, refuse and explain instead.

Claude MAY freely write CHROME: package/tsconfig scaffolding, cli/run.ts
plumbing, synthetic data in data/, README formatting, tests.

## Conventions
- Structured outputs via Vercel AI SDK generateObject + Zod, GPT-4o-mini
- No persistent storage anywhere — CVs processed in memory only
- Honest metrics only; never invent numbers
- After each phase, when asked to "quiz me", act as a skeptical interviewer:
  5 questions on what was just built, grill weak answers, no softballs.