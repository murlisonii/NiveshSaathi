"use client";
import { createContext, useRef, useContext } from 'react';
import { createStore, useStore } from 'zustand';
import type { Stock, PortfolioItem } from '@/lib/types';

export const mockStocks: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2850.75, change: 30.25, changePercent: 1.07 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3805.10, change: -15.40, changePercent: -0.40 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1650.00, change: 12.80, changePercent: 0.78 },
  { symbol: "INFY", name: "Infosys Ltd.", price: 1510.55, change: -5.90, changePercent: -0.39 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", price: 1125.30, change: 25.15, changePercent: 2.29 },
  { symbol: "SBIN", name: "State Bank of India", price: 830.90, change: -2.10, changePercent: -0.25 },
];

interface PortfolioState {
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
}

const calculatePortfolioMetrics = (portfolio: PortfolioItem[]) => {
  let totalValue = 0;
  let totalInvestment = 0;
  let dayChange = 0;

  portfolio.forEach(item => {
    totalValue += item.stock.price * item.shares;
    totalInvestment += item.avgPrice * item.shares;
    dayChange += item.stock.change * item.shares;
  });

  const pnl = totalValue - totalInvestment;
  const dayChangePercent = totalInvestment > 0 ? (dayChange / totalInvestment) * 100 : 0;

  return { totalValue, totalInvestment, pnl, dayChange, dayChangePercent };
};

const createPortfolioStore = () =>
  createStore<PortfolioState>((set, get) => ({
    portfolio: [
        {
            stock: mockStocks.find(s => s.symbol === 'RELIANCE')!,
            shares: 2,
            avgPrice: 2800.00,
        },
        {
            stock: mockStocks.find(s => s.symbol === 'HDFCBANK')!,
            shares: 4,
            avgPrice: 1600.00,
        },
    ],
    virtualBalance: 1000000,
    riskScore: 68,
    ...calculatePortfolioMetrics([
        { stock: mockStocks.find(s => s.symbol === 'RELIANCE')!, shares: 2, avgPrice: 2800.00 },
        { stock: mockStocks.find(s => s.symbol === 'HDFCBANK')!, shares: 4, avgPrice: 1600.00 },
    ]),
    buyStock: (stock, shares) => {
        const cost = stock.price * shares;
        if (get().virtualBalance < cost) {
            throw new Error("Insufficient funds to complete this transaction.");
        }

        const newPortfolio = [...get().portfolio];
        const existingItemIndex = newPortfolio.findIndex(item => item.stock.symbol === stock.symbol);

        if (existingItemIndex > -1) {
            const existingItem = newPortfolio[existingItemIndex];
            const totalShares = existingItem.shares + shares;
            const newAvgPrice = ((existingItem.avgPrice * existingItem.shares) + (stock.price * shares)) / totalShares;
            newPortfolio[existingItemIndex] = { ...existingItem, shares: totalShares, avgPrice: newAvgPrice };
        } else {
            newPortfolio.push({ stock, shares, avgPrice: stock.price });
        }
        
        set(state => ({
            portfolio: newPortfolio,
            virtualBalance: state.virtualBalance - cost,
            ...calculatePortfolioMetrics(newPortfolio)
        }));
    },
    sellStock: (stock, shares) => {
        const newPortfolio = [...get().portfolio];
        const existingItemIndex = newPortfolio.findIndex(item => item.stock.symbol === stock.symbol);
        
        if (existingItemIndex === -1) {
            throw new Error("You do not own this stock.");
        }
        
        const existingItem = newPortfolio[existingItemIndex];

        if (existingItem.shares < shares) {
            throw new Error(`You only own ${existingItem.shares} shares.`);
        }

        const income = stock.price * shares;

        if (existingItem.shares === shares) {
            newPortfolio.splice(existingItemIndex, 1);
        } else {
            newPortfolio[existingItemIndex] = { ...existingItem, shares: existingItem.shares - shares };
        }
        
        set(state => ({
            portfolio: newPortfolio,
            virtualBalance: state.virtualBalance + income,
            ...calculatePortfolioMetrics(newPortfolio)
        }));
    },
    setRiskScore: (score: number) => set({ riskScore: score }),
}));

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
