import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppraisalProgress } from '@/components/ui/AppraisalProgress';
import { useAppraisal } from '@/features/appraisal/useAppraisal';

export function ReportsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: appraisal, isLoading, error } = useAppraisal(id ?? '');
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // No appraisal ID in URL
  if (!id) {
    return (
      <div>
        <AppraisalProgress currentStep={4} />
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

  // Loading
  if (isLoading) {
    return (
      <div>
        <AppraisalProgress currentStep={4} />
        <div className="flex items-center justify-center h-64">
          <p className="text-fog">Loading report...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div>
        <AppraisalProgress currentStep={4} />
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

  const address = appraisal?.property_address || 'No address entered';
  const details = [
    appraisal?.property_type
      ? appraisal.property_type.replace('_', ' ')
      : null,
    appraisal?.bedrooms != null ? `${String(appraisal.bedrooms)} bed` : null,
    appraisal?.bathrooms != null ? `${String(appraisal.bathrooms)} bath` : null,
    appraisal?.gla != null ? `${String(appraisal.gla)} sq ft` : null,
    appraisal?.year_built != null ? `Built ${String(appraisal.year_built)}` : null,
  ]
    .filter(Boolean)
    .join('  /  ');

  return (
    <div>
      <AppraisalProgress currentStep={4} />

      <h1 className="font-display text-[22px] font-medium text-ink mb-6">
        Final report
      </h1>

      {/* Summary card */}
      <div className="rounded-[12px] border border-fog/20 bg-white p-6 mb-6">
        <h2 className="font-display text-lg font-medium text-ink mb-4">
          Report summary
        </h2>

        <div className="space-y-3">
          {/* Subject address */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-fog">Subject property</p>
              <p className="text-sm font-medium text-ink mt-0.5">{address}</p>
              {details && (
                <p className="text-sm text-fog mt-0.5">{details}</p>
              )}
            </div>
          </div>

          {/* Comps */}
          <div>
            <p className="text-sm text-fog">Comparable sales</p>
            <p className="text-sm font-medium text-ink mt-0.5">
              3 comparable sales
            </p>
          </div>

          {/* Adjustments */}
          <div>
            <p className="text-sm text-fog">Adjustments</p>
            <p className="text-sm font-medium text-ink mt-0.5">
              Market adjustments applied
            </p>
          </div>
        </div>

        {/* Generate report button with tooltip */}
        <div className="mt-6 relative inline-block">
          <button
            type="button"
            disabled
            className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment opacity-50 cursor-not-allowed"
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            Generate report
          </button>
          {tooltipVisible && (
            <span className="absolute left-0 bottom-full mb-2 whitespace-nowrap rounded-[6px] bg-ink px-3 py-1.5 text-xs text-parchment">
              Coming in Phase 4
            </span>
          )}
        </div>
      </div>

      {/* Report preview area */}
      <div className="rounded-[12px] border border-fog/20 bg-white p-8 mb-6">
        <h2 className="font-display text-lg font-medium text-ink mb-4">
          Report preview
        </h2>
        <p className="text-sm text-fog">
          Report generation will use Claude to produce a full narrative appraisal document.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/adjustments/${id}`)}
          className="rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment"
        >
          Back to adjustments
        </button>
      </div>
    </div>
  );
}
