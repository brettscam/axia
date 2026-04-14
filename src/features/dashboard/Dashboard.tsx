import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Search,
  Calculator,
  BarChart3,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useAppraisals, useCreateAppraisal } from '@/features/appraisal/useAppraisals';
import { useAuth } from '@/features/auth/useAuth';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeDirection: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
}

interface AppraisalCardProps {
  id: string;
  address: string;
  status: string;
  updatedAt: string | null;
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const statusStyles: Record<string, string> = {
  draft: 'bg-fog/20 text-fog',
  in_progress: 'bg-gold-tint text-ink',
  review: 'bg-sage-tint text-ink',
  completed: 'bg-sage text-white',
};

const statusProgress: Record<string, number> = {
  draft: 25,
  in_progress: 50,
  review: 75,
  completed: 100,
};

function statusLabel(status: string): string {
  switch (status) {
    case 'in_progress':
      return 'In progress';
    case 'review':
      return 'Review';
    case 'completed':
      return 'Completed';
    default:
      return 'Draft';
  }
}

/* -------------------------------------------------------------------------- */
/*  StatCard                                                                   */
/* -------------------------------------------------------------------------- */

function StatCard({ title, value, change, changeDirection, icon }: StatCardProps) {
  const changeColor =
    changeDirection === 'positive'
      ? 'text-sage'
      : changeDirection === 'negative'
        ? 'text-flag'
        : 'text-fog';

  return (
    <div className="rounded-[12px] border border-fog/20 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-fog">{title}</p>
          <p className="mt-1 font-mono text-2xl font-medium text-ink">{value}</p>
          <p className={`mt-1 text-xs font-medium ${changeColor}`}>{change}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/10">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  AppraisalCard                                                              */
/* -------------------------------------------------------------------------- */

function AppraisalCard({ id, address, status, updatedAt }: AppraisalCardProps) {
  const navigate = useNavigate();
  const progress = statusProgress[status] ?? 25;

  return (
    <button
      type="button"
      onClick={() => navigate(`/appraisals/${id}`)}
      className="w-full rounded-[12px] border border-fog/20 bg-white p-5 text-left transition-colors hover:bg-parchment"
    >
      <p className="font-display text-base font-medium text-ink">
        {address || 'Untitled'}
      </p>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-ink/10">
        <div
          className="h-1.5 rounded-full bg-ink transition-all"
          style={{ width: `${String(progress)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusStyles[status] ?? statusStyles.draft
          }`}
        >
          {statusLabel(status)}
        </span>
        <span className="text-xs text-fog">
          {updatedAt ? format(new Date(updatedAt), 'MMM d, yyyy') : '\u2014'}
        </span>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  ActionCard                                                                 */
/* -------------------------------------------------------------------------- */

function ActionCard({ title, description, icon, to }: ActionCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="flex w-full items-start gap-4 rounded-[12px] border border-fog/20 bg-white p-5 text-left transition-colors hover:bg-parchment"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/10">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-0.5 text-xs text-fog">{description}</p>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Dashboard                                                                  */
/* -------------------------------------------------------------------------- */

export function Dashboard() {
  const { data: appraisals, isLoading, error } = useAppraisals();
  const createAppraisal = useCreateAppraisal();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);

  const displayName = user?.email ?? 'there';

  /* Computed stats */
  const activeCount = appraisals?.filter((a) => a.status !== 'completed').length ?? 0;
  const completedCount = appraisals?.filter((a) => a.status === 'completed').length ?? 0;
  const recentAppraisals = appraisals?.slice(0, 3) ?? [];

  function handleNewAppraisal() {
    createAppraisal.mutate(
      { property_address: '', client_name: '' },
      {
        onSuccess: (data) => {
          navigate(`/appraisals/${data.id}`);
        },
      },
    );
  }

  /* Loading state */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Loading dashboard...</p>
      </div>
    );
  }

  /* Error state */
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="font-medium text-flag">Failed to load appraisals</p>
          <p className="mt-2 text-sm text-fog">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[22px] font-medium text-ink">Welcome back</h1>
          <p className="mt-0.5 text-sm text-fog">{displayName}</p>
        </div>
        <button
          type="button"
          onClick={handleNewAppraisal}
          disabled={createAppraisal.isPending}
          className="flex items-center gap-1.5 rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate disabled:opacity-50"
        >
          <Plus size={16} />
          <span>New appraisal</span>
        </button>
      </div>

      {/* Section 2: Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active appraisals"
          value={String(activeCount)}
          change="Current workload"
          changeDirection="neutral"
          icon={<FileText size={18} className="text-ink" />}
        />
        <StatCard
          title="Completed"
          value={String(completedCount)}
          change="All time"
          changeDirection="neutral"
          icon={<CheckCircle2 size={18} className="text-ink" />}
        />
        <StatCard
          title="Avg. completion time"
          value="2.4 days"
          change="-0.3 days from last month"
          changeDirection="positive"
          icon={<Clock size={18} className="text-ink" />}
        />
        <StatCard
          title="Market trend"
          value="+3.2%"
          change="Last 30 days"
          changeDirection="positive"
          icon={<TrendingUp size={18} className="text-ink" />}
        />
      </div>

      {/* Section 3: Recent appraisals */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-medium text-ink">Recent appraisals</h2>
          {appraisals && appraisals.length > 3 && (
            <button
              type="button"
              onClick={() => navigate('/appraisals')}
              className="flex items-center gap-1 text-sm font-medium text-fog transition-colors hover:text-ink"
            >
              View all
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>

        {recentAppraisals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[12px] border border-fog/20 bg-white py-16">
            <p className="mb-4 text-fog">No appraisals yet. Create your first one.</p>
            <button
              type="button"
              onClick={handleNewAppraisal}
              disabled={createAppraisal.isPending}
              className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate disabled:opacity-50"
            >
              New appraisal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentAppraisals.map((appraisal) => (
              <AppraisalCard
                key={appraisal.id}
                id={appraisal.id}
                address={appraisal.property_address}
                status={appraisal.status}
                updatedAt={appraisal.updated_at}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Quick actions */}
      <div>
        <h2 className="mb-4 font-display text-lg font-medium text-ink">Quick actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ActionCard
            title="Property input"
            description="Enter subject property details"
            icon={<Search size={18} className="text-ink" />}
            to="/property"
          />
          <ActionCard
            title="Comp selection"
            description="Find and select comparable sales"
            icon={<FileText size={18} className="text-ink" />}
            to="/comps"
          />
          <ActionCard
            title="Adjustments"
            description="Review and apply comp adjustments"
            icon={<Calculator size={18} className="text-ink" />}
            to="/adjustments"
          />
          <ActionCard
            title="Market analysis"
            description="Analyze local market conditions"
            icon={<BarChart3 size={18} className="text-ink" />}
            to="/analysis"
          />
        </div>
      </div>
    </div>
  );
}
