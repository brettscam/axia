import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppraisalProgress } from '@/components/ui/AppraisalProgress';
import { SubjectPropertyForm } from '@/features/appraisal/SubjectPropertyForm';
import { useAppraisal } from '@/features/appraisal/useAppraisal';
import { useUpdateAppraisal } from '@/features/appraisal/useUpdateAppraisal';
import { useCreateAppraisal } from '@/features/appraisal/useAppraisals';

const SAMPLE_DATA = {
  property_address: '560 N San Pedro Rd',
  property_city: 'San Rafael',
  property_state: 'CA',
  property_zip: '94903',
  property_type: 'single_family',
  bedrooms: 4,
  bathrooms: 3,
  gla: 2100,
  lot_size: 0.75,
  year_built: 1948,
  condition: 'good',
} as const;

export function PropertyInputPage() {
  const navigate = useNavigate();
  const { id: appraisalId } = useParams<{ id: string }>();

  const { data: appraisal, isLoading, error } = useAppraisal(appraisalId ?? '');
  const { mutateAsync: updateAppraisal, isPending: isSaving } = useUpdateAppraisal();
  const createAppraisal = useCreateAppraisal();

  const handleCreateAndLoad = useCallback(() => {
    createAppraisal.mutate(
      { property_address: '', client_name: '' },
      {
        onSuccess: (data) => {
          navigate(`/property/${data.id}`, { replace: true });
        },
      },
    );
  }, [createAppraisal, navigate]);

  async function handleLoadSample() {
    if (!appraisalId) {
      // Create a new appraisal first, then populate with sample data
      createAppraisal.mutate(
        { property_address: SAMPLE_DATA.property_address, client_name: '' },
        {
          onSuccess: async (data) => {
            navigate(`/property/${data.id}`, { replace: true });
            await updateAppraisal({
              id: data.id,
              data: { ...SAMPLE_DATA },
            });
          },
        },
      );
      return;
    }
    await updateAppraisal({
      id: appraisalId,
      data: { ...SAMPLE_DATA },
    });
  }

  async function handleSaveProgress() {
    // The SubjectPropertyForm auto-saves, but this gives explicit feedback.
    // We trigger a no-op update to confirm the save.
    if (!appraisalId) return;
    await updateAppraisal({
      id: appraisalId,
      data: { updated_at: new Date().toISOString() },
    });
  }

  // No appraisal selected — offer to create one
  if (!appraisalId) {
    return (
      <div>
        <AppraisalProgress currentStep={1} />
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-fog/20 bg-white py-16">
          <p className="text-fog mb-4">No appraisal in progress. Create one to get started.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCreateAndLoad}
              disabled={createAppraisal.isPending}
              className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate disabled:opacity-50"
            >
              New appraisal
            </button>
            <button
              type="button"
              onClick={() => void handleLoadSample()}
              disabled={createAppraisal.isPending}
              className="rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment disabled:opacity-50"
            >
              Load sample data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div>
        <AppraisalProgress currentStep={1} />
        <div className="flex items-center justify-center h-64">
          <p className="text-fog">Loading appraisal...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div>
        <AppraisalProgress currentStep={1} />
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

  if (!appraisal) {
    return (
      <div>
        <AppraisalProgress currentStep={1} />
        <div className="flex items-center justify-center h-64">
          <p className="text-fog">Appraisal not found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppraisalProgress currentStep={1} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[22px] font-medium text-ink">
          Property details
        </h1>
        <button
          type="button"
          onClick={() => void handleLoadSample()}
          disabled={isSaving}
          className="rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment disabled:opacity-50"
        >
          Load sample data
        </button>
      </div>

      <SubjectPropertyForm
        appraisalId={appraisalId}
        initialData={{
          property_address: appraisal.property_address,
          property_city: appraisal.property_city,
          property_state: appraisal.property_state,
          property_zip: appraisal.property_zip,
          property_type: appraisal.property_type,
          bedrooms: appraisal.bedrooms,
          bathrooms: appraisal.bathrooms,
          gla: appraisal.gla,
          lot_size: appraisal.lot_size,
          year_built: appraisal.year_built,
          condition: appraisal.condition,
        }}
      />

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => void handleSaveProgress()}
          disabled={isSaving}
          className="rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save progress'}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/comps/${appraisalId}`)}

          className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate"
        >
          Continue to comps
        </button>
      </div>
    </div>
  );
}
