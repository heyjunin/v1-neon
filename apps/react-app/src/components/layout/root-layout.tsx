import { Outlet } from 'react-router-dom'
import { DevPanel } from '../dev-tools'
import { ErrorBoundary } from '../error-boundary'
import { InstallPrompt, OfflineIndicator, UpdatePrompt } from '../pwa'
import { Footer } from './footer'
import { Header } from './header'

export function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
        
        {/* PWA Components */}
        <InstallPrompt />
        <UpdatePrompt />
        <OfflineIndicator />
        
        {/* Dev Tools (apenas em desenvolvimento) */}
        <DevPanel />
      </div>
    </ErrorBoundary>
  )
}
