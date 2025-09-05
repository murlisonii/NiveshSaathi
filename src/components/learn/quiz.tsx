"use client";

import { useState, useEffect, useTransition } from 'react';
import type { QuizQuestion } from '@/lib/types';
import { generateQuizForFinancialTopic } from '@/ai/flows/generate-quiz-for-financial-topic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface QuizProps {
  topicTitle: string;
  topicContent: string;
}

export function Quiz({ topicTitle, topicContent }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isPending, startTransition] = useTransition();

  const fetchQuiz = () => {
    startTransition(async () => {
      const quizData = await generateQuizForFinancialTopic({
        topicTitle: topicTitle,
        topicContent: topicContent,
      });
      setQuestions(quizData.questions as QuizQuestion[]);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
    });
  };

  useEffect(() => {
    fetchQuiz();
  }, [topicTitle, topicContent]);

  if (isPending && questions.length === 0) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>Could not load quiz.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };
  
  const handleRestart = () => {
    setQuestions([]);
    fetchQuiz();
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="text-center space-y-4 p-8">
        <h3 className="text-2xl font-bold">Quiz Complete!</h3>
        <p className="text-lg">Your score: <span className="font-bold text-primary">{score} / {questions.length}</span></p>
        <Button onClick={handleRestart} disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {currentQuestion.scenario && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-primary text-center">
              Scenario: {currentQuestion.scenario}
            </p>
          </CardContent>
        </Card>
      )}
      <h3 className="text-xl font-semibold">
        {`Q${currentQuestionIndex + 1}: ${currentQuestion.question}`}
      </h3>
      <div className="space-y-3">
        {currentQuestion.options.map((option) => {
          const isCorrect = option === currentQuestion.correctAnswer;
          const isSelected = option === selectedOption;
          let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'outline';
          let icon = null;

          if (isAnswered) {
            if (isCorrect) {
              variant = 'default';
              icon = <Check className="w-4 h-4" />;
            } else if (isSelected) {
              variant = 'destructive';
              icon = <X className="w-4 h-4" />;
            }
          } else if (isSelected) {
            variant = 'secondary';
          }

          return (
            <Button
              key={option}
              variant={variant}
              className={`w-full justify-start h-auto py-3 text-left ${isSelected ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleOptionSelect(option)}
              disabled={isAnswered}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option}</span>
                {icon}
              </div>
            </Button>
          );
        })}
      </div>
      <div className="flex justify-end pt-4">
        {!isAnswered ? (
          <Button onClick={handleSubmit} disabled={!selectedOption}>
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  );
}
