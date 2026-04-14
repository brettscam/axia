import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AppraisalProgress } from '@/components/ui/AppraisalProgress';
import { CompsTable } from '@/features/comps/CompsTable';
import { useAppraisal } from '@/features/appraisal/useAppraisal';

/* -------------------------------------------------------------------------- */
/*  Subject summary                                                            */
/* -------------------------------------------------------------------------- */

interface SubjectSummaryProps {
  address: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lot: number | null;
}

function SubjectSummary({ address, beds, baths, sqft, lot }: SubjectSummaryProps) {
  return (
    <div className="rounded-[12px] border border-fog/20 bg-white p-5">
      <h2 className="font-display text-base font-medium text-ink">
        Subject property
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate">
        <span>{address || 'No address entered'}</span>
        {beds != null && baths != null && (
          <>
            <span className="text-fog">|</span>
            <span>{beds}bd / {baths}ba</span>
          </>
        )}
        {sqft != null && (
          <>
            <span className="text-fog">|</span>
            <span className="font-mono">{sqft.toLocaleString('en-US')} sqft</span>
          </>
        )}
        {lot != null && (
          <>
            <span className="text-fog">|</span>
            <span className="font-mono">{lot} acres</span>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CompSelectionPage                                                          */
/* -------------------------------------------------------------------------- */

export function CompSelectionPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: appraisal, isLoading, error } = useAppraisal(id ?? '');

  // No appraisal ID in URL
  if (!id) {
    return (
      <div>
        <AppraisalProgress currentStep={2} />
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-fog/20 bg-white py-16">
          <p className="text-fog">Select an appraisal from the dashboard to get started.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <AppraisalProgress currentStep={2} />
        <div className="flex items-center justify-center h-64">
          <p className="text-fog">Loading appraisal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AppraisalProgress currentStep={2} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-flag font-medium">Failed to load appraisal</p>
            <p className="text-fog text-sm mt-2">
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
      <SubjectSummary
        address={appraisal?.property_address ?? ''}
        beds={appraisal?.bedrooms ?? null}
        baths={appraisal?.bathrooms ?? null}
        sqft={appraisal?.gla ?? null}
        lot={appraisal?.lot_size ?? null}
      />

      {/* Comps table */}
      <CompsTable />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigate(`/property/${id}`)}
          className="flex items-center gap-1.5 rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-slate transition-colors hover:bg-parchment"
        >
          <ArrowLeft size={16} />
          Back to property
        </button>
        <button
          type="button"
          onClick={() => navigate(`/adjustments/${id}`)}
          className="flex items-center gap-1.5 rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate"
        >
          Continue to adjustments
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
