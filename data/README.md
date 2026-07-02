# Synthetic demo data

All people, companies, and contact details in this directory are fictional.
Phone numbers use reserved fictional ranges (555-01xx / +44 7700 900xxx).

## Job descriptions

| File | Role |
|---|---|
| `jd-junior-ai-engineer.txt` | Junior AI Engineer, Brightvale Labs (the JD the 14 CVs target) |
| `jd-operations-manager-dental-clinic.txt` | Operations Manager, Lakeshore Smiles Dental Group (second JD for rubric-generation variety) |

## CVs — intended fit vs. the Junior AI Engineer JD

CV numbering is shuffled so file order carries no signal about quality.
These labels are the *intended* ground truth for hand-labelling the eval —
the pipeline itself must never see this file.

| File | Intended tier | Why |
|---|---|---|
| `cv-02-priya-sharma.txt` | Strong | Production generateObject + Zod, RAG, promptfoo evals in CI — near point-for-point JD match |
| `cv-05-daniel-okafor.txt` | Strong | LLM triage in prod, fine-tuning, eval harness, RAG cost migration; slightly more senior than the band |
| `cv-10-meiling-chen.txt` | Strong | MS ML (CMU), agent tool-calling internship, LLM-as-judge calibration, publication; needs visa sponsorship |
| `cv-01-jake-morrison.txt` | Partial | Solid TS backend engineer; LLM exposure is one naive side-project chatbot, no embeddings/evals |
| `cv-07-sofia-reyes.txt` | Partial | Data analyst, good Python/SQL, one classical ML model; LLM experience is a single toy script |
| `cv-11-tom-whitaker.txt` | Partial | Strong infra/DevOps, served ML models but never built them; certs + un-evaled Slack bot |
| `cv-13-anastasia-volkova.txt` | Partial | Senior frontend, real Vercel AI SDK *client-side* experience; no backend ML, RAG, or evals |
| `cv-14-arjun-patel.txt` | Partial | Genuine data scientist, classical ML only; GenAI is personal experimentation |
| `cv-03-margaret-obrien.txt` | Weak | Marketing manager; "AI experience" is daily ChatGPT use for copywriting |
| `cv-06-linda-farrelly.txt` | Weak | Bookkeeper; no programming background |
| `cv-09-kevin-nguyen.txt` | Weak | IT helpdesk; certificates but no software engineering experience |
| `cv-12-sam-cooper.txt` | Weak | New business grad; Excel + ChatGPT, no technical foundation |
| `cv-08-yusuf-alamin.txt` | Borderline | Self-taught, no degree/employer, but impressive verifiable OSS + fine-tuning + eval work; zero team experience |
| `cv-04-rachel-kim.txt` | Borderline | NLP PhD, deep evaluation expertise, but stack is pre-2021 and 3.5-year career break; overqualified/stale for a junior role |

## Redaction traps planted (for `src/redact.ts` testing)

- Names in headers, email addresses, GitHub/LinkedIn handles, and a
  possessive ("Karpathy's" — a *non-applicant* name; decide your policy)
- Phone formats: `(415) 555-0132`, `512.555.0198`, `786-555-0121`,
  `+44 7700 900456`, `+1 (412) 555-0179`, dual home/mobile lines
- Full street address (cv-03); city+ZIP only (cv-01, cv-06)
- Date of birth in three formats (cv-03 "11 April 1978", cv-06
  "02/11/1979" — ambiguous day/month, cv-08 "03/08/2003")
- Age proxies everywhere: graduation years, "9+ years experience",
  aol.com/yahoo.com email domains, year embedded in email (`lfarrelly1979`,
  `scooper2025`)
- Gender signals: pronouns "(she/her)" (cv-02, cv-04), fraternity +
  "men's club soccer" (cv-12), gendered first names throughout
- Marital status + children (cv-03), career break for family caregiving
  (cv-04 — protected-adjacent; decide whether gap *reasons* get redacted)
- Citizenship / visa / work authorization (cv-05, cv-10, cv-13, cv-14)
- National origin signals: prior employment cities (Lagos, Moscow),
  university countries (Taiwan, Korea, Nigeria, Russia)
- A referee's name and phone number (cv-03)
- Names that collide with skill-relevant tokens: "Meridian" is both an
  employer (cv-04, cv-13) — over-eager redaction can destroy evidence
