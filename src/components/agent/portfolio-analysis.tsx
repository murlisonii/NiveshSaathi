
'use client';

import { useState, useTransition, useEffect } from 'react';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';
import {
  getPersonalizedSuggestions,
  GetPersonalizedSuggestionsOutput,
} from '@/ai/flows/get-personalized-suggestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function PortfolioAnalysis() {
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
    setResult(null);
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
    if(portfolio.length > 0) {
      handleFetchSuggestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskScore, portfolio.length]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Suggestions</CardTitle>
        <CardDescription>Click the button to get fresh insights from your AI agent based on your current portfolio and risk profile.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Button onClick={handleFetchSuggestions} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {isPending ? "Analyzing..." : "Get Fresh Suggestions"}
          </Button>
        </div>
        
        {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

        {!isPending && !result && portfolio.length === 0 && (
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Start Trading to Get Suggestions</AlertTitle>
                <AlertDescription>
                    Your portfolio is currently empty. Buy some stocks in the trading arena, and your AI agent will be able to provide personalized suggestions here.
                </AlertDescription>
            </Alert>
        )}

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
  );
}
