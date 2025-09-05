/**
 * @fileOverview A flow to generate a quiz for a given financial topic.
 *
 * - generateQuizForFinancialTopic - A function that handles quiz generation.
 * - GenerateQuizForFinancialTopicInput - The input type for the function.
 * - GenerateQuizForFinancialTopicOutput - The return type for the function.
 */
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
  scenario: z.string().optional().describe('An optional real-world scenario to provide context for the question.'),
});

export const GenerateQuizForFinancialTopicInputSchema = z.object({
  topicTitle: z.string().describe('The title of the financial topic.'),
  topicContent: z.string().describe('The educational content for the financial topic.'),
});
export type GenerateQuizForFinancialTopicInput = z.infer<typeof GenerateQuizForFinancialTopicInputSchema>;

export const GenerateQuizForFinancialTopicOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(1).describe('A list of generated quiz questions.'),
});
export type GenerateQuizForFinancialTopicOutput = z.infer<typeof GenerateQuizForFinancialTopicOutputSchema>;

export async function generateQuizForFinancialTopic(
  input: GenerateQuizForFinancialTopicInput
): Promise<GenerateQuizForFinancialTopicOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizForFinancialTopicInputSchema},
  output: {schema: GenerateQuizForFinancialTopicOutputSchema},
  prompt: `You are an expert in creating educational content for finance. Your task is to generate a single, high-quality multiple-choice quiz question based on the provided financial topic and content.

The question should test the user's understanding of a key concept from the text. Provide exactly four options. One of the options must be the correct answer.

If relevant, you can create a short, practical "Scenario" to make the question more engaging.

Topic Title: {{{topicTitle}}}
Topic Content:
{{{topicContent}}}

Generate one quiz question now.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizForFinancialTopicInputSchema,
    outputSchema: GenerateQuizForFinancialTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
