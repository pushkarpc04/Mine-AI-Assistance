'use server';

/**
 * @fileOverview Fact verification flow for GPT Mine.
 *
 * - verifyFact - A function that verifies a given technical question and provides an accurate answer.
 * - VerifyFactInput - The input type for the verifyFact function.
 * - VerifyFactOutput - The return type for the verifyFact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyFactInputSchema = z.object({
  question: z.string().describe('The technical question to be verified.'),
});
export type VerifyFactInput = z.infer<typeof VerifyFactInputSchema>;

const VerifyFactOutputSchema = z.object({
  verifiedAnswer: z.string().describe('The verified and accurate answer to the question.'),
  sources: z.array(z.string()).describe('A list of sources used to verify the answer.'),
});
export type VerifyFactOutput = z.infer<typeof VerifyFactOutputSchema>;

export async function verifyFact(input: VerifyFactInput): Promise<VerifyFactOutput> {
  return verifyFactFlow(input);
}

const verifyFactPrompt = ai.definePrompt({
  name: 'verifyFactPrompt',
  input: {schema: VerifyFactInputSchema},
  output: {schema: VerifyFactOutputSchema},
  prompt: `You are GPT Mine, a highly reliable AI assistant specialized in providing accurate technical information.
  A user has asked the following question:
  {{question}}

  Verify the information needed to answer this question using reliable sources, and provide a verified and accurate answer.
  List the sources you used to verify the information.

  Output the verified answer and the sources in the following format:
  {
    "verifiedAnswer": "The verified and accurate answer.",
    "sources": ["Source 1", "Source 2"]
  }`,
});

const verifyFactFlow = ai.defineFlow(
  {
    name: 'verifyFactFlow',
    inputSchema: VerifyFactInputSchema,
    outputSchema: VerifyFactOutputSchema,
  },
  async input => {
    const {output} = await verifyFactPrompt(input);
    return output!;
  }
);
