
'use client';
import { PortfolioStoreProvider } from '@/hooks/use-portfolio-store';
import { AgentDashboard } from '@/components/agent/agent-dashboard';

export default function AgentPage() {
  return (
    <PortfolioStoreProvider>
      <div className="container mx-auto p-4 md:p-8">
        <AgentDashboard />
      </div>
    </PortfolioStoreProvider>
  );
}
