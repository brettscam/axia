import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Plus, LogOut } from 'lucide-react';
import { Logo } from '@/brand';
import { useAuth } from '@/features/auth/useAuth';
import { useAppraisals, useCreateAppraisal } from '@/features/appraisal/useAppraisals';
import { AppraisalsList } from '@/features/appraisal/AppraisalsList';
import { NewAppraisalModal } from '@/features/appraisal/NewAppraisalModal';

export function AppShell() {
  const { user, signOut } = useAuth();
  const { data: appraisals } = useAppraisals();
  const createAppraisal = useCreateAppraisal();
  const [modalOpen, setModalOpen] = useState(false);

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

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3">
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
