import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz } from "@/components/learn/quiz";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { QuizQuestion } from "@/lib/types";
import { BookOpen, BrainCircuit, BarChart, ShieldCheck } from 'lucide-react';

const modulesData: { [key: string]: any } = {
  'stock-market-basics': {
    title: 'Stock Market Basics',
    level: 'Beginner',
    icon: BookOpen,
    content: "The stock market is a collection of markets where you can buy and sell shares of publicly listed companies. It's a way for companies to raise money and for investors to own a piece of those companies, potentially growing their wealth. Key concepts include stocks (equity), bonds (debt), indices (like Nifty 50 or Sensex), and exchanges (like NSE and BSE). Understanding these fundamentals is the first step towards making informed investment decisions.",
    image: {
      src: "https://picsum.photos/800/400",
      hint: "stock market charts"
    },
    quiz: [
      {
        question: "What does 'stock' represent?",
        options: ["A loan to a company", "Ownership in a company", "A government bond", "A type of currency"],
        correctAnswer: "Ownership in a company",
        scenario: "You buy one stock of 'Reliance Industries'."
      }
    ]
  },
  'risk-assessment': {
    title: 'Risk Assessment Techniques',
    level: 'Beginner',
    icon: ShieldCheck,
    content: "Every investment carries some level of risk. Risk assessment is the process of identifying and evaluating these risks. Key metrics include standard deviation (volatility), beta (market risk), and the Sharpe ratio (risk-adjusted return). A diversified portfolio can help mitigate risk, but it's crucial to align your investments with your personal risk tolerance—how much you're willing to potentially lose in pursuit of gains.",
    image: {
      src: "https://picsum.photos/800/400",
      hint: "risk balance"
    },
    quiz: [
      {
        question: "What would you do if a stock you own drops 10%?",
        options: ["Sell immediately", "Buy more (average down)", "Hold and wait", "Re-evaluate the company's fundamentals"],
        correctAnswer: "Re-evaluate the company's fundamentals",
        scenario: "Your portfolio is down for the day."
      }
    ]
  },
  'portfolio-diversification': {
    title: 'Portfolio Diversification',
    level: 'Intermediate',
    icon: BarChart,
    content: "Diversification means not putting all your eggs in one basket. By spreading investments across various asset classes (stocks, bonds, gold), sectors (IT, banking, pharma), and geographies, you can reduce the impact of poor performance in any single area. A well-diversified portfolio is designed to smooth out returns and lower overall volatility over the long term.",
    image: {
      src: "https://picsum.photos/800/400",
      hint: "diverse assets"
    },
    quiz: [
      {
        question: "Which portfolio is the most diversified?",
        options: ["100% in Tech stocks", "50% Tech, 50% Banking stocks", "Stocks, Bonds, and Gold", "Only Indian stocks"],
        correctAnswer: "Stocks, Bonds, and Gold",
        scenario: "You have ₹1,00,000 to invest."
      }
    ]
  },
   'algo-trading': {
    title: 'Intro to Algorithmic Trading',
    level: 'Advanced',
    icon: BrainCircuit,
    content: "Algorithmic trading uses computer programs to execute trades at high speeds based on pre-defined criteria. High-Frequency Trading (HFT) is a type of algo trading that involves executing a large number of orders in fractions of a second. These strategies often rely on complex mathematical models and can capitalize on small, short-term market inefficiencies.",
     image: {
      src: "https://picsum.photos/800/400",
      hint: "data network"
    },
    quiz: [
      {
        question: "What is the primary advantage of algorithmic trading?",
        options: ["Emotion-free decision making", "High-speed execution", "Ability to backtest strategies", "All of the above"],
        correctAnswer: "All of the above",
      }
    ]
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const module = modulesData[params.slug] || { title: 'Module not found' };
  return {
    title: `${module.title} - Nivesh Saathi`,
  };
}

export default function ModulePage({ params }: { params: { slug: string } }) {
  const module = modulesData[params.slug];

  if (!module) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Module not found</h1>
        <Link href="/learn" className="text-primary hover:underline mt-4 inline-block">
          Back to Learning Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link href="/learn" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Hub
      </Link>
      
      <article className="space-y-8">
        <header className="space-y-4">
          <Badge variant="outline">{module.level}</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-primary">{module.title}</h1>
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={module.image.src}
              alt={module.title}
              data-ai-hint={module.image.hint}
              fill
              className="object-cover"
            />
          </div>
        </header>

        <Card className="bg-white/50 dark:bg-black/50 border-transparent">
          <CardContent className="p-6">
            <div className="prose prose-lg max-w-none text-foreground">
              <p>{module.content}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-black/50 border-transparent shadow-lg">
          <CardHeader>
            <CardTitle>Test Your Knowledge</CardTitle>
          </CardHeader>
          <CardContent>
            <Quiz questions={module.quiz as QuizQuestion[]} />
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
