import { createBrowserRouter } from 'react-router-dom';
import { AuthForm } from '@/features/auth/AuthForm';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { AppShell } from '@/components/ui/AppShell';
import { Dashboard } from '@/features/dashboard/Dashboard';
import { PropertyInputPage } from '@/pages/PropertyInputPage';
import { CompSelectionPage } from '@/pages/CompSelectionPage';
import { AppraisalsListView } from '@/features/appraisal/AppraisalsListView';

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
            path: 'appraisals',
            element: <AppraisalsListView />,
          },
          {
            path: 'appraisals/:id',
            lazy: async () => {
              const { EditorPage } = await import('@/features/appraisal/EditorPage');
              return { Component: EditorPage };
            },
          },
          {
            path: 'property/:id?',
            element: <PropertyInputPage />,
          },
          {
            path: 'comps/:id?',
            element: <CompSelectionPage />,
          },
          {
            path: 'adjustments/:id?',
            lazy: async () => {
              const { AdjustmentsPage } = await import('@/pages/AdjustmentsPage');
              return { Component: AdjustmentsPage };
            },
          },
          {
            path: 'report/:id?',
            lazy: async () => {
              const { ReportBuilderPage } = await import('@/pages/ReportBuilderPage');
              return { Component: ReportBuilderPage };
            },
          },
        ],
      },
    ],
  },
]);
