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
  prompt: z.string().describe('A prompt describing the code to be generated. The user might specify the language here.'),
  language: z.string().optional().describe('An optional hint for the programming language to use. The AI should prioritize language specified in the main prompt.'),
});
export type IntelligentCodeGenerationInput = z.infer<typeof IntelligentCodeGenerationInputSchema>;

const IntelligentCodeGenerationOutputSchema = z.object({
  code: z.string().describe('The generated code.'),
  language: z.string().describe('The programming language of the generated code (e.g., "java", "python", "javascript"). Use a common short name for the language for markdown formatting.'),
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
  prompt: `You are an expert software engineer. Generate clean, production-ready code with comments, using the latest libraries and best practices, based on the following user prompt.

The default programming language is Java if no language is specified by the user in their prompt.
If the user specifies a language in their prompt (e.g., "Python code for...", "write a JavaScript function..."), prioritize that language.

After generating the code, identify the primary programming language of the code you've written.

User Prompt: {{{prompt}}}
{{#if language}}User-provided language hint (treat as secondary to the main prompt): {{language}}{{/if}}

Respond with a JSON object matching the output schema. The 'language' field in your response MUST accurately reflect the language of the 'code' you generated (e.g., "java", "python", "javascript"). This 'language' field will be used for syntax highlighting.`,
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
