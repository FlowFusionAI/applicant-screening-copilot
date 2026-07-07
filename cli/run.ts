import { readFile } from "node:fs/promises";
import path from "node:path";
import { generateRubric } from "../src/rubric.js";

const DEFAULT_JD = "data/jd-junior-ai-engineer.txt";

async function main() {
    const jdPath = process.argv[2] ?? DEFAULT_JD;
    const jdText = await readFile(path.resolve(jdPath), "utf8");

    console.log(`Generating rubric from: ${jdPath}\n`);
    const started = Date.now();
    const rubric = await generateRubric(jdText);
    const seconds = ((Date.now() - started) / 1000).toFixed(1);

    for (const criterion of rubric.criteria) {
        const flag = criterion.mustHave ? "MUST" : "nice";
        const pct = (criterion.normalisedWeight * 100).toFixed(1).padStart(5);
        console.log(`${criterion.id}  [${flag}]  weight ${criterion.weight}  (${pct}%)  ${criterion.name}`);
        console.log(`      evidence: ${criterion.evidenceGuidance}\n`);
    }

    const weightSum = rubric.criteria.reduce(
        (sum, criterion) => sum + criterion.normalisedWeight,
        0
    );
    console.log(
        `${rubric.criteria.length} criteria in ${seconds}s — normalised weights sum to ${weightSum.toFixed(3)}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
