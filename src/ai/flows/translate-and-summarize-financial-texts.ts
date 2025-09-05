'use server';

/**
 * @fileOverview A flow to translate and summarize financial texts into a user's local language.
 *
 * - translateAndSummarize - A function that handles the translation and summarization process.
 * - TranslateAndSummarizeInput - The input type for the translateAndSummarize function.
 * - TranslateAndSummarizeOutput - The return type for the translateAndSummarize function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateAndSummarizeInputSchema = z.object({
  text: z.string().describe('The financial text to translate and summarize.'),
  language: z.string().describe('The target language for translation and summarization.'),
});
export type TranslateAndSummarizeInput = z.infer<typeof TranslateAndSummarizeInputSchema>;

const TranslateAndSummarizeOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
  summary: z.string().describe('A summary of the translated text.'),
});
export type TranslateAndSummarizeOutput = z.infer<typeof TranslateAndSummarizeOutputSchema>;

export async function translateAndSummarize(input: TranslateAndSummarizeInput): Promise<TranslateAndSummarizeOutput> {
  return translateAndSummarizeFlow(input);
}

const translateAndSummarizePrompt = ai.definePrompt({
  name: 'translateAndSummarizePrompt',
  input: {schema: TranslateAndSummarizeInputSchema},
  output: {schema: TranslateAndSummarizeOutputSchema},
  prompt: `You are an AI assistant that translates and summarizes financial texts.

Translate the following text into {{language}} and provide a summary of the translated text.

Text: {{{text}}}

Translation:

Summary: `,
});

const translateAndSummarizeFlow = ai.defineFlow(
  {
    name: 'translateAndSummarizeFlow',
    inputSchema: TranslateAndSummarizeInputSchema,
    outputSchema: TranslateAndSummarizeOutputSchema,
  },
  async input => {
    const {output} = await translateAndSummarizePrompt(input);
    return output!;
  }
);
