// use server'

/**
 * @fileOverview A Genkit flow for generating clean, production-ready code based on a user prompt.
 *
 * - intelligentCodeGeneration - A function that handles the code generation process.
 * - IntelligentCodeGenerationInput - The input type for the intelligentCodeGeneration function.
 * - IntelligentCodeGenerationOutput - The return type for the intelligentCodeGeneration function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentCodeGenerationInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the code to be generated.'),
  language: z.string().optional().describe('The programming language to use. Defaults to Python.'),
});
export type IntelligentCodeGenerationInput = z.infer<typeof IntelligentCodeGenerationInputSchema>;

const IntelligentCodeGenerationOutputSchema = z.object({
  code: z.string().describe('The generated code.'),
});
export type IntelligentCodeGenerationOutput = z.infer<typeof IntelligentCodeGenerationOutputSchema>;

export async function intelligentCodeGeneration(
  input: IntelligentCodeGenerationInput
): Promise<IntelligentCodeGenerationOutput> {
  return intelligentCodeGenerationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentCodeGenerationPrompt',
  input: {schema: IntelligentCodeGenerationInputSchema},
  output: {schema: IntelligentCodeGenerationOutputSchema},
  prompt: `You are an expert software engineer. Generate clean, production-ready code with comments, using the latest libraries and best practices, based on the following prompt. The default programming language is Python 3.11+ unless otherwise specified.

Prompt: {{{prompt}}}

Language: {{language}}`,
});

const intelligentCodeGenerationFlow = ai.defineFlow(
  {
    name: 'intelligentCodeGenerationFlow',
    inputSchema: IntelligentCodeGenerationInputSchema,
    outputSchema: IntelligentCodeGenerationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
