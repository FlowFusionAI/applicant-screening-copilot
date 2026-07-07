import { z } from 'zod';

// 1. The schema — this is a contract AND a prompt, simultaneously
const criterionSchema = z.object({
    name: z.string().describe("Human readable label"),
    evidenceGuidance: z.string().describe("What CV evidence would satisfy this criterion."),
    mustHave: z.boolean().describe("the job description's must have requirements"),
    weight: z.int().min(1).max(5).describe("the relative importance"),

});

const criterionScoreSchema = z.object({
    criterionId: z.string().describe("copy the id of the criterion you are scoring, exactly as given in the rubric"),
    evidenceQuotes: z.array(z.string()).max(3).describe("quotes copied word-for-word from the CV, and return an empty list if there's no evidence"),
    reasoning: z.string().describe("one or two sentences explaining why the quotes justify the level"),
    level: z.enum(['no_evidence', 'weak', 'moderate', 'strong'])
})

export const rubricSchema = z.object({
    criteria: z.array(criterionSchema).min(6).max(10)
})

export const cvScoreSchema = z.object({
    criterionScores: z.array(criterionScoreSchema)
})

export type Rubric = z.infer<typeof rubricSchema>;
export type CvScore = z.infer<typeof cvScoreSchema>;