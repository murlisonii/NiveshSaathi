import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function WelcomeBanner() {
  return (
    <Card className="overflow-hidden bg-primary text-primary-foreground shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:p-8 space-y-4 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold">Welcome to Nivesh Saathi!</h2>
            <p className="text-primary-foreground/80">
              Your journey to financial literacy starts here. Explore interactive modules, test your knowledge, and practice trading in a risk-free environment.
            </p>
            <div>
              <Link href="/learn">
                <Button variant="secondary">Start Learning</Button>
              </Link>
            </div>
          </div>
          <div className="relative md:w-1/2 h-48 md:h-auto">
             <Image
              src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmFwaHxlbnwwfHx8fDE3NTcwNzcyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Financial graph"
              data-ai-hint="financial graph"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
