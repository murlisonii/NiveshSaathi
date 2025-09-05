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
import type { Stock } from "@/lib/types";

const mockStocks: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2850.75, change: 30.25, changePercent: 1.07 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3805.10, change: -15.40, changePercent: -0.40 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1650.00, change: 12.80, changePercent: 0.78 },
  { symbol: "INFY", name: "Infosys Ltd.", price: 1510.55, change: -5.90, changePercent: -0.39 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", price: 1125.30, change: 25.15, changePercent: 2.29 },
  { symbol: "SBIN", name: "State Bank of India", price: 830.90, change: -2.10, changePercent: -0.25 },
];

export function StockTable() {
  return (
    <Card className="bg-card/80 dark:bg-card/80 border-border shadow-md">
      <CardHeader>
        <CardTitle>Market Watch (15-min delayed)</CardTitle>
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
            {mockStocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </TableCell>
                <TableCell>{stock.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={stock.change >= 0 ? "default" : "destructive"} className={stock.change >=0 ? 'bg-green-700/80 text-green-50' : ''}>
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
