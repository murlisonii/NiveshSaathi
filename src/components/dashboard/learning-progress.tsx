import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import Link from "next/link";

const modules = [
  { name: "Stock Market Basics", status: "completed", href: "/learn/stock-market-basics" },
  { name: "Risk Assessment Techniques", status: "inprogress", href: "/learn/risk-assessment" },
  { name: "Introduction to Algorithmic Trading", status: "locked", href: "/learn/algo-trading" },
  { name: "Portfolio Diversification Strategies", status: "locked", href: "/learn/diversification" },
];

export function LearningProgress() {
  const completedModules = modules.filter(m => m.status === 'completed').length;
  const progressPercentage = (completedModules / modules.length) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'inprogress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <Card className="h-full shadow-md">
      <CardHeader>
        <CardTitle>Your Learning Path</CardTitle>
        <CardDescription>Continue your journey to becoming a savvy investor.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} aria-label={`${Math.round(progressPercentage)}% complete`} />
          </div>
          <div className="space-y-4">
            {modules.map((module) => (
              <Link href={module.status !== 'locked' ? module.href : '#'} key={module.name} passHref>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    module.status !== 'locked'
                      ? 'cursor-pointer hover:bg-muted'
                      : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(module.status)}
                    <span className="font-medium">{module.name}</span>
                  </div>
                  {module.status === 'inprogress' && <span className="text-xs font-semibold text-blue-500">CONTINUE</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
