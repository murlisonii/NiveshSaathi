
'use server';
/**
 * @fileOverview An AI flow to analyze a given financial document and answer questions about it.
 *
 * - analyzeDocument - A function that handles the document analysis process.
 * - AnalyzeDocumentInput - The input type for the analyzeDocument function.
 * - AnalyzeDocumentOutput - The return type for the analyzeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDocumentInputSchema = z.object({
  documentContent: z.string().describe('The text content of the financial document.'),
  imageDataUri: z.string().optional().describe(
    "An optional image of a chart, graph, or table from the document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  userQuestion: z.string().describe('The specific question the user has about the document.'),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

const AnalyzeDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the user\'s question based on the document content.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export async function analyzeDocument(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: {schema: AnalyzeDocumentInputSchema},
  output: {schema: AnalyzeDocumentOutputSchema},
  prompt: `You are an expert financial analyst. Your task is to analyze the provided financial document content and an optional image (like a chart or graph) to answer the user's question based *only* on the information given.

Do not use any external knowledge. If the answer cannot be found in the provided materials, state that clearly.

User's Question:
"{{{userQuestion}}}"

{{#if documentContent}}
Document Content:
---
{{{documentContent}}}
---
{{/if}}

{{#if imageDataUri}}
Supporting Image:
{{media url=imageDataUri}}
{{/if}}


Provide your answer now.`,
});

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
