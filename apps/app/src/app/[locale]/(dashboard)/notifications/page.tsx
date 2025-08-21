import { ProtectedRoute } from '@/components/auth';
import { Navbar } from '@/components/layout/navbar';
import { NotificationsPage } from '@/components/notifications/notifications-page';

export const metadata = {
  title: 'Notifications',
};

export default function NotificationsPageWrapper() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        <NotificationsPage />
      </div>
    </ProtectedRoute>
  );
}
