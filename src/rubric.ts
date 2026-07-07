import { APICallError, generateText, NoObjectGeneratedError, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { rubricSchema, type Rubric } from "./schemas.js";

type RawCriterion = Rubric["criteria"][number];

export type EnrichedCriterion = RawCriterion & {
    id: string,
    normalisedWeight: number
}

export type EnrichedRubric = {
    criteria: EnrichedCriterion[];
}

export async function generateRubric(
    jobDescription: string
): Promise<EnrichedRubric> {
    if (!jobDescription.trim()) {
        throw new Error("Job description is required");
    }

    // Send jd to LLM
    const model = openai('gpt-4o-mini');
    try {
        const result = await generateText({
            model,
            output: Output.object({
                schema: rubricSchema,
                name: 'HiringRubric',
                description: 'A structure hiring rubric create from a job description'
            }),
            system: `
            You are an expert technical recruiter.

            Create a fair hiring rubric from a job description.
            
            Rules:
            - Create between 6 and 10 criteria.
            - Each criterion must be about skills, experience, qualifications, responsibilities, tools, domain knowledge, or role-relevant achievements.
            - Never create criteria based on age, gender, race, ethnicity, nationality, religion, disability, health, family status, marital status, pregnancy, appearance, name, address, or any other protected/personal characteristic.
            - Use only the job description. Do not invent requirements.
            - Mark mustHave as true only when the job description clearly presents the requirement as essential.
            - Use weight from 1 to 5.
            - 5 = critical requirement.
            - 3 = important but not critical.
            - 1 = minor nice-to-have.
            - evidenceGuidance should explain what CV evidence would satisfy the criterion.
            - Do not create ids.
            - Do not include fields that are not in the schema.
            - Do not score CVs.
            - Do not rank candidates.
            `,
            prompt: `Create a hiring rubric for this job description: ${jobDescription}`,
            temperature: 0
        })

        const rawRubric = result.output;

        const totalWeight = rawRubric.criteria.reduce(
            (sum, criterion) => sum + criterion.weight,
            0
        )

        const enrichedRubric: EnrichedRubric = {
            criteria: rawRubric.criteria.map(
                (criterion, index) => ({
                    ...criterion,
                    id: `C${String(index + 1).padStart(2, "0")}`,
                    normalisedWeight: criterion.weight / totalWeight,
                })
            )
        }

        return enrichedRubric;
    } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
            console.error("The AI failed to generate a valid rubric object.");
            console.error("Raw text:", error.text);
            console.error("Cause:", error.cause);

            throw new Error(
                "The AI response did not match the rubric schema.",
                { cause: error }
            )
        }
        if (APICallError.isInstance(error)) {
            console.error("AI API call failed.");
            console.error("Status code:", error.statusCode);
            console.error("Response body:", error.responseBody);

            throw new Error(
                `AI API call failed${error.statusCode ? ` with status ${error.statusCode}` : ""}.`,
                { cause: error }
            );
        }

        console.error("Unexpected rubric generation error: ", error);
        throw new Error("Unexpected error while generating rubric.", { cause: error });
    }
}