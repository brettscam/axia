import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus, LogOut, LayoutDashboard, Home, Search, SlidersHorizontal, FileText } from 'lucide-react';
import { Logo } from '@/brand';
import { useAuth } from '@/features/auth/useAuth';
import { useAppraisals, useCreateAppraisal } from '@/features/appraisal/useAppraisals';
import { AppraisalsList } from '@/features/appraisal/AppraisalsList';
import { NewAppraisalModal } from '@/features/appraisal/NewAppraisalModal';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/property', label: 'Property input', icon: Home },
  { path: '/comps', label: 'Comp selection', icon: Search },
  { path: '/adjustments', label: 'Adjustments', icon: SlidersHorizontal },
  { path: '/report', label: 'Reports', icon: FileText },
];

export function AppShell() {
  const { user, signOut } = useAuth();
  const { data: appraisals } = useAppraisals();
  const createAppraisal = useCreateAppraisal();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleCreate(data: { property_address: string; client_name: string }) {
    createAppraisal.mutate(data, {
      onSuccess: () => setModalOpen(false),
    });
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-fog/20 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-2.5 p-5">
          <Logo size={28} />
          <span className="font-display text-lg font-medium text-ink">
            Axia
          </span>
        </div>

        {/* Main nav */}
        <div className="px-3 pb-3">
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-parchment font-medium text-ink'
                      : 'text-fog hover:bg-parchment/50 hover:text-ink'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Divider */}
        <div className="mx-3 border-t border-fog/10" />

        {/* Appraisals section */}
        <div className="flex-1 overflow-y-auto px-3 pt-3">
          <div className="flex items-center justify-between px-1 pb-2">
            <h2 className="text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
              Appraisals
            </h2>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-[6px] p-1 text-fog transition-colors hover:bg-parchment hover:text-ink"
              aria-label="New appraisal"
            >
              <Plus size={16} />
            </button>
          </div>

          <AppraisalsList appraisals={appraisals ?? []} />
        </div>

        {/* User section */}
        <div className="border-t border-fog/20 p-4">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm text-slate">
              {user?.email ?? 'Not signed in'}
            </span>
            <button
              type="button"
              onClick={() => void signOut()}
              className="shrink-0 rounded-[6px] p-1.5 text-fog transition-colors hover:bg-parchment hover:text-ink"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-parchment p-6">
        <Outlet />
      </main>

      {/* New appraisal modal */}
      <NewAppraisalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
