import { StockTable } from "@/components/trade/stock-table";
import { PortfolioCard } from "@/components/trade/portfolio-card";
import { TradeForm } from "@/components/trade/trade-form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trading Arena - Nivesh Saathi',
  description: 'Practice trading with delayed market data in a risk-free environment.',
};

export default function TradePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center space-y-2 mb-12">
        <h1 className="text-4xl font-bold text-primary">Simulated Trading Arena</h1>
        <p className="text-lg text-muted-foreground">
          Buy and sell stocks with a virtual balance. All data is delayed for compliance.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <StockTable />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <PortfolioCard />
          <TradeForm />
        </div>
      </div>
    </div>
  );
}
