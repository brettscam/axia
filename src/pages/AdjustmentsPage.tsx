import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AppraisalProgress } from '@/components/ui/AppraisalProgress';
import { AdjustmentConfig } from '@/features/adjustments/AdjustmentConfig';
import { AdjustmentGuide } from '@/features/adjustments/AdjustmentGuide';

export function AdjustmentsPage() {
  const navigate = useNavigate();

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
          onClick={() => void navigate(-1)}
          className="flex items-center gap-1.5 rounded-[8px] border border-fog/20 bg-white px-4 py-2.5 text-sm text-slate transition-colors hover:bg-parchment"
        >
          <ArrowLeft size={16} />
          Back to comps
        </button>
        <button
          type="button"
          onClick={() => void navigate(1)}
          className="flex items-center gap-1.5 rounded-[8px] bg-ink px-4 py-2.5 text-sm font-medium text-parchment transition-colors hover:bg-ink/90"
        >
          Continue to report
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
