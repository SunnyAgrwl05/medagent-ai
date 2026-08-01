import { currentUser } from "@clerk/nextjs/server";
import { Topbar } from "@/components/dashboard/topbar";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { HealthChart } from "@/components/dashboard/health-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AgentQuickLaunch } from "@/components/dashboard/agent-quick-launch";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <>
      <Topbar title="Overview" />
      <main className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Welcome back, {firstName} 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s a snapshot of your health activity and quick access to
            every agent.
          </p>
        </div>

        <StatsGrid />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HealthChart />
          </div>
          <ActivityFeed />
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-semibold">
            Jump into an agent
          </h3>
          <AgentQuickLaunch />
        </div>
      </main>
    </>
  );
}
