
/**
 * @fileOverview A flow to generate personalized financial suggestions for a user.
 *
 * - getPersonalizedSuggestions - A function that provides personalized advice.
 * - GetPersonalizedSuggestionsInput - The input type for the function.
 * - GetPersonalizedSuggestionsOutput - The return type for the function.
 */
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PortfolioItemSchema = z.object({
  symbol: z.string().describe('The stock ticker symbol.'),
  shares: z.number().describe('The number of shares held.'),
  avgPrice: z.number().describe('The average purchase price of the stock.'),
  currentPrice: z.number().describe('The current market price of the stock.'),
});

const GetPersonalizedSuggestionsInputSchema = z.object({
  riskProfile: z.enum(['Conservative', 'Moderate', 'Aggressive']).describe("The user's risk profile."),
  portfolio: z.array(PortfolioItemSchema).describe('A list of stocks in the user\'s portfolio.'),
});
export type GetPersonalizedSuggestionsInput = z.infer<typeof GetPersonalizedSuggestionsInputSchema>;

const GetPersonalizedSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of personalized suggestions, predictions, or observations.'),
});
export type GetPersonalizedSuggestionsOutput = z.infer<typeof GetPersonalizedSuggestionsOutputSchema>;

export async function getPersonalizedSuggestions(
  input: GetPersonalizedSuggestionsInput
): Promise<GetPersonalizedSuggestionsOutput> {
  return getPersonalizedSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSuggestionsPrompt',
  input: {schema: GetPersonalizedSuggestionsInputSchema},
  output: {schema: GetPersonalizedSuggestionsOutputSchema},
  prompt: `You are a personalized financial advisor AI. Your goal is to provide helpful, actionable suggestions to users based on their investment portfolio and risk tolerance.

Analyze the user's situation and provide 3-5 clear, concise suggestions. The suggestions can be about potential risks, diversification opportunities, or interesting market observations relevant to their holdings.

User's Risk Profile: {{riskProfile}}

User's Portfolio:
{{#each portfolio}}
- **{{symbol}}**: {{shares}} shares
  - Average Price: Rs {{avgPrice}}
  - Current Price: Rs {{currentPrice}}
  - P/L per share: Rs {{math currentPrice '-' avgPrice}}
{{/each}}

Generate your personalized suggestions now.`,
});

const getPersonalizedSuggestionsFlow = ai.defineFlow(
  {
    name: 'getPersonalizedSuggestionsFlow',
    inputSchema: GetPersonalizedSuggestionsInputSchema,
    outputSchema: GetPersonalizedSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
