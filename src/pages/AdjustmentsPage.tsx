import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AppraisalProgress } from '@/components/ui/AppraisalProgress';
import { AdjustmentConfig } from '@/features/adjustments/AdjustmentConfig';
import { AdjustmentGuide } from '@/features/adjustments/AdjustmentGuide';

export function AdjustmentsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // No appraisal ID in URL
  if (!id) {
    return (
      <div className="mx-auto max-w-6xl">
        <AppraisalProgress currentStep={3} />
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

  return (
    <div className="mx-auto max-w-6xl">
      <AppraisalProgress currentStep={3} />

      <h1 className="font-display text-xl font-medium text-ink">
        Adjustment calculator
      </h1>
      <p className="mt-1 text-sm text-fog">
        Configure market impact weights for your comp adjustments
      </p>

      {/* Two-column layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdjustmentConfig />
        </div>
        <div className="lg:col-span-1">
          <AdjustmentGuide />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/comps/${id}`)}
          className="flex items-center gap-1.5 rounded-[8px] border border-fog/20 bg-white px-4 py-2.5 text-sm text-slate transition-colors hover:bg-parchment"
        >
          <ArrowLeft size={16} />
          Back to comps
        </button>
        <button
          type="button"
          onClick={() => navigate(`/report/${id}`)}
          className="flex items-center gap-1.5 rounded-[8px] bg-ink px-4 py-2.5 text-sm font-medium text-parchment transition-colors hover:bg-ink/90"
        >
          Continue to report
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
