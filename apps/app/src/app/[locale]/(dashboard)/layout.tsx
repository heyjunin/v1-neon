import { DashboardNavbar } from "@/components/dashboard/navbar";
import { OrganizationProvider } from "@/contexts/organization-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OrganizationProvider>
      <div className="min-h-screen bg-background">
        <DashboardNavbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </OrganizationProvider>
  );
}
