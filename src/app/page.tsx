import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { LearningProgress } from "@/components/dashboard/learning-progress";
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <WelcomeBanner />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LearningProgress />
        </div>
        <div className="lg:col-span-1">
          <PortfolioOverview />
        </div>
      </div>
    </div>
  );
}
