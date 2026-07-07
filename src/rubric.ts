import { APICallError, generateText, NoObjectGeneratedError, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { rubricSchema, type Rubric } from "./schemas.js";

export async function generateRubric(
    jobDescription: string
): Promise<Rubric> {
    if (!jobDescription.trim()) {
        throw new Error("Job description is required");
    }

    // Send jd to LLM
    const model = openai('gpt-4.1-mini');
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

            Your job is to turn a job description into a clear hiring rubric.

            A rubric is a scoring checklist used to judge CVs fairly.

            Rules:
            - Create between 6 and 10 criteria.
            - Each criterion must have a stable id like C1, C2, C3.
            - Each criterion should be based only on the job description.
            - Mark mustHave as true only for clear required skills, experience, qualifications, or responsibilities.
            - Use weight from 1 to 5.
            - Weight 5 means extremely important.
            - Weight 1 means nice-to-have.
            - evidenceGuidance should explain what evidence to look for in a CV.
            - Do not include scoring yet.
            - Do not evaluate any candidates.
            `,
            prompt: `Create a hiring rubric for this job description: ${jobDescription}`,
            temperature: 0
        })

        return result.output;
    } catch (error) {
        if (NoObjectGeneratedError.isInstance(error)) {
            console.error("The AI failed to generate a valid rubric object.");
            console.error("Raw text:", error.text);
            console.error("Cause:", error.cause);

            throw new Error(
                "The AI response did not match the rubric schema."
            )
        }
        if (APICallError.isInstance(error)) {
            console.error("AI API call failed.");
            console.error("Status code:", error.statusCode);
            console.error("Response body:", error.responseBody);

            throw new Error(
                `AI API call failed${error.statusCode ? ` with status ${error.statusCode}` : ""}.`
            );
        }

        console.error("Unexpected rubric generation error: ", error);
        throw new Error("Unexpected error while generating rubric.");
    }

    // Validate
}