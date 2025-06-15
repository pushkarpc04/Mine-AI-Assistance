// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Explains the functionality of a given code block step by step.
 *
 * - explainCode - A function that takes a code block and explains its functionality.
 * - ExplainCodeInput - The input type for the explainCode function.
 * - ExplainCodeOutput - The return type for the explainCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  code: z.string().describe('The code block to be explained.'),
  language: z.string().optional().describe('The programming language of the code. If not provided, attempt to infer it.'),
});

export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('A step-by-step explanation of the code functionality.'),
});

export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCode(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `You are an expert software engineer. Explain the following code block step by step so that a developer can understand its functionality. If the language is specified, ensure your explanation takes that into account. If not, infer the language.

Language: {{language}}
Code:
{{code}}`,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
