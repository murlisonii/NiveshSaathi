
'use client';

import { useState, useTransition, useEffect } from 'react';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import {
  getPersonalizedSuggestions,
  GetPersonalizedSuggestionsOutput,
} from '@/ai/flows/get-personalized-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Bot, Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function AgentDashboard() {
  const { portfolio, stocks, riskScore } = usePortfolioStore((state) => ({
    portfolio: state.portfolio,
    stocks: state.stocks,
    riskScore: state.riskScore,
  }));
  
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GetPersonalizedSuggestionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRiskProfile = (score: number) => {
    if (score <= 40) return 'Conservative';
    if (score <= 70) return 'Moderate';
    return 'Aggressive';
  }

  const handleFetchSuggestions = () => {
    setError(null);
    startTransition(async () => {
      try {
        const stockMap = new Map(stocks.map(s => [s.symbol, s]));
        const detailedPortfolio = portfolio.map(item => ({
            symbol: item.stock.symbol,
            shares: item.shares,
            avgPrice: item.avgPrice,
            currentPrice: stockMap.get(item.stock.symbol)?.price || item.stock.price,
        }));

        const suggestions = await getPersonalizedSuggestions({
          riskProfile: getRiskProfile(riskScore),
          portfolio: detailedPortfolio,
        });
        setResult(suggestions);
      } catch (e: any) {
        setError("Failed to get suggestions. Please try again later.");
      }
    });
  };

  useEffect(() => {
    // Fetch suggestions on initial component load
    handleFetchSuggestions();
  }, []);

  return (
    <div className="space-y-8">
       <header className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/10">
            <Bot className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary">Your Personalized AI Agent</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
            Get tailored insights and suggestions based on your virtual portfolio and risk profile.
        </p>
      </header>
      
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Suggestions</CardTitle>
          <CardDescription>Click the button to get fresh insights from your AI agent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button onClick={handleFetchSuggestions} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {isPending ? "Analyzing..." : "Get Fresh Suggestions"}
            </Button>
          </div>
          
          {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

          {result && (
             <div className="space-y-4 pt-4">
                {result.suggestions.map((suggestion, index) => (
                    <Alert key={index}>
                        <Lightbulb className="h-4 w-4" />
                        <AlertTitle>Suggestion #{index + 1}</AlertTitle>
                        <AlertDescription>
                            {suggestion}
                        </AlertDescription>
                    </Alert>
                ))}
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
