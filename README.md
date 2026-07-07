# Applicant Screening Copilot

**LLM-powered CV screening that shows its work** — every score is backed
by verbatim quotes from the CV, every quote is verified deterministically,
and no model ever sees a candidate's name, age, gender, or nationality.

## What it does

Give it a job description and a stack of CVs. It returns a ranked,
auditable shortlist:

1. **JD → weighted rubric** — an LLM turns the job description into 6–10
   evidence-checkable criteria with normalised weights
2. **Bias redaction** — deterministic code strips names, contact details,
   dates of birth, gender signals, visa status, and age proxies *before*
   any CV reaches a model
3. **Evidence-based scoring** — a second LLM call scores each redacted CV
   per criterion, required to quote the CV verbatim for every judgment
4. **Quote verification** — deterministic string matching confirms every
   quote actually appears in the CV; unverified evidence is flagged
5. **Honest evaluation** — pipeline rankings are measured against
   hand-labelled ground truth on a 14-CV synthetic dataset

## Why it's built this way

Most LLM screening demos return a score you have to take on faith. This
pipeline is designed so that **every number can be traced or recomputed**:

- **The model outputs only judgment** — ids, weight normalisation, and
  the final weighted score are computed in code, never generated
- **Structured outputs, strictly enforced** — Zod schemas drive OpenAI's
  strict mode; score levels are closed enums the model physically cannot
  deviate from
- **Anti-hallucination by architecture** — the schema *allows* "no
  evidence found", and every claimed quote faces an exact substring check
- **Bias guarded on both LLM surfaces** — CVs are redacted before
  scoring; rubric generation is constrained to skills and experience only
- **Failures stay diagnosable** — chained errors preserve the raw model
  output and the exact validation failure all the way up the stack

## Architecture

```
jd.txt ──► rubric.ts (LLM #1) ──► weighted rubric ────────────┐
                                                              ▼
cv.txt ──► redact.ts (deterministic) ──► redacted CV ──► score.ts (LLM #2)
                                                              │
                                            verify.ts (deterministic)
                                            every quote checked vs source
                                                              │
                                                              ▼
                                              ranked, auditable results
                                              eval/ vs hand-labelled truth
```

Two LLM calls; everything else is deterministic TypeScript. CVs are
processed in memory only — nothing is persisted.

## Tech stack

| | |
|---|---|
| Language | TypeScript (strict), Node.js |
| LLM | GPT-4o-mini via Vercel AI SDK v7 |
| Structured outputs | Zod 4 schemas → OpenAI strict JSON Schema mode |
| Runner | tsx, zero-build CLI |
| UI | lives in the demo-hub repo (route `/screening`) |

## Status

| Stage | State |
|---|---|
| Schemas (data model) | ✅ |
| Rubric generation | ✅ tested on both sample JDs |
| Bias redaction | ⬜ next |
| CV scoring | ⬜ |
| Quote verification | ⬜ |
| Eval vs hand-labelled rankings | ⬜ |

## Quick start

```bash
npm install
# .env:  OPENAI_API_KEY=sk-...
npm run rubric                                                    # AI Engineer JD
npm run rubric -- data/jd-operations-manager-dental-clinic.txt    # dental JD
```

## Docs & data

- [docs/design-decisions.md](docs/design-decisions.md) — why the schemas
  and pipeline are shaped the way they are
- [docs/run-observations.md](docs/run-observations.md) — honest notes on
  real model behaviour, including the misses
- [data/README.md](data/README.md) — the synthetic dataset: 2 JDs, 14
  CVs (strong/partial/weak/borderline), and the planted redaction traps

All people and companies in the dataset are fictional.
