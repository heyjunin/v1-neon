import { ProtectedRoute } from '@/components/auth/protected-route'
import { RootLayout } from '@/components/layout/root-layout'
import { AuthCallbackPage } from '@/pages/auth/callback'
import { DashboardPage } from '@/pages/dashboard'
import { ExamplesPage } from '@/pages/examples'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import { NotFoundPage } from '@/pages/not-found'
import { PostsPage } from '@/pages/posts'
import { PostDetailPage } from '@/pages/posts/post-detail'
import { ProfilePage } from '@/pages/profile'
import { PWAPage } from '@/pages/pwa'
import { Route, Routes } from 'react-router-dom'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/:postId" element={<PostDetailPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="pwa" element={<PWAPage />} />
        <Route path="examples" element={<ExamplesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
