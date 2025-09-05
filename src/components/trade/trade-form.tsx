"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export function TradeForm() {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleTrade = (type: 'Buy' | 'Sell') => {
    if (!symbol || !quantity || parseInt(quantity) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid stock symbol and quantity.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock trade execution
    console.log(`${type} ${quantity} of ${symbol.toUpperCase()}`);

    toast({
      title: "Order Placed!",
      description: `Your order to ${type.toLowerCase()} ${quantity} shares of ${symbol.toUpperCase()} has been submitted.`,
    });

    setSymbol('');
    setQuantity('');
  };


  return (
    <Card className="bg-white/50 dark:bg-black/50 border-transparent shadow-md">
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
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
