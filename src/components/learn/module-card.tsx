import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LearningModule } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface ModuleCardProps {
  module: LearningModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const { title, description, level, category, slug, icon: Icon } = module;
  
  const levelColor = {
    Beginner: 'bg-green-100 text-green-800 border-green-200',
    Intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Advanced: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Link href={`/learn/${slug}`} passHref>
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <Badge variant="outline" className={levelColor[level]}>{level}</Badge>
          </div>
          <CardTitle className="pt-4">{title}</CardTitle>
          <Badge variant="secondary">{category}</Badge>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <CardDescription>{description}</CardDescription>
          <div className="flex items-center justify-end mt-4 text-sm font-semibold text-primary">
            Start Learning <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
