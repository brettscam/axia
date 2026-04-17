import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppraisalProgress } from '@/components/ui/AppraisalProgress';
import { useAppraisal } from '@/features/appraisal/useAppraisal';
import { useGenerateReport } from '@/features/ai/useGenerateReport';
import type { ReportData } from '@/features/ai/useGenerateReport';
import { ReportSection } from '@/features/ai/ReportSection';
import { AxiaThinking } from '@/brand';

const SECTIONS: { key: keyof ReportData; title: string }[] = [
  { key: 'subject_description', title: 'Subject description' },
  { key: 'neighborhood_analysis', title: 'Neighborhood analysis' },
  { key: 'site_analysis', title: 'Site analysis' },
  { key: 'comparable_analysis', title: 'Comparable analysis' },
  { key: 'adjustments_reasoning', title: 'Adjustments reasoning' },
  { key: 'reconciliation', title: 'Reconciliation' },
];

export function ReportBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: appraisal, isLoading, error: loadError } = useAppraisal(id ?? '');
  const { generate, generating, report, error: genError, reset } = useGenerateReport();

  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [editedSections, setEditedSections] = useState<Record<string, string>>({});

  // No appraisal ID in URL
  if (!id) {
    return (
      <div className="mx-auto max-w-4xl">
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
      <div className="mx-auto max-w-4xl">
        <AppraisalProgress currentStep={4} />
        <div className="flex items-center justify-center h-64">
          <p className="text-fog">Loading appraisal data...</p>
        </div>
      </div>
    );
  }

  // Error loading appraisal
  if (loadError) {
    return (
      <div className="mx-auto max-w-4xl">
        <AppraisalProgress currentStep={4} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-flag font-medium">Failed to load appraisal</p>
            <p className="text-fog text-sm mt-2">
              {loadError instanceof Error ? loadError.message : 'An unknown error occurred'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleGenerate() {
    reset();
    setAccepted({});
    setEditedSections({});

    await generate({
      appraisal_id: id,
      property_address: appraisal?.property_address ?? null,
      property_city: appraisal?.property_city ?? null,
      property_state: appraisal?.property_state ?? null,
      property_zip: appraisal?.property_zip ?? null,
      property_type: appraisal?.property_type ?? null,
      bedrooms: appraisal?.bedrooms ?? null,
      bathrooms: appraisal?.bathrooms ?? null,
      gla: appraisal?.gla ?? null,
      lot_size: appraisal?.lot_size ?? null,
      year_built: appraisal?.year_built ?? null,
      condition: appraisal?.condition ?? null,
      comps: [],
    });
  }

  function handleAccept(sectionKey: string) {
    setAccepted((prev) => ({ ...prev, [sectionKey]: true }));
  }

  function handleEdit(sectionKey: string, newContent: string) {
    setEditedSections((prev) => ({ ...prev, [sectionKey]: newContent }));
    setAccepted((prev) => ({ ...prev, [sectionKey]: true }));
  }

  function handleRegenerate(_sectionKey: string) {
    // Full regeneration for now; per-section regeneration is a future feature
    void handleGenerate();
  }

  function getSectionContent(key: keyof ReportData): string {
    if (editedSections[key] != null) return editedSections[key];
    if (report?.[key] != null) {
      const val = report[key];
      return typeof val === 'string' ? val : '';
    }
    return '';
  }

  const confidenceColor =
    report?.confidence_level?.toLowerCase() === 'high'
      ? 'bg-sage text-white'
      : report?.confidence_level?.toLowerCase() === 'medium'
        ? 'bg-gold-tint text-ink'
        : 'bg-flag/20 text-flag';

  return (
    <div className="mx-auto max-w-4xl">
      <AppraisalProgress currentStep={4} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-[22px] font-medium text-ink">
          Appraisal report
        </h1>
        {!generating && (
          <button
            type="button"
            onClick={() => void handleGenerate()}
            className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment transition-colors hover:bg-slate"
          >
            {report ? 'Regenerate full report' : 'Generate full report'}
          </button>
        )}
      </div>

      {/* Generation error */}
      {genError && (
        <div className="rounded-[12px] border border-flag/20 bg-flag/5 p-4 mb-6">
          <p className="text-sm text-flag font-medium">Generation failed</p>
          <p className="text-sm text-flag/80 mt-1">{genError}</p>
        </div>
      )}

      {/* Thinking animation */}
      {generating && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <AxiaThinking size={80} />
          <p className="text-fog text-sm">Generating appraisal report...</p>
        </div>
      )}

      {/* Sections */}
      {report && !generating && (
        <div className="space-y-6">
          {SECTIONS.map(({ key, title }) => (
            <ReportSection
              key={key}
              title={title}
              content={getSectionContent(key)}
              sectionKey={key}
              onEdit={handleEdit}
              onAccept={handleAccept}
              onRegenerate={handleRegenerate}
              accepted={accepted[key] ?? false}
            />
          ))}

          {/* Summary card */}
          <div className="rounded-[12px] border border-fog/20 bg-white p-6">
            <h3 className="font-display text-lg font-medium text-ink mb-4">
              Valuation summary
            </h3>

            <div className="flex items-baseline gap-4 mb-4">
              <div>
                <p className="text-sm text-fog mb-1">Estimated value</p>
                <p className="font-mono text-2xl text-ink">{report.estimated_value}</p>
              </div>
              <div>
                <p className="text-sm text-fog mb-1">Confidence</p>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${confidenceColor}`}>
                  {report.confidence_level}
                </span>
              </div>
            </div>

            {report.recommended_actions && report.recommended_actions.length > 0 && (
              <div>
                <p className="text-sm text-fog mb-2">Recommended actions</p>
                <ul className="space-y-2">
                  {report.recommended_actions.map((action) => (
                    <li key={action} className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded border-fog/30"
                        readOnly
                      />
                      <span className="text-sm text-ink">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state when no report yet and not generating */}
      {!report && !generating && !genError && (
        <div className="rounded-[12px] border border-fog/20 bg-white p-8">
          <div className="text-center py-8">
            <p className="text-fog text-sm">
              Generate a full appraisal report using AI. Review each section, then accept or edit.
            </p>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={() => navigate(`/adjustments/${id}`)}
          className="inline-flex items-center gap-2 rounded-[8px] border border-fog/20 bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment"
        >
          <ArrowLeft size={16} />
          Back to adjustments
        </button>

        <button
          type="button"
          disabled
          className="rounded-[8px] bg-ink px-4 py-2 text-sm font-medium text-parchment opacity-50 cursor-not-allowed"
          title="Coming soon"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}
