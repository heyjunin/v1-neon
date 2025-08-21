import { Outlet } from 'react-router-dom'
import { InstallPrompt, OfflineIndicator, UpdatePrompt } from '../pwa'
import { Footer } from './footer'
import { Header } from './header'

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      
      {/* PWA Components */}
      <InstallPrompt />
      <UpdatePrompt />
      <OfflineIndicator />
    </div>
  )
}
