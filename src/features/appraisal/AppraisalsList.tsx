import { formatDistanceToNow } from 'date-fns';
import { FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Appraisal {
  id: string;
  property_address: string | null;
  status: string;
  updated_at: string;
}

interface Props {
  appraisals: Appraisal[];
}

const statusStyles: Record<string, string> = {
  draft: 'bg-fog/20 text-fog',
  in_progress: 'bg-gold-tint text-ink',
  review: 'bg-sage-tint text-ink',
  completed: 'bg-sage text-white',
};

function statusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

export function AppraisalsList({ appraisals }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  if (appraisals.length === 0) {
    return (
      <p className="px-3 py-2 text-sm text-fog">No appraisals yet</p>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {appraisals.map((appraisal) => {
        const isActive = location.pathname.includes(appraisal.id);
        const pillClass = statusStyles[appraisal.status] ?? statusStyles.draft;

        return (
          <button
            key={appraisal.id}
            type="button"
            onClick={() => navigate(`/appraisals/${appraisal.id}`)}
            className={`flex items-start gap-2.5 w-full rounded-[8px] px-3 py-2.5 text-left transition-colors ${
              isActive ? 'bg-parchment' : 'hover:bg-parchment/50'
            }`}
          >
            <FileText size={16} className="mt-0.5 shrink-0 text-fog" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {appraisal.property_address || 'Untitled appraisal'}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium leading-tight ${pillClass}`}
                >
                  {statusLabel(appraisal.status)}
                </span>
                <span className="text-[11px] text-fog">
                  {formatDistanceToNow(new Date(appraisal.updated_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
