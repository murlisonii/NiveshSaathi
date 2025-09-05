
"use client";

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PortfolioItem } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { usePortfolioStore } from '@/hooks/use-portfolio-store';

const COLORS = ["#3F51B5", "#7E57C2", "#5C6BC0", "#9575CD", "#7986CB"];

export function PortfolioCard() {
  const { portfolio, totalValue, totalInvestment, dayChange, pnl, riskScore, virtualBalance } = usePortfolioStore((state) => ({
    portfolio: state.portfolio,
    totalValue: state.totalValue,
    totalInvestment: state.totalInvestment,
    dayChange: state.dayChange,
    pnl: state.pnl,
    riskScore: state.riskScore,
    virtualBalance: state.virtualBalance
  }));


  const chartData = portfolio.map(item => ({
    name: item.stock.symbol,
    value: item.stock.price * item.shares,
  }));

  return (
    <Card className="bg-white/50 dark:bg-black/50 border-transparent shadow-md">
      <CardHeader>
        <CardTitle>My Portfolio</CardTitle>
        <CardDescription>Virtual Balance: Rs {virtualBalance.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                className="text-xs"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `Rs ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between text-sm"><span>Total Investment</span> <span className="font-medium">Rs {totalInvestment.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span>Current Value</span> <span className="font-medium">Rs {totalValue.toFixed(2)}</span></div>
            <Separator />
            <div className={`flex justify-between text-sm font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span>Overall P/L</span>
              <span>Rs {pnl.toFixed(2)}</span>
            </div>
        </div>

        <Separator />
         <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <p className="text-sm font-medium">Portfolio Risk Score</p>
            </div>
            <p className="text-xl font-bold text-accent">{riskScore}</p>
          </div>
      </CardContent>
    </Card>
  );
}
