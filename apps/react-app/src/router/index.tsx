import { RootLayout } from '@/components/layout/root-layout'
import { DashboardPage } from '@/pages/dashboard'
import { ExamplesPage } from '@/pages/examples'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'
import { PostsPage } from '@/pages/posts'
import { PostDetailPage } from '@/pages/posts/post-detail'
import { ProfilePage } from '@/pages/profile'
import { PWAPage } from '@/pages/pwa'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'posts',
        element: <PostsPage />,
      },
      {
        path: 'posts/:postId',
        element: <PostDetailPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'pwa',
        element: <PWAPage />,
      },
      {
        path: 'examples',
        element: <ExamplesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
