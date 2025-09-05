'use server';
/**
 * @fileOverview An AI chatbot for answering investor queries in local languages.
 *
 * - aiChatbotForInvestorQueries - A function that handles the chatbot functionality.
 * - AIChatbotForInvestorQueriesInput - The input type for the aiChatbotForInvestorQueries function.
 * - AIChatbotForInvestorQueriesOutput - The return type for the aiChatbotForInvestorQueries function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatbotForInvestorQueriesInputSchema = z.object({
  query: z.string().describe('The user query about investing in their local language.'),
});
export type AIChatbotForInvestorQueriesInput = z.infer<typeof AIChatbotForInvestorQueriesInputSchema>;

const AIChatbotForInvestorQueriesOutputSchema = z.object({
  response: z.string().describe('The response to the user query in their local language.'),
});
export type AIChatbotForInvestorQueriesOutput = z.infer<typeof AIChatbotForInvestorQueriesOutputSchema>;

export async function aiChatbotForInvestorQueries(input: AIChatbotForInvestorQueriesInput): Promise<AIChatbotForInvestorQueriesOutput> {
  return aiChatbotForInvestorQueriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotForInvestorQueriesPrompt',
  input: {schema: AIChatbotForInvestorQueriesInputSchema},
  output: {schema: AIChatbotForInvestorQueriesOutputSchema},
  prompt: `You are a helpful AI chatbot that answers questions about investing in the user's local language.

  User Query: {{{query}}}
  `,
});

const aiChatbotForInvestorQueriesFlow = ai.defineFlow(
  {
    name: 'aiChatbotForInvestorQueriesFlow',
    inputSchema: AIChatbotForInvestorQueriesInputSchema,
    outputSchema: AIChatbotForInvestorQueriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
