# Run observations

Honest notes from real runs — the misses recorded here are what the
hand-labelled eval phase is designed to measure. Never invent numbers;
everything below comes from actual output.

## Run 1 — Junior AI Engineer JD (2026-07-07)

gpt-4o-mini, temperature 0, 10 criteria, 8.7s, weights normalised to 1.000.

- **Wrong demotion**: "embeddings & vector stores" marked nice-to-have
  (weight 3) despite the JD listing it in the required section.
- **Weight miscalibration**: one JD bullet ("Git, CI, and at least one
  cloud platform") was split into two criteria totalling ~23% weight,
  while core LLM API experience got ~14%. A generic backend developer
  could outscore an AI engineer on this rubric.
- **Circular evidenceGuidance**: e.g. C01 restates the criterion name
  instead of describing what distinguishes strong evidence. Guidance is
  the only context the scoring call gets, so circularity is costly.
- **Silent drops**: to fit the 10-criterion cap, two JD nice-to-haves
  (schema-validation tooling; fine-tuning/eval frameworks) were omitted.

## Run 2 — Operations Manager, dental clinic (2026-07-07)

gpt-4o-mini, temperature 0, 10 criteria, 7.7s, weights normalised to 1.000.

- **Generalised well**: domain-appropriate criteria, no tech
  bleed-through; JD nice-to-haves (multi-site, Spanish, dental
  background) correctly mapped to `mustHave: false`.
- **Same demotion pattern as Run 1**: HIPAA/OSHA compliance marked
  nice-to-have — in a healthcare clinic. Items that live in the JD's
  responsibilities section (vs. phrased as "X+ years required") get
  demoted.
- **Scoreability question**: "Calm Under Pressure" is a legitimate JD
  requirement but it's unclear what *verbatim CV quote* could evidence
  it. Some criteria may be structurally unscoreable under the
  evidence-quote regime; score.ts needs a stance on this.

## Cross-run patterns

- **Templated weights?** Both runs produced the identical weight
  multiset {5,5,5,4,4,3,3,3,2,1} (sum 35) for unrelated domains — the
  distribution may be model house style rather than per-role judgment.
- **Cap saturation**: exactly 10/10 criteria in both runs. The model
  fills whatever budget it's given; the cap is acting as a target, not
  a limit.
- All of the above look like system-prompt calibration issues, not
  schema issues.
