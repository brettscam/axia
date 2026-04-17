import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface ReportData {
  subject_description: string;
  neighborhood_analysis: string;
  site_analysis: string;
  comparable_analysis: string;
  adjustments_reasoning: string;
  reconciliation: string;
  estimated_value: string;
  confidence_level: string;
  recommended_actions: string[];
}

export function useGenerateReport() {
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(appraisalData: Record<string, unknown>) {
    setGenerating(true);
    setError(null);
    try {
      const response = await supabase.functions.invoke('generate-appraisal-report', {
        body: appraisalData,
      });
      if (response.error) throw response.error;
      setReport(response.data as ReportData);
      return response.data as ReportData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Report generation failed';
      setError(message);
      return null;
    } finally {
      setGenerating(false);
    }
  }

  function reset() {
    setReport(null);
    setError(null);
  }

  return { generate, generating, report, error, reset };
}
