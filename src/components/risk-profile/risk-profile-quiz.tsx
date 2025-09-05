
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, BarChart, TrendingUp, Leaf } from 'lucide-react';
import { usePortfolioStore } from '@/hooks/use-portfolio-store';

const quizQuestions = [
  {
    question: "What is your primary goal for this investment?",
    options: [
      { text: "Capital Preservation: I want to protect my initial investment.", value: 1 },
      { text: "Steady Growth: I'm looking for balanced growth with moderate risk.", value: 2 },
      { text: "High Returns: I'm aiming for maximum returns, and I'm comfortable with high risk.", value: 3 },
    ],
  },
  {
    question: "How would you react to a sudden 20% drop in your portfolio's value?",
    options: [
      { text: "Sell everything to prevent further loss.", value: 1 },
      { text: "Wait and see, but feel very anxious.", value: 2 },
      { text: "See it as a buying opportunity and invest more.", value: 3 },
    ],
  },
  {
    question: "How long is your investment horizon?",
    options: [
      { text: "Short-term (Less than 3 years)", value: 1 },
      { text: "Medium-term (3-7 years)", value: 2 },
      { text: "Long-term (More than 7 years)", value: 3 },
    ],
  },
  {
    question: "Which of these investment options are you most comfortable with?",
    options:
    [
      { text: "Fixed Deposits and Government Bonds", value: 1 },
      { text: "A mix of Large-Cap Stocks and Mutual Funds", value: 2 },
      { text: "Small-Cap Stocks, Derivatives, and Algo-Trading", value: 3 },
    ]
  }
];

const personas = {
  conservative: {
    title: "Conservative Investor",
    icon: Leaf,
    description: "You prioritize capital protection over high returns. You are best suited for low-risk investments like bonds, fixed deposits, and large-cap mutual funds.",
    color: "text-green-600",
    riskScore: 35
  },
  moderate: {
    title: "Moderate Investor",
    icon: BarChart,
    description: "You seek a balance between risk and return. A diversified portfolio of equities, mutual funds, and some debt instruments would be a good fit for you.",
    color: "text-yellow-600",
    riskScore: 68
  },
  aggressive: {
    title: "Aggressive Investor",
    icon: TrendingUp,
    description: "You are comfortable with high risk for the potential of high returns. You might explore small-cap stocks, derivatives, and advanced trading strategies.",
    color: "text-red-600",
    riskScore: 85
  },
}

export function RiskProfileQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [persona, setPersona] = useState<keyof typeof personas | null>(null);
  const setRiskScore = usePortfolioStore((state) => state.setRiskScore);

  const progress = Math.round(((step) / quizQuestions.length) * 100);

  const handleNext = () => {
    if (selectedOption === null) return;
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
      setSelectedOption(null);
    } else {
      calculatePersona(newAnswers);
    }
  };

  const calculatePersona = (finalAnswers: number[]) => {
    const totalScore = finalAnswers.reduce((sum, val) => sum + val, 0);
    const avgScore = totalScore / finalAnswers.length;
    let newPersona: keyof typeof personas;

    if (avgScore <= 1.5) {
      newPersona = 'conservative';
    } else if (avgScore > 1.5 && avgScore <= 2.5) {
      newPersona = 'moderate';
    } else {
      newPersona = 'aggressive';
    }
    setPersona(newPersona);
    setRiskScore(personas[newPersona].riskScore);
  }

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setSelectedOption(null);
    setPersona(null);
  }

  if (persona) {
    const personaData = personas[persona];
    const Icon = personaData.icon;

    return (
      <Card className="max-w-2xl mx-auto text-center p-8">
        <CardContent className="space-y-6">
          <Icon className={`w-16 h-16 mx-auto ${personaData.color}`} />
          <h2 className="text-3xl font-bold">You are a {personaData.title}!</h2>
          <p className="text-muted-foreground text-lg">{personaData.description}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={handleRestart}>Retake Quiz</Button>
            <Button variant="outline" asChild>
              <a href="/learn">Explore Learning Modules</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = quizQuestions[step];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <Progress value={progress} className="mb-4" />
        <CardTitle>Question {step + 1}/{quizQuestions.length}</CardTitle>
        <CardDescription className="text-lg pt-2">{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(val) => setSelectedOption(Number(val))}
          className="space-y-3"
        >
          {currentQuestion.options.map((option) => (
            <Label key={option.value} htmlFor={option.text} className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-muted has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
              <RadioGroupItem value={option.value.toString()} id={option.text} className="mr-4" />
              <span>{option.text}</span>
            </Label>
          ))}
        </RadioGroup>
        <div className="flex justify-end">
          <Button onClick={handleNext} disabled={selectedOption === null}>
            {step === quizQuestions.length - 1 ? 'Finish & See Profile' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
