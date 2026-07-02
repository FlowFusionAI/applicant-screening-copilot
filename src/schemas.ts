import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { NoObjectGeneratedError } from 'ai';

// 1. The schema — this is a contract AND a prompt, simultaneously
const ticketSchema = z.object({
    category: z.enum(['billing', 'bug', 'how-to', 'other'])
        .describe('The single best-fitting category for this ticket'),
    severity: z.number().min(1).max(5)
        .describe('1 = cosmetic, 5 = production down'),
    customerQuotes: z.array(z.string())
        .describe('Verbatim sentences from the ticket that justify the severity'),
});

// 2. The call
try {
    const { object, usage } = await generateObject({
        model: openai('gpt-4o-mini'),
        schema: ticketSchema,
        system: 'You triage support tickets. Quote only text that appears in the ticket.',
        prompt: `Ticket:\n"""${ticketText}"""`,
    });
} catch (err) {
    if (NoObjectGeneratedError.isInstance(err)) {
        console.error('Model produced: ', err.text, 'finish: ', err.finishReason);
    }
    throw err;
}


// 3. object is typed as z.infer<typeof ticketSchema> — no casting, no JSON.parse
console.log(object.severity);        // number, guaranteed 1–5 *by Zod*
console.log(usage.totalTokens);      // cost instrumentation comes free
