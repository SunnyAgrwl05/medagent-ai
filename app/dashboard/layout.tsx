import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-border/60 md:block">
        <div className="sticky top-0 h-screen overflow-y-auto scrollbar-thin">
          <Sidebar />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
