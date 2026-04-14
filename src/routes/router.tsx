import { createBrowserRouter } from 'react-router-dom';
import { AuthForm } from '@/features/auth/AuthForm';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { AppShell } from '@/components/ui/AppShell';
import { Dashboard } from '@/features/dashboard/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthForm />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'appraisals/:id',
            lazy: async () => {
              const { EditorPage } = await import('@/features/appraisal/EditorPage');
              return { Component: EditorPage };
            },
          },
        ],
      },
    ],
  },
]);
