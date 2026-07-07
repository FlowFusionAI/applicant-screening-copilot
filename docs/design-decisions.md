# Design decisions

Decisions made during the schema/rubric phase, with reasoning — recorded
so later stages stay consistent with them.

## 1. The model outputs only judgment; code computes everything derivable

Criterion ids (`C01`…) are assigned by array index after generation,
weights are normalised in code, and the eventual overall score will be a
weighted sum computed in `score.ts` — never asked from the model. If
deterministic code can produce a value, the LLM shouldn't. Every field
removed from the LLM's schema is one less thing that can be wrong in an
unverifiable way.

## 2. Weights are independent 1–5 integer ratings, normalised in code

"Weights must sum to 100" is a constraint *across* array elements —
provider-side schema enforcement can't express relational constraints and
models botch the arithmetic. Per-item ratings are independently valid;
division is ours (`weight / Σweights`).

## 3. Score levels are an enum, not a number

`no_evidence | weak | moderate | strong` is grammar-enforced token by
token in OpenAI strict structured-output mode. A calibrated 0–10 number
is not: `minimum`/`maximum` are stripped from the model-side schema and
only validated by Zod after the response arrives. Closed sets beat
calibrated numbers. The numeric mapping (0–3) lives in code.

## 4. Evidence quote arrays may be empty

Forcing `min(1)` would mechanically coerce the model into inventing
quotes when a CV has nothing for a criterion — manufacturing the exact
failure `verify.ts` exists to catch. An empty array is the legal
"nothing found".

## 5. Schema field order is generation order

Models emit JSON top-to-bottom, and each token is conditioned on what
came before. `evidenceQuotes` → `reasoning` → `level` forces the verdict
to be conditioned on the evidence rather than the reverse — chain of
thought via property ordering.

## 6. Bias guarding covers both LLM surfaces

CVs pass through deterministic redaction (`redact.ts`) before scoring.
The rubric side is guarded by an explicit system-prompt rule: criteria
may only concern skills, experience, and qualifications — never
protected characteristics. Without that rule the rubric would be the
pipeline's only unguarded surface.

## 7. Errors chain, never swallow

Every wrapped throw uses `new Error(msg, { cause })` so the original
failure (raw model text, Zod validation path, HTTP status) survives to
the top of the stack instead of being replaced by a one-line summary.

## 8. Core logic takes strings, not file paths

`generateRubric(jdText: string)` knows nothing about files. I/O lives at
the edges (`cli/run.ts`); the core stays pure and testable, and the same
functions will serve the demo-hub UI, where CVs arrive as uploads and are
processed in memory only.
