import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

const portfolio = {
  totalValue: 12530.50,
  dayChange: 125.72,
  dayChangePercent: 1.01,
  riskScore: 68,
};

export function PortfolioOverview() {
  const isPositive = portfolio.dayChange > 0;

  return (
    <Card className="h-full bg-white/50 dark:bg-black/50 shadow-md border-transparent">
      <CardHeader>
        <CardTitle>Virtual Portfolio</CardTitle>
        <CardDescription>A snapshot of your simulated investments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-4xl font-bold tracking-tight">
              Rs {portfolio.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className={`flex items-center justify-center gap-1 font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>Rs {portfolio.dayChange.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({portfolio.dayChangePercent.toFixed(2)}%) Today</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div>
              <p className="text-sm font-medium">Risk Score</p>
              <p className="text-xs text-muted-foreground">Moderately High</p>
            </div>
            <p className="text-2xl font-bold text-accent">{portfolio.riskScore}</p>
          </div>
          <Link href="/trade" passHref>
            <Button className="w-full">Go to Trading Arena</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
