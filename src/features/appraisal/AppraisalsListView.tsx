import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useAppraisals, useCreateAppraisal } from './useAppraisals';

const statusStyles: Record<string, string> = {
  draft: 'bg-fog/20 text-fog',
  in_progress: 'bg-gold-tint text-ink',
  review: 'bg-sage-tint text-ink',
  completed: 'bg-sage text-white',
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

export function AppraisalsListView() {
  const { data: appraisals, isLoading, error } = useAppraisals();
  const createAppraisal = useCreateAppraisal();
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-fog">Loading appraisals...</p>
      </div>
    );
  }

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
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-[22px] font-medium text-ink">Appraisals</h1>
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

      {/* Empty state */}
      {(!appraisals || appraisals.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-fog/20 bg-white py-20">
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
      )}

      {/* Table */}
      {appraisals && appraisals.length > 0 && (
        <div className="overflow-hidden rounded-[12px] border border-fog/20 bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-parchment">
                <th className="px-4 py-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-medium tracking-[0.12em] uppercase text-fog">
                  Last updated
                </th>
              </tr>
            </thead>
            <tbody>
              {appraisals.map((appraisal) => (
                <tr
                  key={appraisal.id}
                  className="border-b border-fog/10 last:border-0 hover:bg-parchment/50"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/appraisals/${appraisal.id}`)}
                      className="font-medium text-ink hover:underline"
                    >
                      {appraisal.property_address || 'Untitled'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-fog">
                    {appraisal.client_name || '\u2014'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusStyles[appraisal.status] ?? statusStyles.draft
                      }`}
                    >
                      {statusLabel(appraisal.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-fog">
                    {appraisal.updated_at
                      ? format(new Date(appraisal.updated_at), 'MMM d, yyyy')
                      : '\u2014'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
