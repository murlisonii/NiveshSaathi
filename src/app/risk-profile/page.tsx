
import { RiskProfileQuiz } from '@/components/risk-profile/risk-profile-quiz';
import type { Metadata } from 'next';
import { ShieldQuestion } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Risk Profile - Nivesh Saathi',
  description: 'Determine your investor risk profile.',
};

export default function RiskProfilePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
       <header className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="p-3 rounded-full bg-primary/10">
          <ShieldQuestion className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary">Discover Your Investor Profile</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Answer a few questions to understand your risk tolerance and get personalized insights.
        </p>
      </header>
      <RiskProfileQuiz />
    </div>
  );
}
