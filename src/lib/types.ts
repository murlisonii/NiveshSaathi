export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface PortfolioItem {
  stock: Stock;
  shares: number;
  avgPrice: number;
}

export interface LearningModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  scenario?: string;
};
