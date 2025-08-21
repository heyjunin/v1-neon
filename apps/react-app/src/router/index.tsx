import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layout/root-layout'
import { HomePage } from '@/pages/home'
import { DashboardPage } from '@/pages/dashboard'
import { PostsPage } from '@/pages/posts'
import { PostDetailPage } from '@/pages/posts/post-detail'
import { ProfilePage } from '@/pages/profile'
import { NotFoundPage } from '@/pages/not-found'

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
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
