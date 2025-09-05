
'use client';
import { RiskProfileQuiz } from '@/components/risk-profile/risk-profile-quiz';
import { ShieldQuestion } from 'lucide-react';
import { PortfolioStoreProvider } from '@/hooks/use-portfolio-store';

export default function RiskProfilePage() {
  return (
    <PortfolioStoreProvider>
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
    </PortfolioStoreProvider>
  );
}
