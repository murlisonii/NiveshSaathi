'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-chatbot-for-investor-queries.ts';
import '@/ai/flows/translate-and-summarize-financial-texts.ts';
import '@/ai/flows/generate-quiz-for-financial-topic.ts';
import '@/ai/flows/get-personalized-suggestions.ts';
import '@/ai/flows/analyze-document.ts';
import '@/ai/flows/text-to-speech.ts';
