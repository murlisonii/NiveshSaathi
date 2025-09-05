import { ModuleCard } from '@/components/learn/module-card';
import type { LearningModule } from '@/lib/types';
import { BookOpen, BrainCircuit, BarChart, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn - Nivesh Saathi',
  description: 'Explore interactive learning modules on investing.',
};


const modules: LearningModule[] = [
  {
    id: '1',
    slug: 'stock-market-basics',
    title: 'Stock Market Basics',
    description: 'Understand what stocks are, how the market works, and key terminology.',
    level: 'Beginner',
    category: 'Fundamentals',
    icon: BookOpen,
  },
  {
    id: '2',
    slug: 'risk-assessment',
    title: 'Risk Assessment Techniques',
    description: 'Learn to evaluate investment risks and manage your risk tolerance.',
    level: 'Beginner',
    category: 'Analysis',
    icon: ShieldCheck,
  },
  {
    id: '3',
    slug: 'portfolio-diversification',
    title: 'Portfolio Diversification',
    description: 'Discover why diversification is key to a healthy investment portfolio.',
    level: 'Intermediate',
    category: 'Strategy',
    icon: BarChart,
  },
  {
    id: '4',
    slug: 'algo-trading',
    title: 'Intro to Algorithmic Trading',
    description: 'Get a high-level overview of automated trading systems and HFT.',
    level: 'Advanced',
    category: 'Technology',
    icon: BrainCircuit,
  },
   {
    id: '5',
    slug: 'behavioral-finance',
    title: 'Behavioral Finance',
    description: 'Explore the psychological biases that affect investment decisions.',
    level: 'Intermediate',
    category: 'Psychology',
    icon: BrainCircuit,
  },
  {
    id: '6',
    slug: 'mutual-funds',
    title: 'Understanding Mutual Funds',
    description: 'A deep dive into mutual funds, ETFs, and other investment vehicles.',
    level: 'Beginner',
    category: 'Products',
    icon: BookOpen,
  }
];

export default function LearnPage() {
  const beginnerModules = modules.filter(m => m.level === 'Beginner');
  const intermediateModules = modules.filter(m => m.level === 'Intermediate');
  const advancedModules = modules.filter(m => m.level === 'Advanced');

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-12">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Learning Hub</h1>
        <p className="text-lg text-muted-foreground">
          Your comprehensive guide to mastering the world of investments.
        </p>
      </header>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-accent pl-4">Beginner</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beginnerModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-accent pl-4">Intermediate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {intermediateModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 border-l-4 border-accent pl-4">Advanced</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advancedModules.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>
    </div>
  );
}
