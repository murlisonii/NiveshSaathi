"use client";

import { useState } from 'react';
import type { QuizQuestion } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface QuizProps {
  questions: QuizQuestion[];
}

export function Quiz({ questions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

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
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="text-center space-y-4 p-8">
        <h3 className="text-2xl font-bold">Quiz Complete!</h3>
        <p className="text-lg">Your score: <span className="font-bold text-primary">{score} / {questions.length}</span></p>
        <Button onClick={handleRestart}>Try Again</Button>
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
