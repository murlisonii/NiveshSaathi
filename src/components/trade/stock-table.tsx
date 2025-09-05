
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from '@/hooks/use-portfolio-store';

export function StockTable() {
  const stocks = usePortfolioStore((state) => state.stocks);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Market Watch</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Price (Rs)</TableHead>
              <TableHead>Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </TableCell>
                <TableCell>{stock.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={stock.change >= 0 ? "default" : "destructive"}>
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
