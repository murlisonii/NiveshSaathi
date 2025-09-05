
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { usePortfolioStore } from '@/hooks/use-portfolio-store';

export function TradeForm() {
  const { toast } = useToast();
  const { buyStock, sellStock, stocks } = usePortfolioStore((state) => ({
    buyStock: state.buyStock,
    sellStock: state.sellStock,
    stocks: state.stocks,
  }));
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [activeTab, setActiveTab] = useState('buy');

  const handleTrade = (type: 'Buy' | 'Sell') => {
    const stockSymbol = symbol.toUpperCase();
    const tradeQuantity = parseInt(quantity);

    if (!stockSymbol || !tradeQuantity || tradeQuantity <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid stock symbol and quantity.",
        variant: "destructive",
      });
      return;
    }

    const stock = stocks.find(s => s.symbol === stockSymbol);

    if (!stock) {
      toast({
        title: "Invalid Stock Symbol",
        description: `Stock with symbol ${stockSymbol} not found.`,
        variant: "destructive",
      });
      return;
    }

    try {
      if (type === 'Buy') {
        buyStock(stock, tradeQuantity);
      } else {
        sellStock(stock, tradeQuantity);
      }

      toast({
        title: "Order Placed!",
        description: `Your order to ${type.toLowerCase()} ${quantity} shares of ${stockSymbol} has been submitted.`,
      });
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setSymbol('');
    setQuantity('');
  };


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <form className="space-y-4 pt-4" onSubmit={(e) => { e.preventDefault(); handleTrade('Buy'); }}>
              <div className="space-y-2">
                <Label htmlFor="buy-symbol">Stock Symbol</Label>
                <Input id="buy-symbol" placeholder="e.g., RELIANCE" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buy-quantity">Quantity</Label>
                <Input id="buy-quantity" type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Buy</Button>
            </form>
          </TabsContent>
          <TabsContent value="sell">
            <form className="space-y-4 pt-4" onSubmit={(e) => { e.preventDefault(); handleTrade('Sell'); }}>
              <div className="space-y-2">
                <Label htmlFor="sell-symbol">Stock Symbol</Label>
                <Input id="sell-symbol" placeholder="e.g., HDFCBANK" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-quantity">Quantity</Label>
                <Input id="sell-quantity" type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" variant="destructive">Sell</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
