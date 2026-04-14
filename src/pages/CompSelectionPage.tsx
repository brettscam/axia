import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AppraisalProgress } from '@/components/ui/AppraisalProgress';
import { CompsTable } from '@/features/comps/CompsTable';

/* -------------------------------------------------------------------------- */
/*  Subject summary placeholder                                                */
/* -------------------------------------------------------------------------- */

function SubjectSummary() {
  // In production this would come from appraisal state / localStorage.
  // Using placeholder values for now.
  const subject = {
    address: '100 Main St, San Francisco, CA 94105',
    beds: 3,
    baths: 2,
    sqft: 1_900,
    lot: 0.12,
  };

  return (
    <div className="rounded-[12px] border border-fog/20 bg-white p-5">
      <h2 className="font-display text-base font-medium text-ink">
        Subject property
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate">
        <span>{subject.address}</span>
        <span className="text-fog">|</span>
        <span>{subject.beds}bd / {subject.baths}ba</span>
        <span className="text-fog">|</span>
        <span className="font-mono">{subject.sqft.toLocaleString('en-US')} sqft</span>
        <span className="text-fog">|</span>
        <span className="font-mono">{subject.lot} acres</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CompSelectionPage                                                          */
/* -------------------------------------------------------------------------- */

export function CompSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <AppraisalProgress currentStep={2} />

      {/* Page heading */}
      <div>
        <h1 className="font-display text-[22px] font-medium text-ink">
          Comparable properties
        </h1>
        <p className="mt-1 text-sm text-fog">
          Review and select comparable sales to include in your appraisal.
        </p>
      </div>

      {/* Subject summary */}
      <SubjectSummary />

      {/* Comps table */}
      <CompsTable />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-slate transition-colors hover:bg-parchment"
        >
          <ArrowLeft size={16} />
          Back to property
        </button>
        <button
          type="button"
          onClick={() => navigate('/adjustments')}
          className="flex items-center gap-1.5 rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate"
        >
          Continue to adjustments
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
