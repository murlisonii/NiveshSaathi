
"use client";
import { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import type { Stock, PortfolioItem } from '@/lib/types';

const initialStocks: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2850.75, change: 30.25, changePercent: 1.07 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3805.10, change: -15.40, changePercent: -0.40 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1650.00, change: 12.80, changePercent: 0.78 },
  { symbol: "INFY", name: "Infosys Ltd.", price: 1510.55, change: -5.90, changePercent: -0.39 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", price: 1125.30, change: 25.15, changePercent: 2.29 },
  { symbol: "SBIN", name: "State Bank of India", price: 830.90, change: -2.10, changePercent: -0.25 },
];

interface PortfolioState {
  stocks: Stock[];
  portfolio: PortfolioItem[];
  virtualBalance: number;
  totalValue: number;
  totalInvestment: number;
  pnl: number;
  dayChange: number;
  dayChangePercent: number;
  riskScore: number;
  buyStock: (stock: Stock, shares: number) => void;
  sellStock: (stock: Stock, shares: number) => void;
  setRiskScore: (score: number) => void;
  updateStockPrices: () => void;
}

const calculatePortfolioMetrics = (portfolio: PortfolioItem[], stocks: Stock[]) => {
  let totalValue = 0;
  let totalInvestment = 0;
  let dayChange = 0;

  const stockMap = new Map(stocks.map(s => [s.symbol, s]));

  portfolio.forEach(item => {
    const currentStock = stockMap.get(item.stock.symbol);
    if (currentStock) {
      totalValue += currentStock.price * item.shares;
      totalInvestment += item.avgPrice * item.shares;
      dayChange += currentStock.change * item.shares;
    }
  });

  const pnl = totalValue - totalInvestment;
  const dayChangePercent = totalInvestment > 0 ? (dayChange / totalInvestment) * 100 : 0;

  return { totalValue, totalInvestment, pnl, dayChange, dayChangePercent };
};

const createPortfolioStore = () =>
  createStore<PortfolioState>((set, get) => {
    const initialPortfolio: PortfolioItem[] = [
        {
            stock: initialStocks.find(s => s.symbol === 'RELIANCE')!,
            shares: 2,
            avgPrice: 2800.00,
        },
        {
            stock: initialStocks.find(s => s.symbol === 'HDFCBANK')!,
            shares: 4,
            avgPrice: 1600.00,
        },
    ];

    return {
      stocks: initialStocks,
      portfolio: initialPortfolio,
      virtualBalance: 1000000,
      riskScore: 68,
      ...calculatePortfolioMetrics(initialPortfolio, initialStocks),
      buyStock: (stockToBuy, shares) => {
          const cost = stockToBuy.price * shares;
          if (get().virtualBalance < cost) {
              throw new Error("Insufficient funds to complete this transaction.");
          }

          const newPortfolio = [...get().portfolio];
          const existingItemIndex = newPortfolio.findIndex(item => item.stock.symbol === stockToBuy.symbol);

          if (existingItemIndex > -1) {
              const existingItem = newPortfolio[existingItemIndex];
              const totalShares = existingItem.shares + shares;
              const newAvgPrice = ((existingItem.avgPrice * existingItem.shares) + (stockToBuy.price * shares)) / totalShares;
              newPortfolio[existingItemIndex] = { ...existingItem, shares: totalShares, avgPrice: newAvgPrice };
          } else {
              newPortfolio.push({ stock: stockToBuy, shares, avgPrice: stockToBuy.price });
          }
          
          set(state => {
            const metrics = calculatePortfolioMetrics(newPortfolio, state.stocks);
            return {
              portfolio: newPortfolio,
              virtualBalance: state.virtualBalance - cost,
              ...metrics
            };
          });
      },
      sellStock: (stockToSell, shares) => {
          const newPortfolio = [...get().portfolio];
          const existingItemIndex = newPortfolio.findIndex(item => item.stock.symbol === stockToSell.symbol);
          
          if (existingItemIndex === -1) {
              throw new Error("You do not own this stock.");
          }
          
          const existingItem = newPortfolio[existingItemIndex];

          if (existingItem.shares < shares) {
              throw new Error(`You only own ${existingItem.shares} shares.`);
          }

          const income = stockToSell.price * shares;

          if (existingItem.shares === shares) {
              newPortfolio.splice(existingItemIndex, 1);
          } else {
              newPortfolio[existingItemIndex] = { ...existingItem, shares: existingItem.shares - shares };
          }
          
          set(state => {
            const metrics = calculatePortfolioMetrics(newPortfolio, state.stocks);
            return {
              portfolio: newPortfolio,
              virtualBalance: state.virtualBalance + income,
              ...metrics
            };
          });
      },
      setRiskScore: (score: number) => set({ riskScore: score }),
      updateStockPrices: () => {
        const { stocks, portfolio } = get();
        const newStocks = stocks.map(stock => {
          const changeFactor = (Math.random() - 0.5) * 0.05; // Max 5% change
          const oldPrice = stock.price;
          const newPrice = oldPrice * (1 + changeFactor);
          const change = newPrice - oldPrice;
          const changePercent = (change / oldPrice) * 100;
          return { ...stock, price: newPrice, change, changePercent };
        });

        const newPortfolio = portfolio.map(item => {
          const updatedStock = newStocks.find(s => s.symbol === item.stock.symbol);
          return updatedStock ? { ...item, stock: updatedStock } : item;
        })

        set({
          stocks: newStocks,
          portfolio: newPortfolio,
          ...calculatePortfolioMetrics(newPortfolio, newStocks)
        });
      }
    };
  });

const PortfolioContext = createContext<ReturnType<typeof createPortfolioStore> | null>(null);

export function PortfolioStoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createPortfolioStore>>();
  if (!storeRef.current) {
    storeRef.current = createPortfolioStore();
  }
  return <PortfolioContext.Provider value={storeRef.current}>{children}</PortfolioContext.Provider>;
}

export const usePortfolioStore = <T,>(selector: (state: PortfolioState) => T): T => {
  const store = useContext(PortfolioContext);
  if (store === null) {
    throw new Error("usePortfolioStore must be used within a PortfolioStoreProvider");
  }
  return useStore(store, selector);
};
