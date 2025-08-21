import { DashboardNavbar } from "@/components/dashboard/navbar";
import { OnboardingWrapper } from "@/components/onboarding/onboarding-wrapper";
import { OrganizationProvider } from "@/contexts/organization-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <OrganizationProvider>
      <OnboardingWrapper>
        <div className="min-h-screen bg-background">
          <DashboardNavbar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </OnboardingWrapper>
    </OrganizationProvider>
  );
}
