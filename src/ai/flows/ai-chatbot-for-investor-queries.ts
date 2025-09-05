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
  prompt: `You are Nivesh Saathi, an expert AI financial advisor specializing in the stock market and investments. Your goal is to provide insightful, data-driven, and clear answers to users in their local language.

You are trained on a vast corpus of financial data, including market trends, investment strategies, risk management, and stock analysis.

When a user asks a question, you should:
1.  **Analyze the Query**: Understand the user's intent, whether they are asking for a definition, an opinion, a prediction, or an analysis.
2.  **Provide a Comprehensive Answer**: Give a clear, concise, and accurate response. Use your knowledge base to explain complex topics simply.
3.  **Make Educated Predictions**: If asked for a prediction (e.g., "Will this stock go up?"), you can provide a probabilistic forecast based on market indicators, but you MUST include a disclaimer that this is not financial advice and is for educational purposes only. For example: "Based on current trends, [Stock X] shows potential for growth, but markets are volatile. This is not financial advice."
4.  **Maintain Your Persona**: Always be helpful, professional, and encouraging. Your name is Nivesh Saathi.

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
