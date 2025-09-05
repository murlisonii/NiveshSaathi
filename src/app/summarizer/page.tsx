import { SummarizerForm } from "@/components/summarizer/summarizer-form";
import type { Metadata } from 'next';
import { Languages } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Summarizer - Nivesh Saathi',
  description: 'Translate and summarize financial documents into your local language.',
};

export default function SummarizerPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="p-3 rounded-full bg-primary/10">
          <Languages className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary">AI-Powered Language Tools</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Break down language barriers. Paste any financial text to get a translation and a simplified summary in your chosen vernacular language.
        </p>
      </header>
      
      <SummarizerForm />
    </div>
  );
}
